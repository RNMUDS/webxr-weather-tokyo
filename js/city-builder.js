class CityBuilder {
    constructor() {
        this.buildingsContainer = document.querySelector('#city-buildings');
        this.buildingConfigs = this.generateBuildingConfigurations();
    }

    generateBuildingConfigurations() {
        const configs = [];
        const gridSize = 8;
        const spacing = 12;
        
        // Generate a grid of buildings with varying heights
        for (let x = -gridSize; x <= gridSize; x++) {
            for (let z = -gridSize; z <= gridSize; z++) {
                // Skip center area for better camera view
                if (Math.abs(x) < 2 && Math.abs(z) < 2) continue;
                
                // Random building properties
                const height = Math.random() * 30 + 10;
                const width = Math.random() * 4 + 4;
                const depth = Math.random() * 4 + 4;
                
                configs.push({
                    position: {
                        x: x * spacing + (Math.random() - 0.5) * 4,
                        y: height / 2,
                        z: z * spacing + (Math.random() - 0.5) * 4
                    },
                    scale: {
                        x: width,
                        y: height,
                        z: depth
                    },
                    color: this.generateBuildingColor(),
                    type: Math.random() > 0.7 ? 'tall' : 'normal'
                });
            }
        }
        
        // Add some landmark tall buildings
        configs.push({
            position: { x: -20, y: 35, z: -20 },
            scale: { x: 8, y: 70, z: 8 },
            color: '#1a1a2e',
            type: 'skyscraper'
        });
        
        configs.push({
            position: { x: 25, y: 30, z: -15 },
            scale: { x: 10, y: 60, z: 10 },
            color: '#16213e',
            type: 'skyscraper'
        });
        
        return configs;
    }

    generateBuildingColor() {
        // Realistic modern building colors - mainly whites, grays, glass blues
        const colors = [
            '#f8f9fa',  // Light gray/white
            '#e9ecef',  // Light gray
            '#dee2e6',  // Medium light gray
            '#ced4da',  // Medium gray
            '#adb5bd',  // Darker gray
            '#6c757d',  // Dark gray
            '#495057',  // Very dark gray
            '#343a40',  // Charcoal
            '#212529',  // Near black
            '#2c5aa0',  // Blue glass
            '#1e3a5f',  // Dark blue glass
            '#87ceeb',  // Sky blue glass
            '#4682b4',  // Steel blue
            '#708090'   // Slate gray
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    generateBuildingMaterial(color, type) {
        const isGlass = Math.random() > 0.6; // 40% chance of glass buildings
        
        if (isGlass) {
            return {
                color: color,
                metalness: 0.1,
                roughness: 0.1,
                opacity: 0.8,
                transparent: true
            };
        } else {
            return {
                color: color,
                metalness: 0.0,
                roughness: 0.8
            };
        }
    }

    buildCity() {
        // Clear existing buildings
        while (this.buildingsContainer.firstChild) {
            this.buildingsContainer.removeChild(this.buildingsContainer.firstChild);
        }
        
        // First, create expanded ground and roads
        this.createGroundAndRoads();
        
        // Create buildings with windows
        this.buildingConfigs.forEach((config, index) => {
            this.createBuildingWithWindows(config, index);
        });
        
        // Add street trees
        this.addStreetTrees();
        
        // Add street lights
        this.addStreetLights();
    }

    createGroundAndRoads() {
        // Create expanded ground plane
        const ground = document.querySelector('#ground');
        ground.setAttribute('width', '200');
        ground.setAttribute('height', '200');
        ground.setAttribute('color', '#4a4a4a');
        
        // Create main roads
        const roadWidth = 8;
        const roadPositions = [
            { x: 0, z: 0, width: 200, height: roadWidth, rotation: '0' },      // Main horizontal road
            { x: 0, z: 0, width: roadWidth, height: 200, rotation: '90' },     // Main vertical road
            { x: 40, z: 0, width: roadWidth, height: 200, rotation: '90' },    // Right vertical road
            { x: -40, z: 0, width: roadWidth, height: 200, rotation: '90' },   // Left vertical road
            { x: 0, z: 40, width: 200, height: roadWidth, rotation: '0' },     // Top horizontal road
            { x: 0, z: -40, width: 200, height: roadWidth, rotation: '0' }     // Bottom horizontal road
        ];
        
        roadPositions.forEach(road => {
            const roadElement = document.createElement('a-plane');
            roadElement.setAttribute('position', `${road.x} 0.01 ${road.z}`);
            roadElement.setAttribute('rotation', `-90 ${road.rotation} 0`);
            roadElement.setAttribute('width', road.width);
            roadElement.setAttribute('height', road.height);
            roadElement.setAttribute('color', '#2c2c2c');
            roadElement.setAttribute('material', 'roughness: 0.8');
            this.buildingsContainer.appendChild(roadElement);
        });
        
        // Add road markings
        this.addRoadMarkings();
    }

    addRoadMarkings() {
        const markingPositions = [
            { x: 0, z: 0, width: 180, height: 0.5 },     // Center line horizontal
            { x: 0, z: 0, width: 0.5, height: 180 },     // Center line vertical
        ];
        
        markingPositions.forEach(marking => {
            const markingElement = document.createElement('a-plane');
            markingElement.setAttribute('position', `${marking.x} 0.02 ${marking.z}`);
            markingElement.setAttribute('rotation', '-90 0 0');
            markingElement.setAttribute('width', marking.width);
            markingElement.setAttribute('height', marking.height);
            markingElement.setAttribute('color', '#ffff00');
            this.buildingsContainer.appendChild(markingElement);
        });
    }

    createBuildingWithWindows(config, index) {
        // Create main building
        const building = document.createElement('a-box');
        building.setAttribute('position', `${config.position.x} ${config.position.y} ${config.position.z}`);
        building.setAttribute('scale', `${config.scale.x} ${config.scale.y} ${config.scale.z}`);
        
        const material = this.generateBuildingMaterial(config.color, config.type);
        let materialString = `color: ${material.color}; roughness: ${material.roughness}; metalness: ${material.metalness}`;
        if (material.transparent) {
            materialString += `; opacity: ${material.opacity}; transparent: true`;
        }
        
        building.setAttribute('material', materialString);
        building.setAttribute('shadow', 'cast: true; receive: true');
        this.buildingsContainer.appendChild(building);
        
        // Add windows
        this.addWindowsToBuilding(config);
        
        // Add rooftop details for some buildings
        if (Math.random() > 0.7 && config.type !== 'skyscraper') {
            this.addRooftopDetails(config);
        }
    }

    addWindowsToBuilding(config) {
        const windowSize = 0.8;
        const windowSpacing = 2;
        const floorsCount = Math.floor(config.scale.y / 3); // One floor every 3 units
        
        // Calculate window grid
        const windowsPerFloor = Math.max(1, Math.floor(config.scale.x / windowSpacing));
        
        for (let floor = 1; floor < floorsCount; floor++) {
            const y = config.position.y - config.scale.y/2 + floor * 3 + 1;
            
            // Front and back faces
            for (let i = 0; i < windowsPerFloor; i++) {
                const x = config.position.x - config.scale.x/2 + (i + 0.5) * windowSpacing;
                
                if (Math.random() > 0.3) { // 70% chance of window
                    // Front windows
                    this.createWindow(x, y, config.position.z + config.scale.z/2 + 0.01, '0');
                    // Back windows
                    this.createWindow(x, y, config.position.z - config.scale.z/2 - 0.01, '180');
                }
            }
            
            // Left and right faces
            const windowsPerSide = Math.max(1, Math.floor(config.scale.z / windowSpacing));
            for (let i = 0; i < windowsPerSide; i++) {
                const z = config.position.z - config.scale.z/2 + (i + 0.5) * windowSpacing;
                
                if (Math.random() > 0.3) { // 70% chance of window
                    // Left windows
                    this.createWindow(config.position.x - config.scale.x/2 - 0.01, y, z, '90');
                    // Right windows
                    this.createWindow(config.position.x + config.scale.x/2 + 0.01, y, z, '-90');
                }
            }
        }
    }

    createWindow(x, y, z, rotation) {
        const window = document.createElement('a-plane');
        window.setAttribute('position', `${x} ${y} ${z}`);
        window.setAttribute('rotation', `0 ${rotation} 0`);
        window.setAttribute('width', '1.5');
        window.setAttribute('height', '2');
        
        // Random window state
        const isLit = Math.random() > 0.6;
        const windowColor = isLit ? '#ffeb9c' : '#87ceeb';
        const emissiveIntensity = isLit ? 0.3 : 0.0;
        
        window.setAttribute('material', `color: ${windowColor}; emissive: ${windowColor}; emissiveIntensity: ${emissiveIntensity}; opacity: 0.8; transparent: true`);
        this.buildingsContainer.appendChild(window);
    }

    addRooftopDetails(config) {
        const rooftop = document.createElement('a-box');
        rooftop.setAttribute('position', `${config.position.x} ${config.position.y + config.scale.y/2 + 1} ${config.position.z}`);
        rooftop.setAttribute('scale', `${config.scale.x * 0.8} 2 ${config.scale.z * 0.8}`);
        rooftop.setAttribute('color', '#555555');
        this.buildingsContainer.appendChild(rooftop);
    }

    addStreetTrees() {
        // Trees along main roads
        const treePositions = [];
        
        // Trees along horizontal roads
        for (let x = -80; x <= 80; x += 15) {
            if (Math.abs(x) > 10) { // Avoid center intersection
                treePositions.push({ x: x, z: 6 });   // North side
                treePositions.push({ x: x, z: -6 });  // South side
                treePositions.push({ x: x, z: 46 });  // Far north
                treePositions.push({ x: x, z: -46 }); // Far south
            }
        }
        
        // Trees along vertical roads
        for (let z = -80; z <= 80; z += 15) {
            if (Math.abs(z) > 10) { // Avoid center intersection
                treePositions.push({ x: 6, z: z });    // East side
                treePositions.push({ x: -6, z: z });   // West side
                treePositions.push({ x: 46, z: z });   // Far east
                treePositions.push({ x: -46, z: z });  // Far west
            }
        }
        
        // Random trees in empty spaces
        for (let i = 0; i < 30; i++) {
            const x = (Math.random() - 0.5) * 160;
            const z = (Math.random() - 0.5) * 160;
            
            // Check if position is clear of roads and buildings
            if (this.isPositionClearForTree(x, z)) {
                treePositions.push({ x, z });
            }
        }
        
        treePositions.forEach(pos => {
            this.createTree(pos.x, pos.z);
        });
    }

    isPositionClearForTree(x, z) {
        // Check distance from roads
        const roadDistance = 6;
        if (Math.abs(x) < roadDistance || Math.abs(z) < roadDistance ||
            Math.abs(x - 40) < roadDistance || Math.abs(x + 40) < roadDistance ||
            Math.abs(z - 40) < roadDistance || Math.abs(z + 40) < roadDistance) {
            return false;
        }
        
        // Check distance from buildings
        return !this.buildingConfigs.some(building => {
            const dx = Math.abs(x - building.position.x);
            const dz = Math.abs(z - building.position.z);
            return dx < building.scale.x + 5 && dz < building.scale.z + 5;
        });
    }

    createTree(x, z) {
        // Tree trunk
        const trunk = document.createElement('a-cylinder');
        trunk.setAttribute('position', `${x} 2 ${z}`);
        trunk.setAttribute('radius', '0.3');
        trunk.setAttribute('height', '4');
        trunk.setAttribute('color', '#8B4513');
        this.buildingsContainer.appendChild(trunk);
        
        // Tree foliage - multiple spheres for natural look
        const foliageColors = ['#228B22', '#32CD32', '#006400'];
        for (let i = 0; i < 3; i++) {
            const foliage = document.createElement('a-sphere');
            const offsetX = (Math.random() - 0.5) * 2;
            const offsetZ = (Math.random() - 0.5) * 2;
            const offsetY = Math.random() * 1 + 4;
            
            foliage.setAttribute('position', `${x + offsetX} ${offsetY} ${z + offsetZ}`);
            foliage.setAttribute('radius', Math.random() * 1.5 + 2);
            foliage.setAttribute('color', foliageColors[Math.floor(Math.random() * foliageColors.length)]);
            this.buildingsContainer.appendChild(foliage);
        }
    }

    addStreetLights() {
        const lightPositions = [
            { x: -15, z: 0 },
            { x: 15, z: 0 },
            { x: 0, z: -15 },
            { x: 0, z: 15 },
            { x: -30, z: -30 },
            { x: 30, z: 30 },
            { x: -30, z: 30 },
            { x: 30, z: -30 }
        ];
        
        lightPositions.forEach(pos => {
            // Light pole
            const pole = document.createElement('a-cylinder');
            pole.setAttribute('position', `${pos.x} 2.5 ${pos.z}`);
            pole.setAttribute('radius', '0.2');
            pole.setAttribute('height', '5');
            pole.setAttribute('color', '#333333');
            this.buildingsContainer.appendChild(pole);
            
            // Light bulb
            const light = document.createElement('a-sphere');
            light.setAttribute('position', `${pos.x} 5 ${pos.z}`);
            light.setAttribute('radius', '0.5');
            light.setAttribute('color', '#FFFACD');
            light.setAttribute('material', 'emissive: #FFFACD; emissiveIntensity: 0.5');
            this.buildingsContainer.appendChild(light);
            
            // Add point light
            const pointLight = document.createElement('a-light');
            pointLight.setAttribute('type', 'point');
            pointLight.setAttribute('position', `${pos.x} 5 ${pos.z}`);
            pointLight.setAttribute('color', '#FFFACD');
            pointLight.setAttribute('intensity', '0.3');
            pointLight.setAttribute('distance', '15');
            this.buildingsContainer.appendChild(pointLight);
        });
    }

    updateLighting(weatherCondition) {
        const sky = document.querySelector('#sky');
        const sun = document.querySelector('#sun');
        const ambientLight = document.querySelector('a-light[type="ambient"]');
        
        switch(weatherCondition) {
            case 'clear':
                sky.setAttribute('color', '#87CEEB');
                sun.setAttribute('intensity', '0.7');
                ambientLight.setAttribute('intensity', '0.3');
                break;
            case 'partly_cloudy':
                sky.setAttribute('color', '#B0C4DE');
                sun.setAttribute('intensity', '0.5');
                ambientLight.setAttribute('intensity', '0.4');
                break;
            case 'cloudy':
            case 'fog':
                sky.setAttribute('color', '#696969');
                sun.setAttribute('intensity', '0.2');
                ambientLight.setAttribute('intensity', '0.5');
                break;
            case 'rain':
            case 'thunderstorm':
                sky.setAttribute('color', '#4B4B4B');
                sun.setAttribute('intensity', '0.1');
                ambientLight.setAttribute('intensity', '0.6');
                break;
            case 'snow':
                sky.setAttribute('color', '#D3D3D3');
                sun.setAttribute('intensity', '0.3');
                ambientLight.setAttribute('intensity', '0.5');
                break;
        }
    }
}

// Create global instance
window.cityBuilder = new CityBuilder();