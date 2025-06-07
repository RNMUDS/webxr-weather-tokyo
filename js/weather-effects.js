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
        
        // Dramatically increase rain density based on intensity
        const baseRainCount = Math.floor(intensity * 5000); // 5x more particles
        const heavyRainMultiplier = Math.min(intensity * 3, 10); // Up to 10x for heavy rain
        const totalRainCount = Math.floor(baseRainCount * heavyRainMultiplier);
        
        console.log(`Creating rain with intensity ${intensity}, particles: ${totalRainCount}`);
        
        const rainContainer = document.createElement('a-entity');
        rainContainer.setAttribute('id', 'rain-container');
        
        // Create multiple layers of rain for depth effect
        const rainLayers = [
            { distance: 150, opacity: 0.8, speed: 1.0 },    // Close rain
            { distance: 200, opacity: 0.6, speed: 0.8 },    // Medium rain
            { distance: 250, opacity: 0.4, speed: 0.6 }     // Far rain
        ];
        
        rainLayers.forEach((layer, layerIndex) => {
            const layerCount = Math.floor(totalRainCount / rainLayers.length);
            
            for (let i = 0; i < layerCount; i++) {
                const raindrop = document.createElement('a-cylinder');
                const x = (Math.random() - 0.5) * layer.distance;
                const z = (Math.random() - 0.5) * layer.distance;
                const y = Math.random() * 100 + 50; // Higher starting point
                
                // Vary raindrop size based on intensity and layer
                const dropRadius = 0.03 + (intensity * 0.05) + (layerIndex * 0.02);
                const dropHeight = 1.5 + (intensity * 2) + (layerIndex * 0.5);
                
                raindrop.setAttribute('position', `${x} ${y} ${z}`);
                raindrop.setAttribute('radius', dropRadius.toString());
                raindrop.setAttribute('height', dropHeight.toString());
                raindrop.setAttribute('color', '#2E86AB');
                raindrop.setAttribute('opacity', layer.opacity.toString());
                
                // Add some randomness to rain color for realism
                const colorVariation = Math.random() * 0.3;
                const rainColor = `hsl(${200 + colorVariation * 20}, 60%, ${40 + colorVariation * 20}%)`;
                raindrop.setAttribute('color', rainColor);
                
                // Dramatically faster falling speed for heavy rain
                const fallSpeed = 800 + (intensity * 200) - (Math.random() * 400);
                const finalSpeed = Math.max(fallSpeed * layer.speed, 400);
                
                // Add wind effect for dramatic angles
                const windOffset = intensity > 2 ? (Math.random() - 0.5) * 20 : 0;
                
                raindrop.setAttribute('animation', {
                    property: 'position',
                    to: `${x + windOffset} -10 ${z + windOffset * 0.5}`,
                    dur: finalSpeed,
                    loop: true,
                    easing: 'linear'
                });
                
                rainContainer.appendChild(raindrop);
            }
        });
        
        this.effectsContainer.appendChild(rainContainer);
        this.activeEffects.push('rain');
        
        // Add enhanced effects for heavy rain
        if (intensity > 3 && typeof this.addHeavyRainEffects === 'function') {
            this.addHeavyRainEffects(intensity);
        }
        
        // Enhanced rain sound effect
        this.addRainSound(intensity);
        
        // Add rain splash effects on ground
        if (typeof this.addRainSplashes === 'function') {
            this.addRainSplashes(intensity);
        }
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

    addRainSound(intensity = 1) {
        // Visual indicator for rain sound with intensity-based messaging
        const soundIndicator = document.createElement('a-text');
        soundIndicator.setAttribute('position', '0 0.5 -5');
        
        let soundMessage = '🔊 Rain sounds';
        if (intensity > 5) {
            soundMessage = '🌩️ Heavy downpour';
        } else if (intensity > 3) {
            soundMessage = '🌧️ Heavy rain sounds';
        } else if (intensity > 1) {
            soundMessage = '🌦️ Moderate rain sounds';
        }
        
        soundIndicator.setAttribute('value', soundMessage);
        soundIndicator.setAttribute('color', '#4A90E2');
        soundIndicator.setAttribute('opacity', Math.min(0.7 + intensity * 0.1, 1.0).toString());
        soundIndicator.setAttribute('align', 'center');
        soundIndicator.setAttribute('animation', {
            property: 'opacity',
            to: 0,
            dur: 3000,
            delay: 2000
        });
        this.effectsContainer.appendChild(soundIndicator);
    }

    addHeavyRainEffects(intensity) {
        // Add dramatic storm clouds for heavy rain
        if (intensity > 4) {
            const stormClouds = document.createElement('a-entity');
            stormClouds.setAttribute('id', 'storm-clouds');
            
            for (let i = 0; i < 6; i++) {
                const darkCloud = document.createElement('a-sphere');
                const x = (Math.random() - 0.5) * 120;
                const z = (Math.random() - 0.5) * 120;
                const y = 40 + Math.random() * 15;
                
                darkCloud.setAttribute('position', `${x} ${y} ${z}`);
                darkCloud.setAttribute('radius', (8 + Math.random() * 4).toString());
                darkCloud.setAttribute('color', '#2c2c2c');
                darkCloud.setAttribute('opacity', '0.9');
                
                // Add ominous movement
                darkCloud.setAttribute('animation', {
                    property: 'position',
                    to: `${x + (Math.random() - 0.5) * 30} ${y + Math.random() * 5} ${z + (Math.random() - 0.5) * 30}`,
                    dur: 15000 + Math.random() * 10000,
                    loop: true,
                    dir: 'alternate',
                    easing: 'easeInOutSine'
                });
                
                stormClouds.appendChild(darkCloud);
            }
            
            this.effectsContainer.appendChild(stormClouds);
        }
        
        // Add rain mist/fog for very heavy rain
        if (intensity > 6) {
            const rainMist = document.createElement('a-entity');
            rainMist.setAttribute('id', 'rain-mist');
            rainMist.setAttribute('fog', 'type: exponential; color: #9CA3AF; density: 0.08');
            this.effectsContainer.appendChild(rainMist);
        }
    }
    
    addRainSplashes(intensity) {
        // Create ground splash effects for heavy rain
        if (intensity > 2) {
            const splashContainer = document.createElement('a-entity');
            splashContainer.setAttribute('id', 'rain-splashes');
            
            const splashCount = Math.floor(intensity * 50);
            
            for (let i = 0; i < splashCount; i++) {
                const splash = document.createElement('a-ring');
                const x = (Math.random() - 0.5) * 150;
                const z = (Math.random() - 0.5) * 150;
                
                splash.setAttribute('position', `${x} 0.1 ${z}`);
                splash.setAttribute('rotation', '-90 0 0');
                splash.setAttribute('radius-inner', '0');
                splash.setAttribute('radius-outer', '0.5');
                splash.setAttribute('color', '#87CEEB');
                splash.setAttribute('opacity', '0.6');
                
                // Animated expanding splash
                splash.setAttribute('animation__expand', {
                    property: 'radius-outer',
                    to: 2 + Math.random() * 1,
                    dur: 800 + Math.random() * 400,
                    loop: true,
                    delay: Math.random() * 3000,
                    easing: 'easeOutQuad'
                });
                
                splash.setAttribute('animation__fade', {
                    property: 'opacity',
                    to: 0,
                    dur: 800 + Math.random() * 400,
                    loop: true,
                    delay: Math.random() * 3000,
                    easing: 'easeOutQuad'
                });
                
                splashContainer.appendChild(splash);
            }
            
            this.effectsContainer.appendChild(splashContainer);
        }
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