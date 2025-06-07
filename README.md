# Tokyo Weather WebXR Visualization

A WebXR application that visualizes weather data for Tokyo's Shinjuku area using A-Frame 1.7.0. Users can select different dates and times to see historical, current, or future weather conditions rendered in an immersive 3D city environment.

## Features

- **3D City Visualization**: Shinjuku skyline represented with basic geometric buildings
- **Weather Simulation**: Rain, snow, sunny, cloudy, and thunderstorm effects
- **Time Travel**: View weather from past, present, or up to 1 week in the future
- **Interactive UI**: Date and time picker with Japanese interface
- **Real Weather Data**: Uses Open-Meteo API for accurate weather information
- **WebXR Compatible**: Works with VR headsets and mobile devices

## Weather Effects

- **Clear/Sunny**: Bright sky with animated sun rays
- **Partly Cloudy**: Moving clouds with partial sunlight
- **Cloudy**: Overcast sky with cloud coverage
- **Rain**: Animated raindrops with sound indicators
- **Snow**: Falling snowflakes with ground accumulation
- **Thunderstorm**: Rain with lightning flashes
- **Fog**: Atmospheric fog effects

## Getting Started

1. Clone the repository
2. Open `index.html` in a web browser
3. Select a date and time
4. Click "天気を表示" to view the weather simulation

## File Structure

```
webxr-weather-tokyo/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # UI styling
├── js/
│   ├── weather-api.js     # Weather data fetching
│   ├── city-builder.js    # 3D city generation
│   ├── weather-effects.js # Weather animations
│   └── main.js           # Application controller
└── README.md
```

## Dependencies

- A-Frame 1.7.0 (loaded via CDN)
- Open-Meteo API (free weather data)

## Browser Support

- Chrome/Edge (recommended for WebXR)
- Firefox
- Safari (limited WebXR support)
- Mobile browsers

## API Usage

This application uses the free Open-Meteo API:
- Historical data: `archive-api.open-meteo.com`
- Forecast data: `api.open-meteo.com`

## License

MIT License