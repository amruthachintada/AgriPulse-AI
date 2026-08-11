import { WeatherInfo, HourlyForecast, DailyForecast } from '@/types';

export interface OpenWeatherListItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  pop?: number;
  clouds?: {
    all: number;
  };
}

export async function getWeather(locationQuery?: string, apiKeyOverride?: string): Promise<WeatherInfo> {
  const location = locationQuery && locationQuery.trim().length > 0 
    ? locationQuery 
    : 'Vijayawada, Andhra Pradesh';

  const apiKey = apiKeyOverride || process.env.WEATHER_API_KEY;

  if (apiKey) {
    try {
      const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`);
      const geoData = await geoRes.json();

      if (geoData && geoData.length > 0) {
        const { lat, lon, name, state, country } = geoData[0];
        const formattedLoc = `${name}${state ? `, ${state}` : ''}, ${country}`;

        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        const weatherData = await weatherRes.json();

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastRes.json();

        const hourly: HourlyForecast[] = (forecastData.list || []).slice(0, 6).map((item: OpenWeatherListItem) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(item.main.temp),
          rainProb: Math.round((item.pop || 0) * 100),
          condition: item.weather[0]?.main || 'Clear',
          icon: item.weather[0]?.icon || '01d',
        }));

        const dailyMap = new Map<string, { temps: number[]; pop: number[]; condition: string }>();
        (forecastData.list || []).forEach((item: OpenWeatherListItem) => {
          const dateStr = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          if (!dailyMap.has(dateStr)) {
            dailyMap.set(dateStr, { temps: [], pop: [], condition: item.weather[0]?.main || 'Clear' });
          }
          dailyMap.get(dateStr)!.temps.push(item.main.temp);
          dailyMap.get(dateStr)!.pop.push(item.pop || 0);
        });

        const daily: DailyForecast[] = Array.from(dailyMap.entries()).slice(0, 5).map(([day, data]) => ({
          day,
          tempMax: Math.round(Math.max(...data.temps)),
          tempMin: Math.round(Math.min(...data.temps)),
          rainProb: Math.round(Math.max(...data.pop) * 100),
          condition: data.condition,
          icon: '02d',
        }));

        const temp = Math.round(weatherData.main.temp);
        const humidity = weatherData.main.humidity;
        const windSpeed = Math.round(weatherData.wind.speed * 3.6);
        const condition = weatherData.weather[0]?.description || 'Partly Cloudy';
        const rainProb = Math.round((forecastData.list?.[0]?.pop || 0) * 100);

        return {
          location: formattedLoc,
          temp,
          feelsLike: Math.round(weatherData.main.feels_like),
          condition: condition.charAt(0).toUpperCase() + condition.slice(1),
          humidity,
          rainProb,
          windSpeed,
          uvIndex: 7,
          cloudCover: weatherData.clouds?.all || 20,
          hourly,
          daily,
          aiInsight: generateWeatherInsight(temp, humidity, rainProb, windSpeed),
          fieldActivityRecommendation: generateFieldActivityAdvice(temp, humidity, rainProb, windSpeed),
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
    } catch (e) {
      console.warn('Weather API failed or invalid key, using AgriPulse Weather Simulation', e);
    }
  }

  // Demo / Fallback weather generator
  const isHot = location.toLowerCase().includes('delhi') || location.toLowerCase().includes('guntur');
  const temp = isHot ? 34 : 31;
  const humidity = 78;
  const rainProb = 35;
  const windSpeed = 12;

  const hourly: HourlyForecast[] = [
    { time: '12:00 PM', temp: temp, rainProb: 15, condition: 'Partly Cloudy', icon: '02d' },
    { time: '02:00 PM', temp: temp + 2, rainProb: 20, condition: 'Partly Cloudy', icon: '02d' },
    { time: '04:00 PM', temp: temp + 1, rainProb: 35, condition: 'Light Rain', icon: '10d' },
    { time: '06:00 PM', temp: temp - 2, rainProb: 40, condition: 'Light Rain', icon: '10d' },
    { time: '08:00 PM', temp: temp - 4, rainProb: 25, condition: 'Cloudy', icon: '04d' },
    { time: '10:00 PM', temp: temp - 5, rainProb: 10, condition: 'Clear Night', icon: '01n' },
  ];

  const daily: DailyForecast[] = [
    { day: 'Today', tempMax: temp + 2, tempMin: temp - 6, rainProb: 35, condition: 'Partly Cloudy', icon: '02d' },
    { day: 'Wed', tempMax: temp + 3, tempMin: temp - 5, rainProb: 65, condition: 'Scattered Showers', icon: '10d' },
    { day: 'Thu', tempMax: temp + 1, tempMin: temp - 6, rainProb: 20, condition: 'Sunny', icon: '01d' },
    { day: 'Fri', tempMax: temp + 2, tempMin: temp - 5, rainProb: 15, condition: 'Sunny', icon: '01d' },
    { day: 'Sat', tempMax: temp + 4, tempMin: temp - 4, rainProb: 45, condition: 'Thunderstorm', icon: '11d' },
  ];

  return {
    location,
    temp,
    feelsLike: temp + 3,
    condition: 'Partly Cloudy & Humid',
    humidity,
    rainProb,
    windSpeed,
    uvIndex: 8,
    cloudCover: 45,
    hourly,
    daily,
    aiInsight: generateWeatherInsight(temp, humidity, rainProb, windSpeed),
    fieldActivityRecommendation: generateFieldActivityAdvice(temp, humidity, rainProb, windSpeed),
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

function generateWeatherInsight(temp: number, humidity: number, rainProb: number, windSpeed: number): string {
  if (humidity > 75 && temp > 28) {
    return `High humidity (${humidity}%) paired with warm temperatures (${temp}°C) creates favorable environmental conditions for fungal spores such as Leaf Blight and Mildew. Early morning leaf inspection is recommended.`;
  }
  if (rainProb > 50) {
    return `Higher rain probability (${rainProb}%) expected within 24-48 hours. Ensure field drainage channels are cleared to prevent waterlogging in young crops.`;
  }
  return `Current environmental parameters are favorable for regular crop growth. Moderate breeze of ${windSpeed} km/h ensures good canopy ventilation.`;
}

function generateFieldActivityAdvice(temp: number, humidity: number, rainProb: number, windSpeed: number): string {
  if (rainProb > 50) {
    return 'WAIT BEFORE ACTING: Delay chemical pesticide or liquid fertilizer spraying as expected rain will cause nutrient wash-off.';
  }
  if (windSpeed > 20) {
    return 'SPRAY WARNING: High wind speed (>20 km/h) may cause pesticide spray drift. Wait for calmer late afternoon hours.';
  }
  return 'OPTIMAL FIELD WINDOW: Today between 4:00 PM and 6:00 PM is suitable for field monitoring and foliar application.';
}
