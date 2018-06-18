import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() options: any;
  private chart: any;
  private defaultColor = 'red';
  private colors = {
    'red': {
      backgroundColor: 'rgba(255, 80, 80, 0.3)',
      hoverBackgroundColor: 'rgba(255, 80, 80, 0.5)',
      borderColor: 'rgba(255, 80, 80, 1)'
    },
    'orange': {
      backgroundColor: 'rgba(255, 108, 3, 0.3)',
      hoverBackgroundColor: 'rgba(255, 108, 3, 0.5)',
      borderColor: 'rgba(255, 108, 3, 1)'
    },
    'green': {
      backgroundColor: 'rgba(3, 255, 34, 0.3)',
      hoverBackgroundColor: 'rgba(3, 255, 34, 0.5)',
      borderColor: 'rgba(3, 255, 34, 1)'
    },
    'blue': {
      backgroundColor: 'rgba(3, 69, 255, 0.3)',
      hoverBackgroundColor: 'rgba(3, 69, 255, 0.5)',
      borderColor: 'rgba(3, 69, 255, 1)'
    }
  };

  constructor() {}

  ngOnInit() {
    const defaultOptions = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Temperature, C',
          data: [],
          backgroundColor: this.colors[this.defaultColor].backgroundColor,
          hoverBackgroundColor: this.colors[this.defaultColor].hoverBackgroundColor,
          borderColor: this.colors[this.defaultColor].borderColor,
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

  ngOnChanges(changes: any) {
    let options = changes.options,
        chartData,
        chartDataset;

    if (options && this.chart) {
      options = options.currentValue;
    } else {
      return;
    }

    const color = options.color || this.defaultColor;
    chartData = this.chart.data;
    chartDataset = chartData.datasets[0];

    chartData.labels = options.labels.map(label => {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(label, 'H:mm, d MMM'); // 15:00, 6 Feb
    });

    chartDataset.data = options.data;
    chartDataset.label = options.label;
    chartDataset.backgroundColor = this.colors[color].backgroundColor;
    chartDataset.hoverBackgroundColor = this.colors[color].hoverBackgroundColor;
    chartDataset.borderColor = this.colors[color].borderColor;

    this.chart.update();
  }
}
