import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class WeatherService {
  private weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(
    private http: HttpClient
  ) {}

  getWeather(city: string) {
    let params = new HttpParams();

    if (!city) {
      city = 'London';
    }

    params = params.append('q', city);
    params = params.append('cnt', '16');
    params = params.append('units', 'metric');
    params = params.append('appid', '06de189f9149b695124a27a8abeeffcb');

    return this.http.get(this.weatherUrl, {params: params});
  }
}
