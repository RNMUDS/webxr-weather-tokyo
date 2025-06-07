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
        const colors = ['#2c3e50', '#34495e', '#7f8c8d', '#95a5a6', '#1a1a2e', '#16213e'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    buildCity() {
        // Clear existing buildings
        while (this.buildingsContainer.firstChild) {
            this.buildingsContainer.removeChild(this.buildingsContainer.firstChild);
        }
        
        // Create buildings
        this.buildingConfigs.forEach((config, index) => {
            const building = document.createElement('a-box');
            building.setAttribute('position', `${config.position.x} ${config.position.y} ${config.position.z}`);
            building.setAttribute('scale', `${config.scale.x} ${config.scale.y} ${config.scale.z}`);
            building.setAttribute('color', config.color);
            building.setAttribute('shadow', 'cast: true; receive: true');
            
            // Add windows effect with emission
            if (config.type === 'skyscraper' || config.type === 'tall') {
                building.setAttribute('material', `color: ${config.color}; emissive: #FFE4B5; emissiveIntensity: 0.1`);
            }
            
            this.buildingsContainer.appendChild(building);
            
            // Add rooftop details for some buildings
            if (Math.random() > 0.7 && config.type !== 'skyscraper') {
                const rooftop = document.createElement('a-box');
                rooftop.setAttribute('position', `${config.position.x} ${config.position.y + config.scale.y/2 + 1} ${config.position.z}`);
                rooftop.setAttribute('scale', `${config.scale.x * 0.8} 2 ${config.scale.z * 0.8}`);
                rooftop.setAttribute('color', '#555555');
                this.buildingsContainer.appendChild(rooftop);
            }
        });
        
        // Add some street lights
        this.addStreetLights();
    }

    addStreetLights() {
        const lightPositions = [
            { x: -10, z: 0 },
            { x: 10, z: 0 },
            { x: 0, z: -10 },
            { x: 0, z: 10 },
            { x: -10, z: -10 },
            { x: 10, z: 10 }
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