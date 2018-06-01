// Vendor
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SimpleNotificationsModule } from 'angular2-notifications';
// App
import { AppComponent } from './app.component';
import { ChartComponent } from './chart/chart.component';
import { WeatherService } from './weather.service';


@NgModule({
  declarations: [
    AppComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot({
			showProgressBar: false,
      pauseOnHover: true,
      clickToClose: true,
      animate: 'fromTop',
      timeOut: 5000,
      position: ['top', 'left'],
    }),
    FormsModule,
    HttpModule
  ],
  providers: [
    WeatherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
