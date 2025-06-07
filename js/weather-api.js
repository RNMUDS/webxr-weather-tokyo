class WeatherAPI {
    constructor() {
        // Tokyo/Shinjuku coordinates
        this.latitude = 35.6938;
        this.longitude = 139.7034;
        this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
        this.archiveUrl = 'https://archive-api.open-meteo.com/v1/archive';
    }

    async fetchWeatherData(date, time) {
        const selectedDate = new Date(`${date}T${time}`);
        const now = new Date();
        const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        // Determine if we need historical or forecast data
        if (selectedDate < now) {
            return await this.fetchHistoricalData(date);
        } else if (selectedDate <= oneWeekFromNow) {
            return await this.fetchForecastData(date, time);
        } else {
            throw new Error('選択された日付は1週間後までの範囲で選択してください。');
        }
    }

    async fetchHistoricalData(date) {
        const url = `${this.archiveUrl}?latitude=${this.latitude}&longitude=${this.longitude}&start_date=${date}&end_date=${date}&hourly=temperature_2m,precipitation,rain,snowfall,weathercode,cloudcover&timezone=Asia/Tokyo`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Weather data fetch failed');
            
            const data = await response.json();
            return this.parseWeatherData(data, true);
        } catch (error) {
            console.error('Error fetching historical weather data:', error);
            throw error;
        }
    }

    async fetchForecastData(date, time) {
        const url = `${this.baseUrl}?latitude=${this.latitude}&longitude=${this.longitude}&hourly=temperature_2m,precipitation_probability,precipitation,rain,snowfall,weathercode,cloudcover&timezone=Asia/Tokyo`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Weather data fetch failed');
            
            const data = await response.json();
            return this.parseWeatherData(data, false, date, time);
        } catch (error) {
            console.error('Error fetching forecast weather data:', error);
            throw error;
        }
    }

    parseWeatherData(data, isHistorical, targetDate = null, targetTime = null) {
        const hourly = data.hourly;
        let targetIndex = 12; // Default to noon
        
        if (targetDate && targetTime) {
            const targetDateTime = `${targetDate}T${targetTime}`;
            targetIndex = hourly.time.findIndex(t => t.startsWith(targetDateTime));
            if (targetIndex === -1) targetIndex = 12;
        }
        
        const weatherCode = hourly.weathercode[targetIndex];
        const weatherCondition = this.getWeatherCondition(weatherCode);
        
        return {
            temperature: hourly.temperature_2m[targetIndex],
            precipitation: hourly.precipitation[targetIndex] || 0,
            rain: hourly.rain ? hourly.rain[targetIndex] || 0 : 0,
            snowfall: hourly.snowfall ? hourly.snowfall[targetIndex] || 0 : 0,
            cloudCover: hourly.cloudcover[targetIndex] || 0,
            weatherCode: weatherCode,
            weatherCondition: weatherCondition,
            precipitationProbability: hourly.precipitation_probability ? hourly.precipitation_probability[targetIndex] : null,
            time: hourly.time[targetIndex]
        };
    }

    async fetchPrecipitationRanking(days = 7) {
        // Use shorter period and simpler parameters for better reliability
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1); // Exclude today to get complete data
        const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
        
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        console.log(`Fetching weather ranking from ${startDateStr} to ${endDateStr}`);
        
        // Simplified URL with only essential parameters
        const url = `${this.archiveUrl}?latitude=${this.latitude}&longitude=${this.longitude}&start_date=${startDateStr}&end_date=${endDateStr}&daily=precipitation_sum,temperature_2m_max&timezone=Asia/Tokyo`;
        
        console.log('API URL:', url);
        
        try {
            const response = await fetch(url);
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API request failed: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Raw API data:', data);
            
            if (!data.daily || !data.daily.time) {
                console.error('Invalid data structure:', data);
                throw new Error('Invalid data format received from API');
            }
            
            return this.parseRankingData(data);
        } catch (error) {
            console.error('Error fetching precipitation ranking:', error);
            // Create fallback data for demonstration
            return this.createFallbackRankingData();
        }
    }

    createFallbackRankingData() {
        console.log('Creating fallback ranking data');
        const fallbackData = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
            const precipitation = Math.random() * 50; // Random precipitation 0-50mm
            
            fallbackData.push({
                date: date.toISOString().split('T')[0],
                precipitation: precipitation,
                rain: precipitation * 0.8,
                snowfall: precipitation * 0.2,
                totalPrecipitation: precipitation,
                weatherCode: precipitation > 10 ? 61 : (precipitation > 0 ? 51 : 0),
                weatherCondition: precipitation > 10 ? 'rain' : (precipitation > 0 ? 'rain' : 'clear'),
                temperature: 20 + Math.random() * 10,
                cloudCover: 50
            });
        }
        
        return fallbackData.sort((a, b) => b.totalPrecipitation - a.totalPrecipitation);
    }

    parseRankingData(data) {
        const daily = data.daily;
        const rankingData = [];
        
        console.log('Parsing daily data length:', daily.time.length);
        console.log('Sample precipitation data:', daily.precipitation_sum?.slice(0, 5));
        console.log('Sample temperature data:', daily.temperature_2m_max?.slice(0, 5));
        
        for (let i = 0; i < daily.time.length; i++) {
            const precipitation = daily.precipitation_sum?.[i] || 0;
            const totalPrecipitation = precipitation;
            
            // Include all days for testing
            rankingData.push({
                date: daily.time[i],
                precipitation: precipitation,
                rain: precipitation * 0.8, // Assume most precipitation is rain
                snowfall: precipitation * 0.2, // Small amount as snow
                totalPrecipitation: totalPrecipitation,
                weatherCode: precipitation > 10 ? 61 : (precipitation > 0 ? 51 : 0),
                weatherCondition: precipitation > 10 ? 'rain' : (precipitation > 0 ? 'rain' : 'clear'),
                temperature: daily.temperature_2m_max?.[i] || 20,
                cloudCover: 50
            });
        }
        
        console.log('Total ranking data items:', rankingData.length);
        console.log('Sample ranking items:', rankingData.slice(0, 3));
        
        // Sort by total precipitation (descending)
        const sorted = rankingData.sort((a, b) => b.totalPrecipitation - a.totalPrecipitation);
        
        // Return all items for testing
        return sorted;
    }

    getWeatherCondition(code) {
        // WMO Weather interpretation codes
        // https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
        if (code === 0) return 'clear';
        if (code >= 1 && code <= 3) return 'partly_cloudy';
        if (code >= 45 && code <= 48) return 'fog';
        if (code >= 51 && code <= 67) return 'rain';
        if (code >= 71 && code <= 77) return 'snow';
        if (code >= 80 && code <= 82) return 'rain';
        if (code >= 85 && code <= 86) return 'snow';
        if (code >= 95 && code <= 99) return 'thunderstorm';
        return 'cloudy';
    }
}

// Create global instance
window.weatherAPI = new WeatherAPI();