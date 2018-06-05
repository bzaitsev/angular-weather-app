import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

@Injectable()
export class WeatherService {
  // http://api.openweathermap.org/data/2.5/forecast?q=London&cnt=2&appid=06de189f9149b695124a27a8abeeffcb
  private weatherUrl = 'http://api.openweathermap.org/data/2.5/forecast';

  constructor(
    private http: Http
  ) {}

  getWeather(city) {
    const params = new URLSearchParams();

    if (!city) {
      city = 'London';
    }

    params.set('q', city);
    params.set('cnt', '16');
    params.set('units', 'metric');
    params.set('appid', '06de189f9149b695124a27a8abeeffcb');

    return this.http.get(this.weatherUrl, {search: params});
  }
}
