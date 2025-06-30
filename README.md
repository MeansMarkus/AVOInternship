# Oklahoma Property Planning - Sprinkler & Drain System Designer

An interactive web application for designing and planning sprinkler and drainage systems for properties in the Oklahoma area. This tool helps contractors and property owners visualize, plan, and estimate costs for irrigation and drainage projects.

## Features

### 🗺️ Interactive Map Interface
- **Satellite View**: High-resolution satellite imagery for detailed property visualization
- **Hybrid View**: Satellite imagery with street labels and boundaries
- **Street View**: Traditional street map view
- **Oklahoma-Focused**: Pre-configured with Oklahoma cities and landmarks
- **Zoom Controls**: Easy navigation with zoom in/out and reset view options

### 💧 Sprinkler System Components
- **Rotor Heads**: Long-range rotating sprinklers (30ft coverage)
- **Spray Heads**: Fixed spray pattern sprinklers (15ft coverage)
- **Drip Lines**: Low-volume irrigation for gardens and plants
- **Main Lines**: Primary water supply pipes
- **Lateral Lines**: Secondary distribution pipes
- **Smart Calculations**: Automatic coverage area and water flow calculations

### 🌊 Drainage System Components
- **Catch Basins**: Surface water collection points
- **Drain Pipes**: Underground drainage conduits
- **French Drains**: Perforated pipe systems for soil drainage
- **Dry Wells**: Underground water storage and infiltration
- **Flow Analysis**: Automatic drainage capacity and slope calculations

### 🏠 Property Elements
- **House Markers**: Mark existing structures
- **Driveway Areas**: Define paved surfaces
- **Patio Spaces**: Outdoor living areas
- **Garden Zones**: Planting and landscaping areas

### 💰 Cost Estimation & Planning
- **Real-time Cost Calculation**: Automatic pricing based on components
- **Material Costs**: Up-to-date pricing for all components
- **Labor Estimates**: Professional installation time calculations
- **Project Timeline**: Estimated completion dates
- **ROI Analysis**: Return on investment calculations
- **Water Usage Analysis**: Efficiency and consumption estimates

### 📍 Location Services
- **Address Search**: Find properties by address
- **Quick Location Buttons**: Popular Oklahoma cities (OKC, Tulsa, Norman, Edmond)
- **Zip Code Support**: Oklahoma zip code database
- **Property Information**: Local property data and regulations

### 💾 Project Management
- **Save Projects**: Export project files for later use
- **Load Projects**: Import previously saved designs
- **Export Images**: Save project visualizations
- **Component Properties**: Detailed editing of individual components

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for map tiles and satellite imagery
- No additional software installation required

### Installation
1. Download or clone the project files
2. Open `map.html` in your web browser
3. The application will load automatically with Oklahoma City as the default view

### Basic Usage

#### 1. Navigate to Your Property
- Use the search bar to enter an Oklahoma address
- Click quick location buttons for major cities
- Use zoom controls to get closer to your property

#### 2. Add Components
- Select a component type from the sidebar (Sprinkler, Drain, or Property)
- Click on the map where you want to place the component
- Components will appear with appropriate icons and colors

#### 3. Configure Components
- Click on any placed component to open the properties panel
- Adjust size, color, and add notes
- View real-time cost updates in the project info section

#### 4. Analyze Your Design
- View component count and estimated area
- Check cost estimates and project timeline
- Review system efficiency and recommendations

#### 5. Save Your Project
- Click "Save Project" to download your design
- Use "Load Project" to import saved designs
- Export images for presentations or documentation

## Component Types

### Sprinkler Components

#### Rotor Heads
- **Coverage**: 30-foot radius
- **Flow Rate**: 2.5 GPM
- **Best For**: Large lawns and open areas
- **Cost**: ~$75 installed

#### Spray Heads
- **Coverage**: 15-foot radius
- **Flow Rate**: 1.5 GPM
- **Best For**: Small areas and precise watering
- **Cost**: ~$45 installed

#### Drip Lines
- **Coverage**: 2-foot radius
- **Flow Rate**: 0.5 GPM
- **Best For**: Gardens, flower beds, and trees
- **Cost**: ~$2.50 per foot installed

### Drainage Components

#### Catch Basins
- **Capacity**: 50 GPM
- **Depth**: 3 feet
- **Best For**: Surface water collection
- **Cost**: ~$500 installed

#### Drain Pipes
- **Capacity**: 100 GPM
- **Diameter**: 4 inches
- **Best For**: Underground drainage
- **Cost**: ~$20 per foot installed

#### French Drains
- **Capacity**: 25 GPM
- **Depth**: 1.5 feet
- **Best For**: Soil drainage and foundation protection
- **Cost**: ~$28 per foot installed

#### Dry Wells
- **Capacity**: 200 GPM
- **Depth**: 6 feet
- **Best For**: Water storage and infiltration
- **Cost**: ~$1,400 installed

## Oklahoma-Specific Features

### Climate Considerations
- **USDA Zone**: 7a-7b
- **Annual Rainfall**: 30-50 inches
- **Growing Season**: 180-220 days
- **Frost-Free Period**: March to November

### Local Regulations
- Check local building codes for drainage requirements
- Ensure drainage doesn't negatively impact neighboring properties
- Consider environmental regulations for stormwater management

### Recommended Practices
- Install catch basins at low points to prevent standing water
- Use French drains for areas with poor soil drainage
- Ensure proper slope (minimum 1%) for all drainage pipes
- Consider dry wells for areas with limited drainage options
- Regular maintenance is crucial due to Oklahoma's weather patterns

## Cost Estimation

The application provides comprehensive cost estimates including:

### Materials
- Component costs based on current market prices
- Pipe and fitting costs per linear foot
- Controller and valve costs

### Labor
- Installation time estimates
- Skilled labor rates
- Equipment rental costs

### Additional Costs
- Permits and inspections
- Overhead and profit margins
- Warranty and maintenance

### ROI Analysis
- Annual water savings
- Property value increase
- Payback period calculations
- 5-year and 10-year ROI projections

## Technical Details

### Map Technology
- **Leaflet.js**: Open-source mapping library
- **ESRI Satellite Imagery**: High-resolution satellite tiles
- **OpenStreetMap**: Street map data
- **Custom Icons**: Professional component markers

### Calculations
- **Coverage Analysis**: Automatic area and efficiency calculations
- **Water Flow**: Hydraulic calculations for sprinkler systems
- **Drainage Capacity**: Manning's equation for pipe flow
- **Cost Estimation**: Real-time pricing updates

### Data Management
- **Local Storage**: Project data saved locally
- **JSON Export**: Standard format for data exchange
- **Component Tracking**: Detailed component specifications
- **Project History**: Version control for designs

## Browser Compatibility

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## Support and Updates

### Known Limitations
- Requires internet connection for map tiles
- Address geocoding limited to Oklahoma area
- Cost estimates are approximations
- No real-time weather integration

### Future Enhancements
- Real-time weather data integration
- Advanced 3D visualization
- Mobile app version
- Cloud project storage
- Integration with contractor management systems

## License

This project is developed for educational and commercial use in the Oklahoma area. Please ensure compliance with local regulations and building codes when implementing designs created with this tool.

## Contact

For questions, suggestions, or support, please contact the development team.

---

**Note**: This tool is designed to assist with property planning and should be used in conjunction with professional consultation for actual installation projects. Always verify local codes and regulations before beginning any construction work. 