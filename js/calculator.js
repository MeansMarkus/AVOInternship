// Calculator and Project Planning Tools
class ProjectCalculator {
    constructor() {
        this.materialCosts = {
            sprinkler: {
                'rotor-head': { unit: 25, labor: 50, description: 'Rotor sprinkler head' },
                'spray-head': { unit: 15, labor: 30, description: 'Spray sprinkler head' },
                'drip-line': { unit: 0.5, labor: 2, description: 'Drip line per foot' },
                'main-pipe': { unit: 1.5, labor: 3, description: 'Main line pipe per foot' },
                'lateral-pipe': { unit: 1.0, labor: 2, description: 'Lateral pipe per foot' },
                'valve': { unit: 45, labor: 75, description: 'Control valve' },
                'controller': { unit: 150, labor: 100, description: 'Irrigation controller' },
                'backflow': { unit: 200, labor: 150, description: 'Backflow preventer' }
            },
            drain: {
                'catch-basin': { unit: 200, labor: 300, description: 'Catch basin' },
                'drain-pipe': { unit: 5, labor: 15, description: 'Drain pipe per foot' },
                'french-drain': { unit: 8, labor: 20, description: 'French drain per foot' },
                'dry-well': { unit: 800, labor: 600, description: 'Dry well' },
                'grate': { unit: 50, labor: 25, description: 'Drain grate' },
                'fabric': { unit: 0.3, labor: 0.5, description: 'Landscape fabric per sq ft' }
            },
            property: {
                'house': { unit: 0, labor: 0, description: 'Existing house' },
                'driveway': { unit: 0, labor: 0, description: 'Existing driveway' },
                'patio': { unit: 0, labor: 0, description: 'Existing patio' },
                'garden': { unit: 0, labor: 0, description: 'Garden area' }
            }
        };

        this.laborRates = {
            basic: 45,      // per hour
            skilled: 65,    // per hour
            specialized: 85 // per hour
        };

        this.permits = {
            sprinkler: 150,
            drain: 200,
            combined: 300
        };
    }

    // Calculate total project cost
    calculateProjectCost(components, projectType = 'combined') {
        let totalCost = 0;
        let breakdown = {
            materials: 0,
            labor: 0,
            permits: 0,
            equipment: 0,
            overhead: 0,
            profit: 0
        };

        // Calculate materials and labor for each component
        components.forEach(component => {
            const cost = this.calculateComponentCost(component);
            breakdown.materials += cost.materials;
            breakdown.labor += cost.labor;
        });

        // Add permits
        breakdown.permits = this.permits[projectType] || this.permits.combined;

        // Add equipment rental (if needed)
        breakdown.equipment = this.calculateEquipmentCost(components);

        // Add overhead (15% of direct costs)
        const directCosts = breakdown.materials + breakdown.labor + breakdown.permits + breakdown.equipment;
        breakdown.overhead = directCosts * 0.15;

        // Add profit margin (20% of total costs)
        const totalBeforeProfit = directCosts + breakdown.overhead;
        breakdown.profit = totalBeforeProfit * 0.20;

        totalCost = totalBeforeProfit + breakdown.profit;

        return {
            total: totalCost,
            breakdown: breakdown,
            components: components.length
        };
    }

    // Calculate cost for individual component
    calculateComponentCost(component) {
        const category = component.type.split('-')[0]; // 'sprinkler', 'drain', 'property'
        const componentType = component.component || component.type.split('-')[1];
        
        const costData = this.materialCosts[category]?.[componentType];
        
        if (!costData) {
            return { materials: 0, labor: 0 };
        }

        let materials = costData.unit;
        let labor = costData.labor;

        // Adjust for size if applicable
        if (component.size) {
            const sizeMultiplier = component.size / 20; // Base size is 20
            materials *= sizeMultiplier;
            labor *= sizeMultiplier;
        }

        // Adjust for length if it's a linear component
        if (component.length) {
            materials *= component.length;
            labor *= component.length;
        }

        return {
            materials: materials,
            labor: labor,
            description: costData.description
        };
    }

    // Calculate equipment rental costs
    calculateEquipmentCost(components) {
        let equipmentCost = 0;
        
        // Check if we need specialized equipment
        const hasSprinkler = components.some(c => c.type.startsWith('sprinkler'));
        const hasDrain = components.some(c => c.type.startsWith('drain'));
        
        if (hasSprinkler) {
            equipmentCost += 200; // Trencher rental
        }
        
        if (hasDrain) {
            equipmentCost += 300; // Excavator rental
        }
        
        // Add for large projects
        if (components.length > 20) {
            equipmentCost += 150; // Additional equipment
        }
        
        return equipmentCost;
    }

    // Calculate area and coverage
    calculateArea(components) {
        let totalArea = 0;
        let coverageAreas = [];

        components.forEach(component => {
            if (component.type.startsWith('sprinkler')) {
                const coverage = this.calculateSprinklerCoverage(component);
                coverageAreas.push(coverage);
                totalArea += coverage.area;
            } else if (component.type.startsWith('drain')) {
                const coverage = this.calculateDrainCoverage(component);
                coverageAreas.push(coverage);
                totalArea += coverage.area;
            }
        });

        return {
            totalArea: totalArea,
            coverageAreas: coverageAreas,
            efficiency: this.calculateCoverageEfficiency(coverageAreas)
        };
    }

    // Calculate sprinkler coverage area
    calculateSprinklerCoverage(component) {
        const baseRadius = {
            'rotor': 30,
            'spray': 15,
            'drip': 2
        };

        const radius = baseRadius[component.component] || 15;
        const area = Math.PI * radius * radius;

        return {
            componentId: component.id,
            type: 'sprinkler',
            radius: radius,
            area: area,
            efficiency: 0.85 // 85% efficiency for sprinklers
        };
    }

    // Calculate drain coverage area
    calculateDrainCoverage(component) {
        const baseRadius = {
            'catch-basin': 50,
            'drain-pipe': 30,
            'french-drain': 25,
            'dry-well': 75
        };

        const radius = baseRadius[component.component] || 30;
        const area = Math.PI * radius * radius;

        return {
            componentId: component.id,
            type: 'drain',
            radius: radius,
            area: area,
            efficiency: 0.90 // 90% efficiency for drains
        };
    }

    // Calculate coverage efficiency
    calculateCoverageEfficiency(coverageAreas) {
        if (coverageAreas.length === 0) return 0;

        const totalArea = coverageAreas.reduce((sum, area) => sum + area.area, 0);
        const effectiveArea = coverageAreas.reduce((sum, area) => sum + (area.area * area.efficiency), 0);

        return (effectiveArea / totalArea) * 100;
    }

    // Calculate water usage and efficiency
    calculateWaterUsage(components) {
        const sprinklerComponents = components.filter(c => c.type.startsWith('sprinkler'));
        
        let totalFlow = 0;
        let dailyUsage = 0;
        let monthlyUsage = 0;

        sprinklerComponents.forEach(component => {
            const flowRate = this.getComponentFlowRate(component);
            totalFlow += flowRate;
        });

        // Calculate daily usage (assuming 30 minutes per day)
        dailyUsage = totalFlow * 0.5; // 30 minutes = 0.5 hours
        monthlyUsage = dailyUsage * 30;

        return {
            totalFlow: totalFlow,
            dailyUsage: dailyUsage,
            monthlyUsage: monthlyUsage,
            annualUsage: monthlyUsage * 12,
            efficiency: this.calculateWaterEfficiency(components)
        };
    }

    // Get component flow rate
    getComponentFlowRate(component) {
        const flowRates = {
            'rotor': 2.5, // GPM
            'spray': 1.5, // GPM
            'drip': 0.5   // GPM
        };

        return flowRates[component.component] || 1.5;
    }

    // Calculate water efficiency
    calculateWaterEfficiency(components) {
        const sprinklerComponents = components.filter(c => c.type.startsWith('sprinkler'));
        
        if (sprinklerComponents.length === 0) return 0;

        let totalEfficiency = 0;
        sprinklerComponents.forEach(component => {
            const efficiency = {
                'rotor': 0.85,
                'spray': 0.80,
                'drip': 0.95
            };
            totalEfficiency += efficiency[component.component] || 0.80;
        });

        return totalEfficiency / sprinklerComponents.length;
    }

    // Calculate project timeline
    calculateTimeline(components, crewSize = 2) {
        let totalHours = 0;

        components.forEach(component => {
            const hours = this.getComponentInstallationTime(component);
            totalHours += hours;
        });

        // Add setup and cleanup time
        totalHours += 4; // 2 hours setup + 2 hours cleanup

        // Calculate days based on crew size and 8-hour work days
        const workDays = Math.ceil(totalHours / (crewSize * 8));
        const calendarDays = Math.ceil(workDays * 1.2); // Add 20% buffer for weather, etc.

        return {
            totalHours: totalHours,
            workDays: workDays,
            calendarDays: calendarDays,
            crewSize: crewSize,
            startDate: new Date(),
            estimatedCompletion: this.addDays(new Date(), calendarDays)
        };
    }

    // Get installation time for component
    getComponentInstallationTime(component) {
        const installationTimes = {
            'sprinkler-head': {
                'rotor': 1.5,    // hours
                'spray': 1.0,    // hours
                'drip': 0.5      // hours
            },
            'sprinkler-pipe': {
                'main': 0.2,     // hours per foot
                'lateral': 0.15  // hours per foot
            },
            'drain': {
                'catch-basin': 4.0,   // hours
                'drain-pipe': 0.3,    // hours per foot
                'french-drain': 0.5,  // hours per foot
                'dry-well': 8.0       // hours
            }
        };

        const category = component.type;
        const type = component.component;

        if (installationTimes[category]?.[type]) {
            let time = installationTimes[category][type];
            
            // Adjust for size/length
            if (component.size) {
                time *= (component.size / 20);
            }
            if (component.length) {
                time *= component.length;
            }
            
            return time;
        }

        return 1.0; // Default 1 hour
    }

    // Add days to date
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    // Calculate ROI and savings
    calculateROI(projectCost, propertyValue) {
        const annualWaterSavings = 300; // Estimated annual water savings
        const annualMaintenanceSavings = 200; // Estimated maintenance savings
        const totalAnnualSavings = annualWaterSavings + annualMaintenanceSavings;
        
        const paybackPeriod = projectCost.total / totalAnnualSavings;
        const fiveYearROI = (totalAnnualSavings * 5 - projectCost.total) / projectCost.total * 100;
        const propertyValueIncrease = projectCost.total * 0.8; // 80% of project cost added to property value

        return {
            annualSavings: totalAnnualSavings,
            paybackPeriod: paybackPeriod,
            fiveYearROI: fiveYearROI,
            propertyValueIncrease: propertyValueIncrease,
            totalROI: (totalAnnualSavings * 10 - projectCost.total) / projectCost.total * 100 // 10-year ROI
        };
    }

    // Generate project proposal
    generateProposal(components, customerInfo = {}) {
        const cost = this.calculateProjectCost(components);
        const area = this.calculateArea(components);
        const waterUsage = this.calculateWaterUsage(components);
        const timeline = this.calculateTimeline(components);
        const roi = this.calculateROI(cost, customerInfo.propertyValue || 200000);

        return {
            customerInfo: customerInfo,
            projectSummary: {
                totalComponents: components.length,
                totalArea: area.totalArea,
                estimatedCost: cost.total,
                timeline: timeline.calendarDays
            },
            costBreakdown: cost.breakdown,
            areaAnalysis: area,
            waterUsage: waterUsage,
            timeline: timeline,
            roi: roi,
            recommendations: this.generateRecommendations(components, area, waterUsage),
            warranty: {
                materials: '2 years',
                labor: '1 year',
                controller: '3 years'
            },
            terms: {
                deposit: '50% upon contract signing',
                progress: '25% at 50% completion',
                final: '25% upon completion'
            }
        };
    }

    // Generate recommendations
    generateRecommendations(components, area, waterUsage) {
        const recommendations = [];

        // Coverage recommendations
        if (area.efficiency < 80) {
            recommendations.push({
                type: 'coverage',
                priority: 'high',
                message: 'Consider adding more sprinkler heads to improve coverage efficiency.',
                impact: 'Will improve watering uniformity and reduce water waste.'
            });
        }

        // Water efficiency recommendations
        if (waterUsage.efficiency < 0.85) {
            recommendations.push({
                type: 'efficiency',
                priority: 'medium',
                message: 'Consider upgrading to more efficient sprinkler heads.',
                impact: 'Will reduce water consumption and lower monthly bills.'
            });
        }

        // System size recommendations
        if (components.length > 30) {
            recommendations.push({
                type: 'system',
                priority: 'medium',
                message: 'Consider dividing the system into zones for better control.',
                impact: 'Will improve water pressure and allow for more precise watering schedules.'
            });
        }

        // Maintenance recommendations
        recommendations.push({
            type: 'maintenance',
            priority: 'low',
            message: 'Schedule annual system inspection and maintenance.',
            impact: 'Will extend system life and prevent costly repairs.'
        });

        return recommendations;
    }

    // Export project data
    exportProjectData(components, customerInfo = {}) {
        const proposal = this.generateProposal(components, customerInfo);
        
        return {
            timestamp: new Date(),
            version: '1.0',
            proposal: proposal,
            rawData: {
                components: components,
                calculations: {
                    cost: this.calculateProjectCost(components),
                    area: this.calculateArea(components),
                    waterUsage: this.calculateWaterUsage(components),
                    timeline: this.calculateTimeline(components)
                }
            }
        };
    }
}

// Initialize calculator
let projectCalculator = new ProjectCalculator();

// Export for use in main map
if (typeof window !== 'undefined') {
    window.projectCalculator = projectCalculator;
}
