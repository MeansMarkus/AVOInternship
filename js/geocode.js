// Geocoding and Location Services
class GeocodingService {
    constructor() {
        this.oklahomaCities = {
            'oklahoma city': { lat: 35.4676, lng: -97.5164, population: 681054 },
            'tulsa': { lat: 36.1540, lng: -95.9928, population: 413066 },
            'norman': { lat: 35.2226, lng: -97.4395, population: 124880 },
            'edmond': { lat: 35.3395, lng: -97.4867, population: 94428 },
            'broken arrow': { lat: 36.0526, lng: -95.7908, population: 113540 },
            'lawton': { lat: 34.6086, lng: -98.3903, population: 93025 },
            'moore': { lat: 35.3395, lng: -97.4867, population: 61632 },
            'midwest city': { lat: 35.4495, lng: -97.3967, population: 57340 },
            'enid': { lat: 36.3956, lng: -97.8784, population: 49379 },
            'stillwater': { lat: 36.1156, lng: -97.0584, population: 50299 },
            'ardmore': { lat: 34.1742, lng: -97.1436, population: 24698 },
            'bartlesville': { lat: 36.7473, lng: -95.9808, population: 35987 },
            'duncan': { lat: 34.5023, lng: -97.9578, population: 23331 },
            'ponca city': { lat: 36.7070, lng: -97.0856, population: 24136 },
            'shawnee': { lat: 35.3273, lng: -96.9253, population: 31543 },
            'yukon': { lat: 35.5067, lng: -97.7625, population: 27601 },
            'del city': { lat: 35.4420, lng: -97.4409, population: 21756 },
            'bixby': { lat: 35.9420, lng: -95.8833, population: 28408 },
            'owasso': { lat: 36.2695, lng: -95.8547, population: 36407 },
            'jenks': { lat: 36.0229, lng: -95.9683, population: 23331 }
        };

        this.counties = {
            'oklahoma': { lat: 35.5514, lng: -97.4075, population: 796292 },
            'tulsa': { lat: 36.1215, lng: -95.9411, population: 669279 },
            'cleveland': { lat: 35.2031, lng: -97.3264, population: 295528 },
            'canadian': { lat: 35.5425, lng: -97.9847, population: 154405 },
            'comanche': { lat: 34.6623, lng: -98.4714, population: 121125 },
            'rogers': { lat: 36.3719, lng: -95.6047, population: 92459 },
            'wagoner': { lat: 35.9611, lng: -95.5194, population: 73085 },
            'payne': { lat: 36.0770, lng: -96.9728, population: 81784 },
            'pottawatomie': { lat: 35.2067, lng: -96.9489, population: 72592 },
            'garfield': { lat: 36.3789, lng: -97.7828, population: 62294 }
        };

        this.landmarks = {
            'bricktown': { lat: 35.4676, lng: -97.5164, type: 'entertainment' },
            'oklahoma city zoo': { lat: 35.5047, lng: -97.4639, type: 'attraction' },
            'myriad botanical gardens': { lat: 35.4676, lng: -97.5164, type: 'park' },
            'oklahoma state capitol': { lat: 35.4922, lng: -97.5033, type: 'government' },
            'gaylord family oklahoma memorial stadium': { lat: 35.2067, lng: -96.9489, type: 'sports' },
            'tulsa zoo': { lat: 36.1540, lng: -95.9928, type: 'attraction' },
            'gathering place': { lat: 36.1540, lng: -95.9928, type: 'park' },
            'philbrook museum': { lat: 36.1540, lng: -95.9928, type: 'museum' }
        };
    }

    // Search for address or location
    async searchLocation(query) {
        const searchTerm = query.toLowerCase().trim();
        
        // Check for exact city matches
        if (this.oklahomaCities[searchTerm]) {
            return {
                type: 'city',
                data: this.oklahomaCities[searchTerm],
                query: query
            };
        }

        // Check for county matches
        if (this.counties[searchTerm]) {
            return {
                type: 'county',
                data: this.counties[searchTerm],
                query: query
            };
        }

        // Check for landmark matches
        if (this.landmarks[searchTerm]) {
            return {
                type: 'landmark',
                data: this.landmarks[searchTerm],
                query: query
            };
        }

        // Check for partial matches
        const partialMatches = this.findPartialMatches(searchTerm);
        if (partialMatches.length > 0) {
            return {
                type: 'partial',
                data: partialMatches,
                query: query
            };
        }

        // If no matches found, try to geocode using a fallback service
        return await this.fallbackGeocode(query);
    }

    // Find partial matches for search terms
    findPartialMatches(searchTerm) {
        const matches = [];

        // Search cities
        Object.entries(this.oklahomaCities).forEach(([name, data]) => {
            if (name.includes(searchTerm) || searchTerm.includes(name)) {
                matches.push({
                    type: 'city',
                    name: name,
                    data: data
                });
            }
        });

        // Search counties
        Object.entries(this.counties).forEach(([name, data]) => {
            if (name.includes(searchTerm) || searchTerm.includes(name)) {
                matches.push({
                    type: 'county',
                    name: name,
                    data: data
                });
            }
        });

        // Search landmarks
        Object.entries(this.landmarks).forEach(([name, data]) => {
            if (name.includes(searchTerm) || searchTerm.includes(name)) {
                matches.push({
                    type: 'landmark',
                    name: name,
                    data: data
                });
            }
        });

        return matches.slice(0, 5); // Limit to 5 results
    }

    // Fallback geocoding using a simple approach
    async fallbackGeocode(query) {
        // This would typically use a real geocoding service like Google Maps API
        // For demo purposes, we'll use a simple approach
        
        const searchTerm = query.toLowerCase();
        
        // Check for common Oklahoma address patterns
        if (searchTerm.includes('ok') || searchTerm.includes('oklahoma')) {
            // Default to Oklahoma City area
            return {
                type: 'fallback',
                data: { lat: 35.4676, lng: -97.5164, confidence: 'low' },
                query: query
            };
        }

        // Check for zip codes (Oklahoma zip codes start with 73 or 74)
        const zipMatch = searchTerm.match(/\b(73\d{3}|74\d{3})\b/);
        if (zipMatch) {
            return this.getLocationByZipCode(zipMatch[0]);
        }

        // If no pattern matches, return null
        return null;
    }

    // Get location by zip code (simplified)
    getLocationByZipCode(zipCode) {
        const zipLocations = {
            '73102': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73103': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73104': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73105': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73106': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73107': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73108': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73109': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73110': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73111': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73112': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73113': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73114': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73115': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73116': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73117': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73118': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73119': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73120': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73121': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73122': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73123': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73124': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73125': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73126': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73127': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73128': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73129': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73130': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73131': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73132': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73134': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73135': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73136': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73137': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73139': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73140': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73141': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73142': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73143': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73144': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73145': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73146': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73147': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73148': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73149': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73150': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73151': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73152': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73153': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73154': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73155': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73156': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73157': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73159': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73160': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73162': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73163': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73164': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73165': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73167': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73169': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73170': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73172': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73173': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73178': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73179': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73184': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73185': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73189': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73190': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73194': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73195': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '73196': { lat: 35.4676, lng: -97.5164, city: 'Oklahoma City' },
            '74101': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74102': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74103': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74104': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74105': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74106': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74107': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74108': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74110': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74112': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74114': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74115': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74116': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74117': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74119': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74120': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74121': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74126': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74127': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74128': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74129': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74130': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74131': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74132': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74133': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74134': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74135': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74136': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74137': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74141': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74145': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74146': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74147': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74148': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74149': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74150': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74152': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74153': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74155': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74156': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74157': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74158': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74159': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74169': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74170': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74171': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74172': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74182': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74183': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74184': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74186': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74187': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74192': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74193': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '74194': { lat: 36.1540, lng: -95.9928, city: 'Tulsa' },
            '73069': { lat: 35.2226, lng: -97.4395, city: 'Norman' },
            '73070': { lat: 35.2226, lng: -97.4395, city: 'Norman' },
            '73071': { lat: 35.2226, lng: -97.4395, city: 'Norman' },
            '73072': { lat: 35.2226, lng: -97.4395, city: 'Norman' },
            '73034': { lat: 35.3395, lng: -97.4867, city: 'Edmond' },
            '73012': { lat: 35.3395, lng: -97.4867, city: 'Edmond' },
            '73013': { lat: 35.3395, lng: -97.4867, city: 'Edmond' },
            '73025': { lat: 35.3395, lng: -97.4867, city: 'Edmond' },
            '74012': { lat: 36.0526, lng: -95.7908, city: 'Broken Arrow' },
            '74014': { lat: 36.0526, lng: -95.7908, city: 'Broken Arrow' },
            '73501': { lat: 34.6086, lng: -98.3903, city: 'Lawton' },
            '73502': { lat: 34.6086, lng: -98.3903, city: 'Lawton' },
            '73503': { lat: 34.6086, lng: -98.3903, city: 'Lawton' },
            '73505': { lat: 34.6086, lng: -98.3903, city: 'Lawton' },
            '73506': { lat: 34.6086, lng: -98.3903, city: 'Lawton' },
            '73507': { lat: 34.6086, lng: -98.3903, city: 'Lawton' }
        };

        return zipLocations[zipCode] ? {
            type: 'zipcode',
            data: zipLocations[zipCode],
            query: zipCode
        } : null;
    }

    // Get nearby locations
    getNearbyLocations(lat, lng, radius = 10) {
        const nearby = [];
        const searchRadius = radius / 69; // Convert miles to degrees (approximate)

        // Check cities
        Object.entries(this.oklahomaCities).forEach(([name, data]) => {
            const distance = this.calculateDistance(lat, lng, data.lat, data.lng);
            if (distance <= radius) {
                nearby.push({
                    type: 'city',
                    name: name,
                    data: data,
                    distance: distance
                });
            }
        });

        // Check landmarks
        Object.entries(this.landmarks).forEach(([name, data]) => {
            const distance = this.calculateDistance(lat, lng, data.lat, data.lng);
            if (distance <= radius) {
                nearby.push({
                    type: 'landmark',
                    name: name,
                    data: data,
                    distance: distance
                });
            }
        });

        return nearby.sort((a, b) => a.distance - b.distance);
    }

    // Calculate distance between two points in miles
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Get location information
    getLocationInfo(lat, lng) {
        const location = {
            coordinates: { lat: lat, lng: lng },
            city: this.findNearestCity(lat, lng),
            county: this.findNearestCounty(lat, lng),
            landmarks: this.getNearbyLocations(lat, lng, 5),
            elevation: this.getElevation(lat, lng),
            climate: this.getClimateInfo(lat, lng)
        };

        return location;
    }

    // Find nearest city
    findNearestCity(lat, lng) {
        let nearest = null;
        let minDistance = Infinity;

        Object.entries(this.oklahomaCities).forEach(([name, data]) => {
            const distance = this.calculateDistance(lat, lng, data.lat, data.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = { name: name, data: data, distance: distance };
            }
        });

        return nearest;
    }

    // Find nearest county
    findNearestCounty(lat, lng) {
        let nearest = null;
        let minDistance = Infinity;

        Object.entries(this.counties).forEach(([name, data]) => {
            const distance = this.calculateDistance(lat, lng, data.lat, data.lng);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = { name: name, data: data, distance: distance };
            }
        });

        return nearest;
    }

    // Get elevation (simplified - would use real elevation API in production)
    getElevation(lat, lng) {
        // Simplified elevation based on general Oklahoma topography
        // In production, use USGS elevation API or similar
        const baseElevation = 1000; // feet above sea level
        const variation = Math.sin(lat * 10) * Math.cos(lng * 10) * 200;
        return Math.round(baseElevation + variation);
    }

    // Get climate information
    getClimateInfo(lat, lng) {
        return {
            zone: '7a-7b', // USDA Hardiness Zone for Oklahoma
            rainfall: '30-50 inches annually',
            temperature: {
                summer: 'Highs 90-100°F',
                winter: 'Lows 20-30°F',
                spring: '50-80°F',
                fall: '40-70°F'
            },
            growingSeason: '180-220 days',
            frostFree: 'March to November'
        };
    }

    // Get property information based on location
    getPropertyInfo(lat, lng) {
        const location = this.getLocationInfo(lat, lng);
        const city = location.city;
        
        // Simplified property data based on city
        const propertyData = {
            'oklahoma city': {
                avgLotSize: 8000, // square feet
                avgHomeValue: 180000,
                propertyTaxRate: 0.011,
                zoning: 'Residential',
                utilities: ['Water', 'Sewer', 'Electric', 'Gas']
            },
            'tulsa': {
                avgLotSize: 7500,
                avgHomeValue: 160000,
                propertyTaxRate: 0.010,
                zoning: 'Residential',
                utilities: ['Water', 'Sewer', 'Electric', 'Gas']
            },
            'norman': {
                avgLotSize: 8500,
                avgHomeValue: 200000,
                propertyTaxRate: 0.012,
                zoning: 'Residential',
                utilities: ['Water', 'Sewer', 'Electric', 'Gas']
            },
            'edmond': {
                avgLotSize: 9000,
                avgHomeValue: 250000,
                propertyTaxRate: 0.013,
                zoning: 'Residential',
                utilities: ['Water', 'Sewer', 'Electric', 'Gas']
            }
        };

        return propertyData[city?.name?.toLowerCase()] || {
            avgLotSize: 8000,
            avgHomeValue: 180000,
            propertyTaxRate: 0.011,
            zoning: 'Residential',
            utilities: ['Water', 'Sewer', 'Electric', 'Gas']
        };
    }
}

// Initialize geocoding service
let geocodingService = new GeocodingService();

// Export for use in main map
if (typeof window !== 'undefined') {
    window.geocodingService = geocodingService;
}
