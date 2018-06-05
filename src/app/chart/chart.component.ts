import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() options: any;
  private chart: any;

  constructor() {}

  ngOnInit() {
    let defaultOptions = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Temperature, C',
          data: [],
          backgroundColor: 'rgba(255, 108, 3, 0.3)',
          hoverBackgroundColor: 'rgba(255, 108, 3, 0.5)',
          borderColor: 'rgba(255, 108, 3, 1)',
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        }
      }
    };

    this.chart = new Chart('app-weather-chart', defaultOptions);
  }

  ngOnChanges(changes) {
    let options = changes.options,
        dataset;

    if (options && this.chart) {
      options = options.currentValue;
    } else {
      return;
    }

    dataset = this.chart.data.datasets[0];

    this.chart.data.labels = options.labels;
    dataset.data = options.data;
    dataset.label = options.label;
    dataset.backgroundColor = options.backgroundColor;
    dataset.hoverBackgroundColor = options.hoverBackgroundColor;
    dataset.borderColor = options.borderColor;

    this.chart.update();
  }
}
