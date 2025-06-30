// Drain System Management
class DrainSystem {
    constructor() {
        this.drainComponents = [];
        this.drainageAreas = [];
        this.pipeNetwork = [];
        this.flowCalculations = {
            totalFlow: 0,
            peakFlow: 0,
            capacity: 0
        };
    }

    // Add drain component to the system
    addDrainComponent(latlng, type, specifications = {}) {
        const component = {
            id: Date.now() + Math.random(),
            type: type, // 'catch-basin', 'drain-pipe', 'french-drain', 'dry-well'
            latlng: latlng,
            specifications: {
                capacity: specifications.capacity || this.getDefaultCapacity(type),
                depth: specifications.depth || this.getDefaultDepth(type),
                diameter: specifications.diameter || this.getDefaultDiameter(type),
                slope: specifications.slope || 0.02, // 2% default slope
                material: specifications.material || this.getDefaultMaterial(type),
                ...specifications
            },
            status: 'active',
            timestamp: new Date()
        };

        this.drainComponents.push(component);
        this.updateFlowCalculations();
        this.calculateDrainageAreas();
        
        return component;
    }

    // Get default capacity based on drain type
    getDefaultCapacity(type) {
        const capacities = {
            'catch-basin': 50,    // gallons per minute
            'drain-pipe': 100,    // gallons per minute
            'french-drain': 25,   // gallons per minute
            'dry-well': 200       // gallons per minute
        };
        return capacities[type] || 50;
    }

    // Get default depth based on drain type
    getDefaultDepth(type) {
        const depths = {
            'catch-basin': 3,     // feet
            'drain-pipe': 2,      // feet
            'french-drain': 1.5,  // feet
            'dry-well': 6         // feet
        };
        return depths[type] || 2;
    }

    // Get default diameter based on drain type
    getDefaultDiameter(type) {
        const diameters = {
            'catch-basin': 24,    // inches
            'drain-pipe': 4,      // inches
            'french-drain': 6,    // inches
            'dry-well': 36        // inches
        };
        return diameters[type] || 4;
    }

    // Get default material based on drain type
    getDefaultMaterial(type) {
        const materials = {
            'catch-basin': 'concrete',
            'drain-pipe': 'PVC',
            'french-drain': 'perforated PVC',
            'dry-well': 'concrete'
        };
        return materials[type] || 'PVC';
    }

    // Add drainage pipe to the system
    addDrainPipe(startPoint, endPoint, specifications = {}) {
        const pipe = {
            id: Date.now() + Math.random(),
            startPoint: startPoint,
            endPoint: endPoint,
            specifications: {
                diameter: specifications.diameter || 4, // inches
                material: specifications.material || 'PVC',
                length: this.calculateDistance(startPoint, endPoint),
                slope: specifications.slope || 0.02, // 2% slope
                capacity: specifications.capacity || this.calculatePipeCapacity(specifications.diameter || 4),
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

    // Calculate pipe capacity based on diameter and slope
    calculatePipeCapacity(diameter, slope = 0.02) {
        // Manning's equation for pipe flow (simplified)
        const n = 0.013; // Manning's roughness coefficient for PVC
        const radius = diameter / 24; // Convert inches to feet
        const area = Math.PI * radius * radius;
        const hydraulicRadius = radius / 2;
        
        // Manning's equation: Q = (1/n) * A * R^(2/3) * S^(1/2)
        const velocity = (1/n) * Math.pow(hydraulicRadius, 2/3) * Math.pow(slope, 1/2);
        const flowRate = area * velocity * 7.48; // Convert to gallons per minute
        
        return Math.min(flowRate, 500); // Cap at 500 GPM for safety
    }

    // Calculate drainage areas for all components
    calculateDrainageAreas() {
        this.drainageAreas = this.drainComponents.map(component => {
            const radius = this.getDrainageRadius(component);
            const center = component.latlng;
            
            // Create a circle around the drain component
            const points = this.generateCirclePoints(center, radius, 32);
            
            return {
                componentId: component.id,
                center: center,
                radius: radius,
                points: points,
                area: Math.PI * radius * radius,
                flowRate: this.calculateAreaFlowRate(radius, component.specifications.slope)
            };
        });
    }

    // Get drainage radius based on component type and specifications
    getDrainageRadius(component) {
        const baseRadius = {
            'catch-basin': 50,    // feet
            'drain-pipe': 30,     // feet
            'french-drain': 25,   // feet
            'dry-well': 75        // feet
        };

        const radius = baseRadius[component.type] || 30;
        return radius * (component.specifications.capacity / this.getDefaultCapacity(component.type));
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

    // Calculate flow rate for a drainage area
    calculateAreaFlowRate(radius, slope) {
        const area = Math.PI * radius * radius; // square feet
        const rainfallIntensity = this.getRainfallIntensity(); // inches per hour
        
        // Rational method: Q = C * i * A
        // Where C = runoff coefficient, i = rainfall intensity, A = area
        const runoffCoefficient = 0.8; // Typical for residential areas
        const flowRate = runoffCoefficient * rainfallIntensity * area / 12; // Convert to cubic feet per second
        const flowRateGPM = flowRate * 448.8; // Convert to gallons per minute
        
        return flowRateGPM;
    }

    // Get rainfall intensity for Oklahoma (simplified)
    getRainfallIntensity() {
        // Based on Oklahoma rainfall data - 10-year storm event
        const monthlyRainfall = {
            'jan': 1.5, 'feb': 1.8, 'mar': 2.5, 'apr': 3.2,
            'may': 4.8, 'jun': 4.2, 'jul': 3.1, 'aug': 2.8,
            'sep': 3.5, 'oct': 3.1, 'nov': 2.2, 'dec': 1.7
        };
        
        const currentMonth = new Date().getMonth();
        const monthNames = Object.keys(monthlyRainfall);
        const currentMonthName = monthNames[currentMonth];
        
        return monthlyRainfall[currentMonthName] || 3.0; // Default to 3 inches per hour
    }

    // Update flow calculations
    updateFlowCalculations() {
        this.flowCalculations.totalFlow = this.drainComponents.reduce((total, component) => {
            return total + component.specifications.capacity;
        }, 0);

        this.flowCalculations.peakFlow = this.calculatePeakFlow();
        this.flowCalculations.capacity = this.calculateSystemCapacity();
    }

    // Calculate peak flow during storm events
    calculatePeakFlow() {
        const totalArea = this.drainageAreas.reduce((total, area) => total + area.area, 0);
        const rainfallIntensity = this.getRainfallIntensity();
        const runoffCoefficient = 0.8;
        
        const peakFlow = runoffCoefficient * rainfallIntensity * totalArea / 12 * 448.8; // GPM
        return peakFlow;
    }

    // Calculate total system capacity
    calculateSystemCapacity() {
        const componentCapacity = this.drainComponents.reduce((total, component) => {
            return total + component.specifications.capacity;
        }, 0);

        const pipeCapacity = this.pipeNetwork.reduce((total, pipe) => {
            return total + pipe.specifications.capacity;
        }, 0);

        return Math.min(componentCapacity, pipeCapacity);
    }

    // Get system efficiency
    getSystemEfficiency() {
        const totalArea = this.drainageAreas.reduce((total, area) => total + area.area, 0);
        const totalFlow = this.flowCalculations.totalFlow;
        const peakFlow = this.flowCalculations.peakFlow;
        const capacity = this.flowCalculations.capacity;

        return {
            totalArea: totalArea,
            totalFlow: totalFlow,
            peakFlow: peakFlow,
            capacity: capacity,
            efficiency: (capacity / peakFlow) * 100,
            adequacy: capacity >= peakFlow ? 'adequate' : 'insufficient'
        };
    }

    // Get maintenance schedule
    getMaintenanceSchedule() {
        const schedule = {
            'catch-basin': {
                frequency: 'Every 3 months',
                tasks: ['Remove debris', 'Check grate condition', 'Inspect for damage'],
                estimatedCost: 50
            },
            'drain-pipe': {
                frequency: 'Every 6 months',
                tasks: ['Check for blockages', 'Inspect joints', 'Test flow capacity'],
                estimatedCost: 75
            },
            'french-drain': {
                frequency: 'Every 12 months',
                tasks: ['Check for sediment buildup', 'Inspect fabric condition', 'Test drainage'],
                estimatedCost: 100
            },
            'dry-well': {
                frequency: 'Every 24 months',
                tasks: ['Check sediment levels', 'Inspect structural integrity', 'Test absorption'],
                estimatedCost: 150
            }
        };

        return schedule;
    }

    // Get cost estimate for the drain system
    getCostEstimate() {
        const componentCosts = {
            'catch-basin': {
                materials: 200,
                labor: 300,
                total: 500
            },
            'drain-pipe': {
                materials: 5, // per foot
                labor: 15,    // per foot
                total: 20     // per foot
            },
            'french-drain': {
                materials: 8, // per foot
                labor: 20,    // per foot
                total: 28     // per foot
            },
            'dry-well': {
                materials: 800,
                labor: 600,
                total: 1400
            }
        };

        let totalCost = 0;
        let breakdown = {
            components: 0,
            pipes: 0,
            labor: 0,
            materials: 0
        };

        // Calculate component costs
        this.drainComponents.forEach(component => {
            const costs = componentCosts[component.type];
            if (costs) {
                if (component.type === 'drain-pipe' || component.type === 'french-drain') {
                    const length = component.specifications.length || 10; // Default 10 feet
                    totalCost += costs.total * length;
                    breakdown.components += costs.materials * length;
                    breakdown.labor += costs.labor * length;
                    breakdown.materials += costs.materials * length;
                } else {
                    totalCost += costs.total;
                    breakdown.components += costs.materials;
                    breakdown.labor += costs.labor;
                    breakdown.materials += costs.materials;
                }
            }
        });

        // Calculate pipe network costs
        this.pipeNetwork.forEach(pipe => {
            const pipeCost = componentCosts['drain-pipe'];
            const length = pipe.specifications.length;
            totalCost += pipeCost.total * length;
            breakdown.pipes += pipeCost.materials * length;
            breakdown.labor += pipeCost.labor * length;
            breakdown.materials += pipeCost.materials * length;
        });

        return {
            total: totalCost,
            breakdown: breakdown
        };
    }

    // Validate system design
    validateSystem() {
        const issues = [];
        const efficiency = this.getSystemEfficiency();

        // Check for adequate capacity
        if (efficiency.capacity < efficiency.peakFlow) {
            issues.push({
                type: 'capacity',
                severity: 'error',
                message: `System capacity (${efficiency.capacity.toFixed(1)} GPM) is insufficient for peak flow (${efficiency.peakFlow.toFixed(1)} GPM). Consider adding more drain components or larger pipes.`
            });
        }

        // Check for proper slope
        this.pipeNetwork.forEach(pipe => {
            if (pipe.specifications.slope < 0.01) {
                issues.push({
                    type: 'slope',
                    severity: 'warning',
                    message: `Pipe slope of ${(pipe.specifications.slope * 100).toFixed(1)}% may be too shallow for proper drainage. Minimum recommended slope is 1%.`
                });
            }
        });

        // Check for adequate coverage
        const totalArea = efficiency.totalArea;
        const recommendedArea = 10000; // 10,000 sq ft for typical residential lot
        if (totalArea < recommendedArea) {
            issues.push({
                type: 'coverage',
                severity: 'info',
                message: `Drainage area of ${totalArea.toFixed(0)} sq ft may be adequate for smaller properties.`
            });
        }

        return {
            valid: issues.filter(issue => issue.severity === 'error').length === 0,
            issues: issues
        };
    }

    // Get Oklahoma-specific drainage recommendations
    getOklahomaRecommendations() {
        return {
            climate: {
                rainfall: 'Oklahoma receives 30-50 inches of rainfall annually',
                storms: 'Frequent thunderstorms and occasional severe weather',
                soil: 'Varied soil types including clay, loam, and sandy soils'
            },
            recommendations: [
                'Install catch basins at low points to prevent standing water',
                'Use French drains for areas with poor soil drainage',
                'Ensure proper slope (minimum 1%) for all drainage pipes',
                'Consider dry wells for areas with limited drainage options',
                'Regular maintenance is crucial due to Oklahoma\'s weather patterns'
            ],
            regulations: [
                'Check local building codes for drainage requirements',
                'Ensure drainage doesn\'t negatively impact neighboring properties',
                'Consider environmental regulations for stormwater management'
            ]
        };
    }

    // Export system data
    exportSystemData() {
        return {
            drainComponents: this.drainComponents,
            pipeNetwork: this.pipeNetwork,
            drainageAreas: this.drainageAreas,
            flowCalculations: this.flowCalculations,
            efficiency: this.getSystemEfficiency(),
            maintenanceSchedule: this.getMaintenanceSchedule(),
            costEstimate: this.getCostEstimate(),
            validation: this.validateSystem(),
            oklahomaRecommendations: this.getOklahomaRecommendations(),
            timestamp: new Date()
        };
    }

    // Import system data
    importSystemData(data) {
        this.drainComponents = data.drainComponents || [];
        this.pipeNetwork = data.pipeNetwork || [];
        this.drainageAreas = data.drainageAreas || [];
        this.flowCalculations = data.flowCalculations || this.flowCalculations;
        
        this.updateFlowCalculations();
        this.calculateDrainageAreas();
    }
}

// Initialize drain system
let drainSystem = new DrainSystem();

// Export for use in main map
if (typeof window !== 'undefined') {
    window.drainSystem = drainSystem;
}
