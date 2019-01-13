import { Component } from '@angular/core';
import {
  NavController, NavParams, ToastController, AlertController,
  ViewController, ActionSheetController, LoadingController
} from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from 'rxjs/Observable';
import { Profile } from "../../interfaces/profile";
import { ChainWeather } from "../../providers/weather2";
import { Day_Forecast } from "../../interfaces/day_forecast";

@Component({
  selector: 'page-weather',
  templateUrl: 'weather.html'
})
export class WeatherPage {
  private forecast_Ready: boolean = false;
  private observable;
  constructor(
    public viewCtrl: ViewController,
    public afDatabase: AngularFireDatabase,
    public alertCtrl: AlertController,
    public weather: ChainWeather,
    public loading: LoadingController,
    public navParams: NavParams) {
      let temp = this;
      this.observable = Observable.interval(400).subscribe(x => {
        console.log(temp.weather.five_Day_Forecast)
        if( this.weather.five_Day_Forecast != undefined
          && this.weather.five_Day_Forecast.length >= 4 ){
          this.forecast_Ready = true;
          temp.observable.unsubscribe();
        }
      })
  }
  displayWeatherInformation(forecast: Day_Forecast) {
    let description: string;
    if (forecast.forecast_main == "Rain") {
      description = forecast.forecast_description + "<br> Expected mm of rain: " + forecast.rain_amount_mm;
    }
    else {
      description = forecast.forecast_description;
    }
    let alert = this.alertCtrl.create({
      title: 'Weather forecast for ' + forecast.day_string,
      subTitle: forecast.forecast_main,
      message: description,
      buttons: ['Great']
    });
    alert.present();
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
