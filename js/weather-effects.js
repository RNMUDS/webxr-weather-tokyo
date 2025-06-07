class WeatherEffects {
    constructor() {
        this.effectsContainer = document.querySelector('#weather-effects');
        this.activeEffects = [];
    }

    clearEffects() {
        // Remove all existing weather effects
        while (this.effectsContainer.firstChild) {
            this.effectsContainer.removeChild(this.effectsContainer.firstChild);
        }
        this.activeEffects = [];
    }

    createRain(intensity = 1) {
        this.clearEffects();
        
        const rainCount = Math.floor(intensity * 1000);
        const rainContainer = document.createElement('a-entity');
        rainContainer.setAttribute('id', 'rain-container');
        
        for (let i = 0; i < rainCount; i++) {
            const raindrop = document.createElement('a-cylinder');
            const x = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            const y = Math.random() * 50 + 20;
            
            raindrop.setAttribute('position', `${x} ${y} ${z}`);
            raindrop.setAttribute('radius', '0.05');
            raindrop.setAttribute('height', '2');
            raindrop.setAttribute('color', '#4A90E2');
            raindrop.setAttribute('opacity', '0.6');
            
            // Animate falling
            raindrop.setAttribute('animation', {
                property: 'position',
                to: `${x} -5 ${z}`,
                dur: 2000 + Math.random() * 1000,
                loop: true,
                easing: 'linear'
            });
            
            rainContainer.appendChild(raindrop);
        }
        
        this.effectsContainer.appendChild(rainContainer);
        this.activeEffects.push('rain');
        
        // Add rain sound effect representation
        this.addRainSound();
    }

    createSnow(intensity = 1) {
        this.clearEffects();
        
        const snowCount = Math.floor(intensity * 500);
        const snowContainer = document.createElement('a-entity');
        snowContainer.setAttribute('id', 'snow-container');
        
        for (let i = 0; i < snowCount; i++) {
            const snowflake = document.createElement('a-sphere');
            const x = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            const y = Math.random() * 50 + 20;
            
            snowflake.setAttribute('position', `${x} ${y} ${z}`);
            snowflake.setAttribute('radius', Math.random() * 0.2 + 0.1);
            snowflake.setAttribute('color', '#FFFFFF');
            
            // Animate falling with swaying motion
            snowflake.setAttribute('animation__fall', {
                property: 'position',
                to: `${x} -5 ${z}`,
                dur: 8000 + Math.random() * 4000,
                loop: true,
                easing: 'linear'
            });
            
            snowflake.setAttribute('animation__sway', {
                property: 'position',
                to: `${x + (Math.random() - 0.5) * 2} ${y} ${z + (Math.random() - 0.5) * 2}`,
                dur: 3000,
                loop: true,
                dir: 'alternate',
                easing: 'easeInOutSine'
            });
            
            snowContainer.appendChild(snowflake);
        }
        
        this.effectsContainer.appendChild(snowContainer);
        this.activeEffects.push('snow');
        
        // Add snow accumulation on ground
        this.addSnowAccumulation();
    }

    createClouds(cloudCover = 50) {
        const cloudCount = Math.floor(cloudCover / 10);
        const cloudContainer = document.createElement('a-entity');
        cloudContainer.setAttribute('id', 'cloud-container');
        
        for (let i = 0; i < cloudCount; i++) {
            const cloud = document.createElement('a-entity');
            const x = (Math.random() - 0.5) * 80;
            const y = 30 + Math.random() * 10;
            const z = (Math.random() - 0.5) * 80;
            
            cloud.setAttribute('position', `${x} ${y} ${z}`);
            
            // Create cloud from multiple spheres
            for (let j = 0; j < 5; j++) {
                const cloudPart = document.createElement('a-sphere');
                cloudPart.setAttribute('position', `${(Math.random() - 0.5) * 5} ${(Math.random() - 0.5) * 2} ${(Math.random() - 0.5) * 5}`);
                cloudPart.setAttribute('radius', 3 + Math.random() * 2);
                cloudPart.setAttribute('color', '#FFFFFF');
                cloudPart.setAttribute('opacity', '0.8');
                cloud.appendChild(cloudPart);
            }
            
            // Animate cloud movement
            cloud.setAttribute('animation', {
                property: 'position',
                to: `${x + 20} ${y} ${z}`,
                dur: 60000,
                loop: true,
                easing: 'linear'
            });
            
            cloudContainer.appendChild(cloud);
        }
        
        this.effectsContainer.appendChild(cloudContainer);
        this.activeEffects.push('clouds');
    }

    createFog() {
        const fog = document.createElement('a-entity');
        fog.setAttribute('id', 'fog');
        fog.setAttribute('fog', 'type: exponential; color: #AAA; density: 0.05');
        this.effectsContainer.appendChild(fog);
        this.activeEffects.push('fog');
    }

    createThunderstorm() {
        this.createRain(1.5);
        this.createLightning();
    }

    createLightning() {
        const lightning = document.createElement('a-entity');
        lightning.setAttribute('id', 'lightning');
        
        // Create lightning flash effect
        const flash = () => {
            const sky = document.querySelector('#sky');
            sky.setAttribute('animation', {
                property: 'color',
                to: '#FFFFFF',
                dur: 100,
                easing: 'easeInOutQuad'
            });
            
            setTimeout(() => {
                sky.setAttribute('animation', {
                    property: 'color',
                    to: '#4B4B4B',
                    dur: 200,
                    easing: 'easeInOutQuad'
                });
            }, 100);
        };
        
        // Random lightning flashes
        setInterval(() => {
            if (Math.random() > 0.7) {
                flash();
            }
        }, 5000);
        
        this.effectsContainer.appendChild(lightning);
    }

    addRainSound() {
        // Visual indicator for rain sound
        const soundIndicator = document.createElement('a-text');
        soundIndicator.setAttribute('position', '0 0.5 -5');
        soundIndicator.setAttribute('value', '🔊 Rain sounds');
        soundIndicator.setAttribute('color', '#4A90E2');
        soundIndicator.setAttribute('opacity', '0.7');
        soundIndicator.setAttribute('align', 'center');
        soundIndicator.setAttribute('animation', {
            property: 'opacity',
            to: 0,
            dur: 3000,
            delay: 2000
        });
        this.effectsContainer.appendChild(soundIndicator);
    }

    addSnowAccumulation() {
        const ground = document.querySelector('#ground');
        ground.setAttribute('color', '#F0F0F0');
        
        // Add snow layer
        const snowLayer = document.createElement('a-plane');
        snowLayer.setAttribute('position', '0 0.01 0');
        snowLayer.setAttribute('rotation', '-90 0 0');
        snowLayer.setAttribute('width', '100');
        snowLayer.setAttribute('height', '100');
        snowLayer.setAttribute('color', '#FFFFFF');
        snowLayer.setAttribute('opacity', '0.8');
        this.effectsContainer.appendChild(snowLayer);
    }

    createSunnyEffect() {
        this.clearEffects();
        
        // Enhanced sun rays
        const sunRays = document.createElement('a-entity');
        sunRays.setAttribute('id', 'sun-rays');
        
        for (let i = 0; i < 8; i++) {
            const ray = document.createElement('a-plane');
            ray.setAttribute('position', '20 30 -20');
            ray.setAttribute('rotation', `0 ${i * 45} 0`);
            ray.setAttribute('width', '0.5');
            ray.setAttribute('height', '50');
            ray.setAttribute('color', '#FFD700');
            ray.setAttribute('opacity', '0.1');
            ray.setAttribute('material', 'side: double');
            
            ray.setAttribute('animation', {
                property: 'opacity',
                to: 0.2,
                dur: 2000,
                loop: true,
                dir: 'alternate',
                easing: 'easeInOutSine'
            });
            
            sunRays.appendChild(ray);
        }
        
        this.effectsContainer.appendChild(sunRays);
        this.activeEffects.push('sunny');
    }

    applyWeatherEffect(weatherData) {
        this.clearEffects();
        
        const condition = weatherData.weatherCondition;
        const cloudCover = weatherData.cloudCover;
        
        switch(condition) {
            case 'clear':
                this.createSunnyEffect();
                break;
            case 'partly_cloudy':
                this.createClouds(cloudCover);
                this.createSunnyEffect();
                break;
            case 'cloudy':
                this.createClouds(cloudCover);
                break;
            case 'fog':
                this.createFog();
                this.createClouds(cloudCover);
                break;
            case 'rain':
                this.createClouds(cloudCover);
                this.createRain(weatherData.rain / 10);
                break;
            case 'snow':
                this.createClouds(cloudCover);
                this.createSnow(weatherData.snowfall / 5);
                break;
            case 'thunderstorm':
                this.createThunderstorm();
                break;
        }
    }
}

// Create global instance
window.weatherEffects = new WeatherEffects();