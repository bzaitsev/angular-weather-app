import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

@Injectable(/* {
  providedIn: 'root'
} */)
export class WeatherService {
  // http://api.openweathermap.org/data/2.5/forecast?q=London&cnt=2&appid=06de189f9149b695124a27a8abeeffcb
  private weatherUrl = 'http://api.openweathermap.org/data/2.5/forecast';

  constructor(
    private http: Http
  ) { }

  getWeather(city) {
    const params = new URLSearchParams();

    if (!city) {
      city = 'London';
    }

    params.set('q', city);
    params.set('cnt', '10');
    params.set('units', 'metric');
    params.set('appid', '06de189f9149b695124a27a8abeeffcb');

    return this.http.get(this.weatherUrl, {search: params});
  }
}
