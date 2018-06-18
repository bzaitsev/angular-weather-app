import { Component } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { NotificationsService } from 'angular2-notifications';

interface WeatherResponse {
  cod: string,
  list: any,
  message: string,
  cnt: number,
  city: any
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  weatherIconUrl: string;
  cloudiness: string;
  firstLoad = true;
  loadingForecast = false;
  chartData = null;
  activeChartType = 'temperature';
  chartTypes = ['temperature', 'pressure', 'wind', 'humidity'];

  allForecast = {
    list: [],
    cnt: 0,
    city: {
      name: 'City',
      country: 'Country'
    }
  };

  detailForecast = {
    dt_txt: new Date(),
    weather: [{
      name: '',
      icon: '',
      main: ''
    }],
    main: {
      temp: 0,
      pressure: 0,
      humidity: 0
    },
    clouds: {
      all: 0
    },
    wind: {
      speed: 0
    }
  };

  constructor(
    private weatherService: WeatherService,
    private notificationsService: NotificationsService
  ) {
    this.getWeather('London');
  }

  onSearchEnter(city: string) {
    this.getWeather(city);
  }

  onChartTypeBtnClick(type: string) {
    this.chartData = this.getChartData(type);
  }

  getChartData(type: string): any {
    let chartData: any = {};

    if (type) {
      this.activeChartType = type;
    }

    switch (this.activeChartType) {
      case 'temperature':
        chartData = {
          label: 'Temperature, C',
          color: 'red',
          data: this.allForecast.list.map(item => {
            return item.main.temp;
          })
        };
        break;

      case 'pressure':
        chartData = {
          label: 'Pressure, hPa',
          color: 'orange',
          data: this.allForecast.list.map(item => {
            return item.main.pressure;
          })
        };
        break;

      case 'wind':
        chartData = {
          label: 'Wind, m/s',
          color: 'green',
          data: this.allForecast.list.map(item => {
            return item.wind.speed;
          })
        };
        break;

      case 'humidity':
        chartData = {
          label: 'Humidity, %',
          color: 'blue',
          data: this.allForecast.list.map(item => {
            return item.main.humidity;
          })
        };
        break;
    }

    chartData.labels = this.allForecast.list.map(item => {
      return item.dt_txt;
    });

    return chartData;
  }

  getWeather(city: string) {
    this.loadingForecast = true;
    this.weatherService.getWeather(city).subscribe(
      (response: WeatherResponse) => {
        this.loadingForecast = false;

        if (!response) {
          return this.notificationsService.error('Error', 'Server error.');
        }

        if (+response.cod !== 200) {
          return this.notificationsService.error('Error', `${response.cod} ${response.message}`);
        }

        this.allForecast = response;
        this.detailForecast = response.list[0];
        this.weatherIconUrl = `https://openweathermap.org/img/w/${this.detailForecast.weather[0].icon}.png`;
        this.cloudiness = this.detailForecast.weather[0].main;
        this.chartData = this.getChartData(this.activeChartType);

        if (this.firstLoad) {
          this.firstLoad = false;
        } else {
          this.notificationsService.success('Loaded Forecast', `${this.allForecast.city.name}, ${this.allForecast.city.country}`);
        }
      },
      error => {
        this.loadingForecast = false;
        return this.notificationsService.error(`Error ${error.cod}`, error.message);
      }
    );
  }
}
