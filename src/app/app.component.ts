/**

*) Format 1,024 number
*) Update chart (bugs)
*) chart labels (6 feb, 15:00)
*) Tabs
*) Footer

*) refactoring, ed-video
*) push on github, publish in internet

**/

import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { WeatherService } from './weather.service';
import { NotificationsService } from 'angular2-notifications';
import { Chart } from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css'
  ]
})
export class AppComponent implements OnInit {
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
    cnt: 0,
    city: {
      name: 'City',
      country: 'Country'
    }
  };

  ngOnInit() {
    window.app = window.app || {};

    window.app.chart = new Chart('app-weather-chart', {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Temperature, C',
          data: [],
          backgroundColor: 'rgba(255, 108, 3, 0.3)',
          borderColor: 'rgba(255, 108, 3, 1)',
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            // stacked: true
          }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        }
      }
    });
  }

  constructor(
    private weatherService: WeatherService,
    private notificationsService: NotificationsService
  ) {
    this.getWeather('London');
  }

  onSearchEnter(city, event) {
    this.disableCitySearchField();
    this.getWeather(city);
  }

  disableCitySearchField(value = true) {
    const citySearchField = document.getElementById('city-searchfield');

    if (!citySearchField) return;

    citySearchField.disabled = value;
  }

  getWeather(city): void {
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

        this.allWeather = data;
        this.detailedWeather = data.list[0];
        this.iconUrl = `http://openweathermap.org/img/w/${this.detailedWeather.weather[0].icon}.png`;
        this.weatherStatus = this.detailedWeather.weather[0].main;

        if (this.firstLoad) {
          this.firstLoad = false;
        } else {
          this.notificationsService.success('Loaded forecast', `${this.allWeather.city.name}, ${this.allWeather.city.country}`);
        }

        // chart
        let chartData = data.list.map(item => {
          return item.main.temp;
        });

        let chartLabels = data.list.map(item => {
          return item.dt_txt;
        });

        // debugger;

        window.app.chart.data.labels = chartLabels;
        window.app.chart.data.datasets[0].data = chartData;
        window.app.chart.update();
      },
      error => {
        this.disableCitySearchField(false);
        const data = error.json();
        return this.notificationsService.error(`Error ${data.cod}`, data.message);
      }
    );
  }
}
