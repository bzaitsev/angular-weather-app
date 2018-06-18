// Vendor
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';
// App
import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { WeatherService } from './services/weather.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SimpleNotificationsModule.forRoot({
      showProgressBar: false,
      pauseOnHover: true,
      clickToClose: true,
      animate: 'fromTop',
      timeOut: 5000,
      position: ['top', 'left']
    })
  ],
  declarations: [
    AppComponent,
    ChartComponent
  ],
  providers: [
    WeatherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
