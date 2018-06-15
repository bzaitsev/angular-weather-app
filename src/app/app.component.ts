import { Component } from '@angular/core';
import { WeatherService } from './services/weather.service';
import { NotificationsService } from 'angular2-notifications';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  firstLoad = true;
  iconUrl = '';
  weatherStatus = 'Status';
  detailedWeather = {
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
  allWeather = {
    list: [],
    cnt: 0,
    city: {
      name: 'City',
      country: 'Country'
    }
  };
  chartOptions = null;
  chartParam = 'temperature';

  constructor(
    private weatherService: WeatherService,
    private notificationsService: NotificationsService
  ) {
    this.getWeather('London');
  }

  onSearchEnter(city) {
    this.disableCitySearchField();
    this.getWeather(city);
  }

  onToolbarClick(event) {
    const target = event.target;
    const type = target.getAttribute('data-type');

    if (!type) return;

    this.chartOptions = this.getChartOptions(type);
  }

  disableCitySearchField(value = true) {
    const citySearchField = document.getElementById('city-searchfield');

    if (!citySearchField) return;

    if (value) {
      citySearchField.setAttribute('disabled', 'true');
    } else {
      citySearchField.removeAttribute('disabled');
    }
  }

  getChartOptions(type) {
    let data: any = {};

    if (type) {
      this.chartParam = type;
    }

    switch (this.chartParam) {
      case 'temperature':
        data = this.getTemperatureData();
        break;
      case 'pressure':
        data = this.getPressureData();
        break;
      case 'wind':
        data = this.getWindData();
        break;
      case 'humidity':
        data = this.getHumidityData();
        break;
    }

    data.labels = this.allWeather.list.map(item => {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(item.dt_txt, 'H:mm, d MMM'); // 15:00, 6 Feb
    });

    return data;
  }

  getTemperatureData() {
    let chartData = this.allWeather.list.map(item => {
      return item.main.temp;
    });

    return {
      data: chartData,
      label: 'Temperature, C',
      backgroundColor: 'rgba(255, 80, 80, 0.3)',
      hoverBackgroundColor: 'rgba(255, 80, 80, 0.5)',
      borderColor: 'rgba(255, 80, 80, 1)'
    }
  }

  getPressureData() {
    let chartData = this.allWeather.list.map(item => {
      return item.main.pressure;
    });

    return {
      data: chartData,
      label: 'Pressure, hPa',
      backgroundColor: 'rgba(255, 108, 3, 0.3)',
      hoverBackgroundColor: 'rgba(255, 108, 3, 0.5)',
      borderColor: 'rgba(255, 108, 3, 1)'
    }
  }

  getWindData() {
    let chartData = this.allWeather.list.map(item => {
      return item.wind.speed;
    });

    return {
      data: chartData,
      label: 'Wind, m/s',
      backgroundColor: 'rgba(3, 255, 34, 0.3)',
      hoverBackgroundColor: 'rgba(3, 255, 34, 0.5)',
      borderColor: 'rgba(3, 255, 34, 1)'
    }
  }

  getHumidityData() {
    let chartData = this.allWeather.list.map(item => {
      return item.main.humidity;
    });

    return {
      data: chartData,
      label: 'Humidity, %',
      backgroundColor: 'rgba(3, 69, 255, 0.3)',
      hoverBackgroundColor: 'rgba(3, 69, 255, 0.5)',
      borderColor: 'rgba(3, 69, 255, 1)'
    }
  }

  getWeather(city) {
    this.weatherService.getWeather(city).subscribe(
      response => {
        this.disableCitySearchField(false);

        if (!response || !response.json) {
          return this.notificationsService.error('Error', 'Server error.');
        }

        const data = response.json();

        if (+data.cod !== 200) {
          return this.notificationsService.error('Error', `${data.cod} ${data.message}`);
        }

        // set data
        this.allWeather = data;
        this.detailedWeather = data.list[0];
        this.iconUrl = `https://openweathermap.org/img/w/${this.detailedWeather.weather[0].icon}.png`;
        this.weatherStatus = this.detailedWeather.weather[0].main;

        if (this.firstLoad) {
          this.firstLoad = false;
        } else {
          this.notificationsService.success('Loaded Forecast', `${this.allWeather.city.name}, ${this.allWeather.city.country}`);
        }

        this.chartOptions = this.getChartOptions(this.chartParam);
      },
      error => {
        const data = error.json();
        this.disableCitySearchField(false);
        return this.notificationsService.error(`Error ${data.cod}`, data.message);
      }
    );
  }
}
