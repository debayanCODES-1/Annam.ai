export type WeatherLocation = {
  latitude: number;
  longitude: number;
};

export type WeatherCondition = {
  date: string;
  temperatureC: number;
  rainProbability: number;
  condition: string;
};

export interface WeatherProvider {
  getCurrentWeather(location: WeatherLocation): Promise<WeatherCondition>;
  getForecast(location: WeatherLocation, days: number): Promise<WeatherCondition[]>;
  getRainProbability(location: WeatherLocation, date: string): Promise<number>;
}

export class MockWeatherProvider implements WeatherProvider {
  async getCurrentWeather(_: WeatherLocation): Promise<WeatherCondition> {
    return {
      date: new Date().toISOString().slice(0, 10),
      temperatureC: 29,
      rainProbability: 24,
      condition: 'Partly cloudy',
    };
  }

  async getForecast(_: WeatherLocation, days: number): Promise<WeatherCondition[]> {
    const start = new Date();
    return Array.from({ length: days }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        date: date.toISOString().slice(0, 10),
        temperatureC: 28 + index,
        rainProbability: [18, 26, 32, 20, 14][index] ?? 20,
        condition: ['Sunny', 'Cloudy', 'Rain possible', 'Partly cloudy', 'Dry'][index] ?? 'Dry',
      };
    });
  }

  async getRainProbability(_: WeatherLocation, date: string): Promise<number> {
    return date.endsWith('3') ? 30 : 20;
  }
}
