// Main application controller
class WeatherApp {
    constructor() {
        this.form = document.getElementById('weather-form');
        this.dateInput = document.getElementById('date-input');
        this.timeInput = document.getElementById('time-input');
        this.weatherInfo = document.getElementById('weather-info');
        
        this.setupDateConstraints();
        this.setupEventListeners();
        this.initialize();
    }

    setupDateConstraints() {
        const today = new Date();
        const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
        
        // Set date input constraints
        this.dateInput.min = oneYearAgo.toISOString().split('T')[0];
        this.dateInput.max = oneWeekLater.toISOString().split('T')[0];
        this.dateInput.value = today.toISOString().split('T')[0];
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleWeatherRequest();
        });
    }

    async initialize() {
        // Build the city
        window.cityBuilder.buildCity();
        
        // Load current weather
        await this.loadCurrentWeather();
    }

    async loadCurrentWeather() {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().slice(0, 5);
        
        try {
            const weatherData = await window.weatherAPI.fetchWeatherData(date, time);
            this.updateVisualization(weatherData);
            this.displayWeatherInfo(weatherData);
        } catch (error) {
            console.error('Failed to load current weather:', error);
        }
    }

    async handleWeatherRequest() {
        const date = this.dateInput.value;
        const time = this.timeInput.value;
        
        if (!date || !time) {
            alert('日付と時刻を選択してください。');
            return;
        }
        
        try {
            // Show loading state
            this.weatherInfo.innerHTML = '<p>天気データを読み込み中...</p>';
            this.weatherInfo.classList.add('show');
            
            // Fetch weather data
            const weatherData = await window.weatherAPI.fetchWeatherData(date, time);
            
            // Update visualization
            this.updateVisualization(weatherData);
            
            // Display weather info
            this.displayWeatherInfo(weatherData);
            
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.weatherInfo.innerHTML = `<p style="color: red;">エラー: ${error.message}</p>`;
        }
    }

    updateVisualization(weatherData) {
        // Update lighting based on weather
        window.cityBuilder.updateLighting(weatherData.weatherCondition);
        
        // Apply weather effects
        window.weatherEffects.applyWeatherEffect(weatherData);
    }

    displayWeatherInfo(weatherData) {
        const weatherConditionJP = this.getWeatherConditionJP(weatherData.weatherCondition);
        const dateTime = new Date(weatherData.time);
        const formattedDateTime = this.formatDateTime(dateTime);
        
        let infoHTML = `
            <h3>天気情報</h3>
            <p><strong>日時:</strong> ${formattedDateTime}</p>
            <p><strong>天気:</strong> ${weatherConditionJP}</p>
            <p><strong>気温:</strong> ${weatherData.temperature.toFixed(1)}°C</p>
            <p><strong>雲量:</strong> ${weatherData.cloudCover}%</p>
        `;
        
        if (weatherData.precipitation > 0) {
            infoHTML += `<p><strong>降水量:</strong> ${weatherData.precipitation.toFixed(1)}mm</p>`;
        }
        
        if (weatherData.rain > 0) {
            infoHTML += `<p><strong>降雨量:</strong> ${weatherData.rain.toFixed(1)}mm</p>`;
        }
        
        if (weatherData.snowfall > 0) {
            infoHTML += `<p><strong>降雪量:</strong> ${weatherData.snowfall.toFixed(1)}cm</p>`;
        }
        
        if (weatherData.precipitationProbability !== null) {
            infoHTML += `<p><strong>降水確率:</strong> ${weatherData.precipitationProbability}%</p>`;
        }
        
        this.weatherInfo.innerHTML = infoHTML;
        this.weatherInfo.classList.add('show');
    }

    getWeatherConditionJP(condition) {
        const translations = {
            'clear': '晴れ',
            'partly_cloudy': '晴れ時々曇り',
            'cloudy': '曇り',
            'fog': '霧',
            'rain': '雨',
            'snow': '雪',
            'thunderstorm': '雷雨'
        };
        return translations[condition] || condition;
    }

    formatDateTime(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherApp();
});