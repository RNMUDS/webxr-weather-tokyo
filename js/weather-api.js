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

    async fetchPrecipitationRanking(days = 30) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1); // Exclude today to get complete data
        const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
        
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        console.log(`Fetching weather ranking from ${startDateStr} to ${endDateStr}`);
        
        const url = `${this.archiveUrl}?latitude=${this.latitude}&longitude=${this.longitude}&start_date=${startDateStr}&end_date=${endDateStr}&daily=precipitation_sum,rain_sum,snowfall_sum,weathercode_max,temperature_2m_max,cloudcover_mean&timezone=Asia/Tokyo`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Raw API data:', data);
            
            if (!data.daily || !data.daily.time) {
                throw new Error('Invalid data format received from API');
            }
            
            return this.parseRankingData(data);
        } catch (error) {
            console.error('Error fetching precipitation ranking:', error);
            throw error;
        }
    }

    parseRankingData(data) {
        const daily = data.daily;
        const rankingData = [];
        
        console.log('Parsing daily data length:', daily.time.length);
        console.log('Sample precipitation data:', daily.precipitation_sum?.slice(0, 5));
        
        for (let i = 0; i < daily.time.length; i++) {
            const precipitation = daily.precipitation_sum?.[i] || 0;
            const rain = daily.rain_sum?.[i] || 0;
            const snowfall = daily.snowfall_sum?.[i] || 0;
            const totalPrecipitation = precipitation;
            
            // Include all days, even with 0 precipitation for testing
            rankingData.push({
                date: daily.time[i],
                precipitation: precipitation,
                rain: rain,
                snowfall: snowfall,
                totalPrecipitation: totalPrecipitation,
                weatherCode: daily.weathercode_max?.[i] || 0,
                weatherCondition: this.getWeatherCondition(daily.weathercode_max?.[i] || 0),
                temperature: daily.temperature_2m_max?.[i] || 20,
                cloudCover: daily.cloudcover_mean?.[i] || 0
            });
        }
        
        console.log('Total ranking data items:', rankingData.length);
        console.log('Sample ranking items:', rankingData.slice(0, 3));
        
        // Sort by total precipitation (descending)
        const sorted = rankingData.sort((a, b) => b.totalPrecipitation - a.totalPrecipitation);
        
        // Return top items with precipitation > 0, or top 10 if no precipitation
        const withPrecipitation = sorted.filter(item => item.totalPrecipitation > 0);
        return withPrecipitation.length > 0 ? withPrecipitation : sorted.slice(0, 10);
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