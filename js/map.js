// Main Map Application
class PropertyPlanningMap {
    constructor() {
        this.map = null;
        this.currentLayer = null;
        this.components = [];
        this.selectedComponent = null;
        this.isDrawing = false;
        this.drawingLayer = null;
        this.measurementLayer = null;
        this.currentMapStyle = 'satellite';
        
        this.init();
    }

    init() {
        this.initializeMap();
        this.setupEventListeners();
        this.setupMapControls();
        this.loadDefaultLocation();
    }

    initializeMap() {
        // Initialize map centered on Oklahoma
        this.map = L.map('map', {
            center: [35.4676, -97.5164], // Oklahoma City
            zoom: 13,
            zoomControl: false
        });

        // Add different map layers
        this.mapLayers = {
            satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }),
            hybrid: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            }),
            street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            })
        };

        // Add hybrid labels layer
        this.hybridLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        // Set default layer
        this.mapLayers.satellite.addTo(this.map);

        // Initialize drawing layer
        this.drawingLayer = L.layerGroup().addTo(this.map);
        this.measurementLayer = L.layerGroup().addTo(this.map);

        // Add scale control
        L.control.scale({imperial: true, metric: false}).addTo(this.map);
    }

    setupEventListeners() {
        // Map style change
        document.getElementById('mapStyle').addEventListener('change', (e) => {
            this.changeMapStyle(e.target.value);
        });

        // Component selection
        document.querySelectorAll('.component-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectComponent(e.currentTarget);
            });
        });

        // Quick location buttons
        document.querySelectorAll('.location-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lat = parseFloat(e.target.dataset.lat);
                const lng = parseFloat(e.target.dataset.lng);
                this.flyToLocation(lat, lng);
            });
        });

        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchAddress();
        });

        document.getElementById('addressInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchAddress();
            }
        });

        // Map click for component placement
        this.map.on('click', (e) => {
            if (this.selectedComponent) {
                this.placeComponent(e.latlng);
            }
        });

        // Map events for coordinates display
        this.map.on('mousemove', (e) => {
            this.updateCoordinates(e.latlng);
        });

        this.map.on('zoomend', () => {
            this.updateZoomLevel();
        });

        // Component size slider
        document.getElementById('componentSize').addEventListener('input', (e) => {
            this.updateComponentSize(e.target.value);
        });

        // Project controls
        document.getElementById('saveProject').addEventListener('click', () => {
            this.saveProject();
        });

        document.getElementById('loadProject').addEventListener('click', () => {
            this.loadProject();
        });

        document.getElementById('exportImage').addEventListener('click', () => {
            this.exportImage();
        });

        // Properties panel
        document.getElementById('closeProperties').addEventListener('click', () => {
            this.hidePropertiesPanel();
        });

        document.getElementById('deleteComponent').addEventListener('click', () => {
            this.deleteSelectedComponent();
        });

        document.getElementById('duplicateComponent').addEventListener('click', () => {
            this.duplicateSelectedComponent();
        });
    }

    setupMapControls() {
        // Zoom controls
        document.getElementById('zoomIn').addEventListener('click', () => {
            this.map.zoomIn();
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
            this.map.zoomOut();
        });

        document.getElementById('resetView').addEventListener('click', () => {
            this.resetView();
        });

        document.getElementById('measureTool').addEventListener('click', () => {
            this.toggleMeasureTool();
        });

        document.getElementById('clearAll').addEventListener('click', () => {
            this.clearAllComponents();
        });
    }

    changeMapStyle(style) {
        // Remove current layer
        this.map.removeLayer(this.mapLayers[this.currentMapStyle]);
        if (this.currentMapStyle === 'hybrid') {
            this.map.removeLayer(this.hybridLabels);
        }

        // Add new layer
        this.mapLayers[style].addTo(this.map);
        if (style === 'hybrid') {
            this.hybridLabels.addTo(this.map);
        }

        this.currentMapStyle = style;
    }

    selectComponent(element) {
        // Remove previous selection
        document.querySelectorAll('.component-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Add selection to clicked element
        element.classList.add('selected');

        // Store selected component data
        this.selectedComponent = {
            type: element.dataset.type,
            component: element.dataset.component,
            element: element
        };

        // Change cursor
        this.map.getContainer().style.cursor = 'crosshair';
    }

    placeComponent(latlng) {
        if (!this.selectedComponent) return;

        const component = {
            id: Date.now() + Math.random(),
            type: this.selectedComponent.type,
            component: this.selectedComponent.component,
            latlng: latlng,
            size: document.getElementById('componentSize').value,
            color: this.getComponentColor(this.selectedComponent.type),
            notes: '',
            timestamp: new Date()
        };

        // Create icon based on component type
        const icon = this.createComponentIcon(component);
        
        // Add marker to map
        const marker = L.marker(latlng, { icon: icon })
            .addTo(this.drawingLayer)
            .bindPopup(this.createComponentPopup(component));

        // Store component data
        component.marker = marker;
        this.components.push(component);

        // Update component count
        this.updateComponentCount();

        // Add click event to marker for properties panel
        marker.on('click', () => {
            this.showComponentProperties(component);
        });

        // Reset selection
        this.deselectComponent();
    }

    createComponentIcon(component) {
        const size = parseInt(component.size);
        const iconClass = this.getIconClass(component);
        
        return L.divIcon({
            className: `component-icon ${component.type}`,
            html: `<i class="${iconClass}"></i>`,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
        });
    }

    getIconClass(component) {
        const icons = {
            'sprinkler-head': {
                'rotor': 'fas fa-circle',
                'spray': 'fas fa-dot-circle',
                'drip': 'fas fa-tint'
            },
            'sprinkler-pipe': 'fas fa-minus',
            'drain': {
                'catch-basin': 'fas fa-circle',
                'drain-pipe': 'fas fa-minus',
                'french-drain': 'fas fa-minus',
                'dry-well': 'fas fa-circle'
            },
            'property': {
                'house': 'fas fa-home',
                'driveway': 'fas fa-road',
                'patio': 'fas fa-square',
                'garden': 'fas fa-seedling'
            }
        };

        if (component.component) {
            return icons[component.type][component.component] || 'fas fa-circle';
        }
        return icons[component.type] || 'fas fa-circle';
    }

    getComponentColor(type) {
        const colors = {
            'sprinkler-head': '#3498db',
            'sprinkler-pipe': '#2980b9',
            'drain': '#27ae60',
            'property': '#e74c3c'
        };
        return colors[type] || '#95a5a6';
    }

    createComponentPopup(component) {
        return `
            <div class="component-popup">
                <h4>${this.getComponentName(component)}</h4>
                <p><strong>Type:</strong> ${component.type}</p>
                <p><strong>Size:</strong> ${component.size}px</p>
                ${component.notes ? `<p><strong>Notes:</strong> ${component.notes}</p>` : ''}
                <button onclick="map.editComponent('${component.id}')" class="btn btn-primary btn-sm">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        `;
    }

    getComponentName(component) {
        const names = {
            'sprinkler-head': {
                'rotor': 'Rotor Head',
                'spray': 'Spray Head',
                'drip': 'Drip Line'
            },
            'sprinkler-pipe': {
                'lateral': 'Lateral Line',
                '': 'Main Line'
            },
            'drain': {
                'catch-basin': 'Catch Basin',
                'drain-pipe': 'Drain Pipe',
                'french-drain': 'French Drain',
                'dry-well': 'Dry Well'
            },
            'property': {
                'house': 'House',
                'driveway': 'Driveway',
                'patio': 'Patio',
                'garden': 'Garden'
            }
        };

        if (component.component) {
            return names[component.type][component.component] || component.component;
        }
        return names[component.type] || component.type;
    }

    deselectComponent() {
        this.selectedComponent = null;
        document.querySelectorAll('.component-item').forEach(item => {
            item.classList.remove('selected');
        });
        this.map.getContainer().style.cursor = '';
    }

    showComponentProperties(component) {
        this.selectedComponent = component;
        
        // Populate properties panel
        document.getElementById('componentType').textContent = this.getComponentName(component);
        document.getElementById('componentSizeInput').value = component.size;
        document.getElementById('componentColor').value = component.color;
        document.getElementById('componentNotes').value = component.notes || '';

        // Show panel
        document.getElementById('propertiesPanel').classList.remove('hidden');

        // Add event listeners for property changes
        this.setupPropertyChangeListeners(component);
    }

    setupPropertyChangeListeners(component) {
        const sizeInput = document.getElementById('componentSizeInput');
        const colorInput = document.getElementById('componentColor');
        const notesInput = document.getElementById('componentNotes');

        sizeInput.addEventListener('input', (e) => {
            component.size = e.target.value;
            this.updateComponentMarker(component);
        });

        colorInput.addEventListener('change', (e) => {
            component.color = e.target.value;
            this.updateComponentMarker(component);
        });

        notesInput.addEventListener('input', (e) => {
            component.notes = e.target.value;
            component.marker.getPopup().setContent(this.createComponentPopup(component));
        });
    }

    updateComponentMarker(component) {
        const newIcon = this.createComponentIcon(component);
        component.marker.setIcon(newIcon);
        component.marker.getPopup().setContent(this.createComponentPopup(component));
    }

    hidePropertiesPanel() {
        document.getElementById('propertiesPanel').classList.add('hidden');
        this.selectedComponent = null;
    }

    deleteSelectedComponent() {
        if (this.selectedComponent && this.selectedComponent.marker) {
            this.map.removeLayer(this.selectedComponent.marker);
            this.components = this.components.filter(c => c.id !== this.selectedComponent.id);
            this.updateComponentCount();
            this.hidePropertiesPanel();
        }
    }

    duplicateSelectedComponent() {
        if (this.selectedComponent) {
            const newComponent = {
                ...this.selectedComponent,
                id: Date.now() + Math.random(),
                latlng: {
                    lat: this.selectedComponent.latlng.lat + 0.001,
                    lng: this.selectedComponent.latlng.lng + 0.001
                },
                timestamp: new Date()
            };

            const icon = this.createComponentIcon(newComponent);
            const marker = L.marker(newComponent.latlng, { icon: icon })
                .addTo(this.drawingLayer)
                .bindPopup(this.createComponentPopup(newComponent));

            newComponent.marker = marker;
            this.components.push(newComponent);
            this.updateComponentCount();

            marker.on('click', () => {
                this.showComponentProperties(newComponent);
            });
        }
    }

    searchAddress() {
        const address = document.getElementById('addressInput').value;
        if (!address) return;

        // Simple geocoding (in production, use a proper geocoding service)
        this.geocodeAddress(address);
    }

    geocodeAddress(address) {
        // For demo purposes, we'll use a simple approach
        // In production, integrate with Google Maps API or similar
        const oklahomaAddresses = {
            'oklahoma city': [35.4676, -97.5164],
            'tulsa': [36.1540, -95.9928],
            'norman': [35.2226, -97.4395],
            'edmond': [35.3395, -97.4867],
            'broken arrow': [36.0526, -95.7908],
            'lawton': [34.6086, -98.3903]
        };

        const searchTerm = address.toLowerCase();
        let found = false;

        for (const [city, coords] of Object.entries(oklahomaAddresses)) {
            if (city.includes(searchTerm) || searchTerm.includes(city)) {
                this.flyToLocation(coords[0], coords[1]);
                found = true;
                break;
            }
        }

        if (!found) {
            // Default to Oklahoma City if not found
            this.flyToLocation(35.4676, -97.5164);
            alert('Address not found. Showing Oklahoma City area.');
        }
    }

    flyToLocation(lat, lng) {
        this.map.flyTo([lat, lng], 15, {
            duration: 2
        });
    }

    loadDefaultLocation() {
        // Start with Oklahoma City
        this.flyToLocation(35.4676, -97.5164);
    }

    resetView() {
        this.flyToLocation(35.4676, -97.5164);
    }

    updateCoordinates(latlng) {
        document.getElementById('coordinates').textContent = 
            `Lat: ${latlng.lat.toFixed(6)}, Lng: ${latlng.lng.toFixed(6)}`;
    }

    updateZoomLevel() {
        document.getElementById('zoomLevel').textContent = 
            `Zoom: ${this.map.getZoom()}`;
    }

    updateComponentSize(size) {
        // Update all existing components
        this.components.forEach(component => {
            component.size = size;
            this.updateComponentMarker(component);
        });
    }

    updateComponentCount() {
        document.getElementById('componentCount').textContent = this.components.length;
        this.updateProjectInfo();
    }

    updateProjectInfo() {
        // Calculate estimated area (simplified)
        const area = this.calculatePropertyArea();
        document.getElementById('propertyArea').textContent = `${area.toFixed(0)} sq ft`;

        // Calculate estimated cost
        const cost = this.calculateEstimatedCost();
        document.getElementById('estimatedCost').textContent = `$${cost.toLocaleString()}`;
    }

    calculatePropertyArea() {
        // Simplified area calculation
        // In a real application, you'd calculate based on property boundaries
        return this.components.length * 500; // 500 sq ft per component as example
    }

    calculateEstimatedCost() {
        // Simplified cost calculation
        const baseCost = 2500; // Base installation cost
        const componentCost = this.components.length * 150; // $150 per component
        return baseCost + componentCost;
    }

    toggleMeasureTool() {
        // Implementation for measurement tool
        alert('Measurement tool coming soon!');
    }

    clearAllComponents() {
        if (confirm('Are you sure you want to clear all components?')) {
            this.drawingLayer.clearLayers();
            this.components = [];
            this.updateComponentCount();
            this.hidePropertiesPanel();
        }
    }

    saveProject() {
        const projectData = {
            components: this.components.map(c => ({
                ...c,
                marker: null // Don't save marker reference
            })),
            mapCenter: this.map.getCenter(),
            zoom: this.map.getZoom(),
            timestamp: new Date()
        };

        const dataStr = JSON.stringify(projectData);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `oklahoma-property-plan-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    loadProject() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const projectData = JSON.parse(e.target.result);
                        this.loadProjectData(projectData);
                    } catch (error) {
                        alert('Error loading project file.');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    loadProjectData(projectData) {
        // Clear existing components
        this.clearAllComponents();

        // Load components
        projectData.components.forEach(componentData => {
            const component = {
                ...componentData,
                id: Date.now() + Math.random(),
                timestamp: new Date()
            };

            const icon = this.createComponentIcon(component);
            const marker = L.marker(component.latlng, { icon: icon })
                .addTo(this.drawingLayer)
                .bindPopup(this.createComponentPopup(component));

            component.marker = marker;
            this.components.push(component);

            marker.on('click', () => {
                this.showComponentProperties(component);
            });
        });

        // Restore map view
        if (projectData.mapCenter) {
            this.map.setView(projectData.mapCenter, projectData.zoom || 13);
        }

        this.updateComponentCount();
    }

    exportImage() {
        // Implementation for exporting map as image
        alert('Export functionality coming soon!');
    }
}

// Initialize the application
let map;
document.addEventListener('DOMContentLoaded', () => {
    map = new PropertyPlanningMap();
});
