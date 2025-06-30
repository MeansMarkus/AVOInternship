// Sprinkler System Management
class SprinklerSystem {
    constructor() {
        this.sprinklerHeads = [];
        this.pipeNetwork = [];
        this.coverageZones = [];
        this.waterFlow = {
            pressure: 60, // PSI
            flowRate: 0, // GPM
            totalHeads: 0
        };
    }

    // Add sprinkler head to the system
    addSprinklerHead(latlng, type, specifications = {}) {
        const head = {
            id: Date.now() + Math.random(),
            type: type, // 'rotor', 'spray', 'drip'
            latlng: latlng,
            specifications: {
                coverageRadius: specifications.coverageRadius || this.getDefaultCoverage(type),
                flowRate: specifications.flowRate || this.getDefaultFlowRate(type),
                pressure: specifications.pressure || 60,
                pattern: specifications.pattern || 'full',
                ...specifications
            },
            status: 'active',
            timestamp: new Date()
        };

        this.sprinklerHeads.push(head);
        this.updateWaterFlow();
        this.calculateCoverage();
        
        return head;
    }

    // Get default coverage radius based on sprinkler type
    getDefaultCoverage(type) {
        const coverage = {
            'rotor': 30, // feet
            'spray': 15, // feet
            'drip': 2    // feet
        };
        return coverage[type] || 15;
    }

    // Get default flow rate based on sprinkler type
    getDefaultFlowRate(type) {
        const flowRates = {
            'rotor': 2.5, // GPM
            'spray': 1.5, // GPM
            'drip': 0.5   // GPM
        };
        return flowRates[type] || 1.5;
    }

    // Add pipe to the system
    addPipe(startPoint, endPoint, specifications = {}) {
        const pipe = {
            id: Date.now() + Math.random(),
            startPoint: startPoint,
            endPoint: endPoint,
            specifications: {
                diameter: specifications.diameter || 1, // inches
                material: specifications.material || 'PVC',
                length: this.calculateDistance(startPoint, endPoint),
                flowCapacity: specifications.flowCapacity || this.calculatePipeCapacity(specifications.diameter || 1),
                ...specifications
            },
            status: 'active',
            timestamp: new Date()
        };

        this.pipeNetwork.push(pipe);
        return pipe;
    }

    // Calculate distance between two points
    calculateDistance(point1, point2) {
        const R = 20902231; // Earth's radius in feet
        const lat1 = point1.lat * Math.PI / 180;
        const lat2 = point2.lat * Math.PI / 180;
        const deltaLat = (point2.lat - point1.lat) * Math.PI / 180;
        const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;

        const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }

    // Calculate pipe capacity based on diameter
    calculatePipeCapacity(diameter) {
        // Simplified calculation - in practice, use proper hydraulic tables
        const capacities = {
            0.5: 2,   // 1/2 inch
            0.75: 4,  // 3/4 inch
            1: 8,     // 1 inch
            1.25: 12, // 1-1/4 inch
            1.5: 18,  // 1-1/2 inch
            2: 30     // 2 inch
        };
        return capacities[diameter] || 8;
    }

    // Calculate coverage area for all sprinkler heads
    calculateCoverage() {
        this.coverageZones = this.sprinklerHeads.map(head => {
            const radius = head.specifications.coverageRadius;
            const center = head.latlng;
            
            // Create a circle around the sprinkler head
            const points = this.generateCirclePoints(center, radius, 32);
            
            return {
                headId: head.id,
                center: center,
                radius: radius,
                points: points,
                area: Math.PI * radius * radius,
                overlap: this.calculateOverlap(head)
            };
        });
    }

    // Generate points for a circle
    generateCirclePoints(center, radius, numPoints = 32) {
        const points = [];
        const angleStep = (2 * Math.PI) / numPoints;
        
        for (let i = 0; i < numPoints; i++) {
            const angle = i * angleStep;
            const lat = center.lat + (radius / 364000) * Math.cos(angle); // Convert feet to degrees
            const lng = center.lng + (radius / 364000) * Math.sin(angle) / Math.cos(center.lat * Math.PI / 180);
            points.push([lat, lng]);
        }
        
        return points;
    }

    // Calculate overlap with other sprinkler heads
    calculateOverlap(head) {
        const overlaps = [];
        const headCenter = head.latlng;
        const headRadius = head.specifications.coverageRadius;

        this.sprinklerHeads.forEach(otherHead => {
            if (otherHead.id !== head.id) {
                const distance = this.calculateDistance(headCenter, otherHead.latlng);
                const otherRadius = otherHead.specifications.coverageRadius;
                
                if (distance < (headRadius + otherRadius)) {
                    overlaps.push({
                        headId: otherHead.id,
                        distance: distance,
                        overlapArea: this.calculateOverlapArea(headRadius, otherRadius, distance)
                    });
                }
            }
        });

        return overlaps;
    }

    // Calculate overlap area between two circles
    calculateOverlapArea(radius1, radius2, distance) {
        if (distance >= radius1 + radius2) return 0;
        if (distance <= Math.abs(radius1 - radius2)) {
            return Math.PI * Math.min(radius1, radius2) * Math.min(radius1, radius2);
        }

        const a = radius1 * radius1;
        const b = radius2 * radius2;
        const d = distance * distance;

        const x = (a - b + d) / (2 * distance);
        const y = Math.sqrt(a - x * x);

        const angle1 = 2 * Math.acos(x / radius1);
        const angle2 = 2 * Math.acos((distance - x) / radius2);

        const area1 = 0.5 * radius1 * radius1 * angle1 - 0.5 * radius1 * radius1 * Math.sin(angle1);
        const area2 = 0.5 * radius2 * radius2 * angle2 - 0.5 * radius2 * radius2 * Math.sin(angle2);

        return area1 + area2;
    }

    // Update water flow calculations
    updateWaterFlow() {
        this.waterFlow.totalHeads = this.sprinklerHeads.length;
        this.waterFlow.flowRate = this.sprinklerHeads.reduce((total, head) => {
            return total + head.specifications.flowRate;
        }, 0);

        // Calculate pressure drop (simplified)
        this.waterFlow.pressureDrop = this.calculatePressureDrop();
    }

    // Calculate pressure drop in the system
    calculatePressureDrop() {
        let totalDrop = 0;
        
        this.pipeNetwork.forEach(pipe => {
            // Simplified pressure drop calculation
            // In practice, use Hazen-Williams or Darcy-Weisbach equations
            const length = pipe.specifications.length;
            const diameter = pipe.specifications.diameter;
            const flowRate = pipe.specifications.flowCapacity;
            
            // Simplified formula: pressure drop = length * flow_rate^2 / diameter^5
            const drop = length * Math.pow(flowRate, 2) / Math.pow(diameter, 5) * 0.01;
            totalDrop += drop;
        });

        return totalDrop;
    }

    // Get system efficiency
    getSystemEfficiency() {
        const totalArea = this.coverageZones.reduce((total, zone) => total + zone.area, 0);
        const overlapArea = this.coverageZones.reduce((total, zone) => {
            return total + zone.overlap.reduce((overlapTotal, overlap) => overlapTotal + overlap.overlapArea, 0);
        }, 0);

        const effectiveArea = totalArea - overlapArea;
        return {
            totalArea: totalArea,
            effectiveArea: effectiveArea,
            overlapArea: overlapArea,
            efficiency: (effectiveArea / totalArea) * 100
        };
    }

    // Get watering schedule recommendations
    getWateringSchedule() {
        const efficiency = this.getSystemEfficiency();
        const totalFlow = this.waterFlow.flowRate;
        
        // Simplified watering schedule based on Oklahoma climate
        const schedule = {
            spring: {
                frequency: '2-3 times per week',
                duration: Math.round((efficiency.effectiveArea * 0.5) / totalFlow), // minutes
                timeOfDay: 'Early morning (6-8 AM)'
            },
            summer: {
                frequency: '3-4 times per week',
                duration: Math.round((efficiency.effectiveArea * 0.75) / totalFlow), // minutes
                timeOfDay: 'Early morning (5-7 AM)'
            },
            fall: {
                frequency: '1-2 times per week',
                duration: Math.round((efficiency.effectiveArea * 0.4) / totalFlow), // minutes
                timeOfDay: 'Early morning (6-8 AM)'
            },
            winter: {
                frequency: 'As needed',
                duration: Math.round((efficiency.effectiveArea * 0.2) / totalFlow), // minutes
                timeOfDay: 'Midday (10 AM - 2 PM)'
            }
        };

        return schedule;
    }

    // Get cost estimate for the sprinkler system
    getCostEstimate() {
        const headCosts = {
            'rotor': 25,
            'spray': 15,
            'drip': 5
        };

        const pipeCosts = {
            0.5: 0.5,   // $0.50 per foot
            0.75: 0.75, // $0.75 per foot
            1: 1,       // $1.00 per foot
            1.25: 1.5,  // $1.50 per foot
            1.5: 2,     // $2.00 per foot
            2: 3        // $3.00 per foot
        };

        const headCost = this.sprinklerHeads.reduce((total, head) => {
            return total + (headCosts[head.type] || 15);
        }, 0);

        const pipeCost = this.pipeNetwork.reduce((total, pipe) => {
            const costPerFoot = pipeCosts[pipe.specifications.diameter] || 1;
            return total + (pipe.specifications.length * costPerFoot);
        }, 0);

        const laborCost = (this.sprinklerHeads.length * 50) + (this.pipeNetwork.length * 25);
        const materialsCost = headCost + pipeCost + 200; // $200 for valves, controller, etc.

        return {
            materials: materialsCost,
            labor: laborCost,
            total: materialsCost + laborCost,
            breakdown: {
                heads: headCost,
                pipes: pipeCost,
                other: 200,
                labor: laborCost
            }
        };
    }

    // Validate system design
    validateSystem() {
        const issues = [];

        // Check for adequate coverage
        const efficiency = this.getSystemEfficiency();
        if (efficiency.efficiency < 80) {
            issues.push({
                type: 'coverage',
                severity: 'warning',
                message: `System efficiency is ${efficiency.efficiency.toFixed(1)}%. Consider adding more sprinkler heads for better coverage.`
            });
        }

        // Check for pressure issues
        if (this.waterFlow.pressureDrop > 20) {
            issues.push({
                type: 'pressure',
                severity: 'error',
                message: `Pressure drop of ${this.waterFlow.pressureDrop.toFixed(1)} PSI is too high. Consider larger pipes or pressure booster.`
            });
        }

        // Check for flow rate issues
        if (this.waterFlow.flowRate > 20) {
            issues.push({
                type: 'flow',
                severity: 'warning',
                message: `Total flow rate of ${this.waterFlow.flowRate.toFixed(1)} GPM may exceed typical residential water supply.`
            });
        }

        return {
            valid: issues.filter(issue => issue.severity === 'error').length === 0,
            issues: issues
        };
    }

    // Export system data
    exportSystemData() {
        return {
            sprinklerHeads: this.sprinklerHeads,
            pipeNetwork: this.pipeNetwork,
            coverageZones: this.coverageZones,
            waterFlow: this.waterFlow,
            efficiency: this.getSystemEfficiency(),
            schedule: this.getWateringSchedule(),
            costEstimate: this.getCostEstimate(),
            validation: this.validateSystem(),
            timestamp: new Date()
        };
    }

    // Import system data
    importSystemData(data) {
        this.sprinklerHeads = data.sprinklerHeads || [];
        this.pipeNetwork = data.pipeNetwork || [];
        this.coverageZones = data.coverageZones || [];
        this.waterFlow = data.waterFlow || this.waterFlow;
        
        this.updateWaterFlow();
        this.calculateCoverage();
    }
}

// Initialize sprinkler system
let sprinklerSystem = new SprinklerSystem();

// Export for use in main map
if (typeof window !== 'undefined') {
    window.sprinklerSystem = sprinklerSystem;
}
