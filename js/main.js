// Main application controller
class WeatherApp {
    constructor() {
        this.form = document.getElementById('weather-form');
        this.dateInput = document.getElementById('date-input');
        this.timeInput = document.getElementById('time-input');
        this.weatherInfo = document.getElementById('weather-info');
        this.rankingToggle = document.getElementById('ranking-toggle');
        this.rankingContent = document.getElementById('ranking-content');
        this.loadRankingBtn = document.getElementById('load-ranking-btn');
        this.rankingList = document.getElementById('ranking-list');
        
        this.rankingVisible = false;
        this.rankingData = [];
        
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
        
        this.rankingToggle.addEventListener('click', () => {
            this.toggleRanking();
        });
        
        this.loadRankingBtn.addEventListener('click', () => {
            this.loadPrecipitationRanking();
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

    toggleRanking() {
        this.rankingVisible = !this.rankingVisible;
        if (this.rankingVisible) {
            this.rankingContent.style.display = 'block';
            this.rankingToggle.textContent = '📈';
        } else {
            this.rankingContent.style.display = 'none';
            this.rankingToggle.textContent = '📊';
        }
    }

    async loadPrecipitationRanking() {
        try {
            this.loadRankingBtn.textContent = '読み込み中...';
            this.loadRankingBtn.disabled = true;
            
            this.rankingData = await window.weatherAPI.fetchPrecipitationRanking(30);
            this.displayRanking();
            
        } catch (error) {
            console.error('Failed to load ranking:', error);
            this.rankingList.innerHTML = '<p style="color: red;">ランキングの読み込みに失敗しました</p>';
        } finally {
            this.loadRankingBtn.textContent = 'ランキングを更新';
            this.loadRankingBtn.disabled = false;
        }
    }

    displayRanking() {
        if (this.rankingData.length === 0) {
            this.rankingList.innerHTML = '<p>降水データがありません</p>';
            return;
        }

        const top10 = this.rankingData.slice(0, 10);
        let rankingHTML = '<div class="ranking-header">過去30日間 降水量トップ10</div>';
        
        top10.forEach((item, index) => {
            const date = new Date(item.date);
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
            const weatherIcon = this.getWeatherIcon(item.weatherCondition);
            const precipitationType = item.snowfall > item.rain ? '雪' : '雨';
            
            rankingHTML += `
                <div class="ranking-item" data-date="${item.date}" data-condition="${item.weatherCondition}">
                    <div class="ranking-number">${index + 1}</div>
                    <div class="ranking-info">
                        <div class="ranking-date">${formattedDate} ${weatherIcon}</div>
                        <div class="ranking-precipitation">${precipitationType}: ${item.totalPrecipitation.toFixed(1)}mm</div>
                        <div class="ranking-temp">最高: ${item.temperature.toFixed(1)}°C</div>
                    </div>
                </div>
            `;
        });
        
        this.rankingList.innerHTML = rankingHTML;
        this.setupRankingClickHandlers();
    }

    setupRankingClickHandlers() {
        const rankingItems = this.rankingList.querySelectorAll('.ranking-item');
        rankingItems.forEach(item => {
            item.addEventListener('click', () => {
                const date = item.dataset.date;
                const condition = item.dataset.condition;
                this.simulateRankingWeather(date, condition);
            });
        });
    }

    async simulateRankingWeather(date, condition) {
        try {
            this.weatherInfo.innerHTML = '<p>天気データを読み込み中...</p>';
            this.weatherInfo.classList.add('show');
            
            // Set the date inputs to match the ranking item
            this.dateInput.value = date;
            this.timeInput.value = '12:00';
            
            // Fetch weather data for that specific date
            const weatherData = await window.weatherAPI.fetchWeatherData(date, '12:00');
            
            // Update visualization
            this.updateVisualization(weatherData);
            
            // Display weather info
            this.displayWeatherInfo(weatherData);
            
        } catch (error) {
            console.error('Weather simulation error:', error);
            this.weatherInfo.innerHTML = `<p style="color: red;">シミュレーションエラー: ${error.message}</p>`;
        }
    }

    getWeatherIcon(condition) {
        const icons = {
            'clear': '☀️',
            'partly_cloudy': '⛅',
            'cloudy': '☁️',
            'fog': '🌫️',
            'rain': '🌧️',
            'snow': '❄️',
            'thunderstorm': '⛈️'
        };
        return icons[condition] || '🌤️';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherApp();
});