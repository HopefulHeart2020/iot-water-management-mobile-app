import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { Profile } from "../interfaces/profile";
import { User } from "../interfaces/user";
import { SystemInterface } from "../interfaces/system";
import { Coordinates } from "../interfaces/coordinates";
import { IrrigationSettings } from "../interfaces/irrigationSettings";
import { Schedule } from "../interfaces/schedule";
import { Day_Forecast } from "../interfaces/day_forecast"
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChainWeather {
  private UID: string;
  private url: string;
  private API_KEY: string;
  private systemsRef$: Observable<any[]>;
  public five_Day_Forecast = Array({} as Day_Forecast);
  public five_Day_Forecast_Observable: Observable<any>;
  public profileData: Observable<Profile>
  public testCoords = {} as Coordinates;
  public today: Date;
  public todayString: string;
  public weather_Forecast_For_Today: Day_Forecast;
  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private http: Http,
  ) {
    let temp = this;
    this.today = new Date();
    this.todayString = this.getDayString(this.today.getDay());
    // The test coordinates represent Garth's House: -34.075079, 18.881098
    this.testCoords.lat = -34.075079;
    this.testCoords.lon = 18.881098;
    this.five_Day_Forecast = [];
    this.url = 'http://api.openweathermap.org/data/2.5/forecast'
    this.API_KEY = "6fa1735d7d1bfd09e058f437d7855b04";
    this.requestWeather(this.testCoords, function(weatherResults) {
      //this.test = weatherResults;
      temp.analyzeWeatherData(weatherResults)
    });
    setTimeout(console.log("FORECASE", temp.five_Day_Forecast), 15000)
  }
  analyzeWeatherData(weatherData) {
    let dayForecast: Day_Forecast = {} as Day_Forecast;
    dayForecast.rain = false;
    dayForecast.rain_amount_mm = 0;
    dayForecast.humidity = 0;
    dayForecast.temperature = 0;
    let day_iterator, time_iterator = 0;
    let prev_forecastDay: string = this.todayString;
    let curr_forecastDay: string = this.todayString;
    let forecast_List_Length: number = null;
    for (let listItem in weatherData) {
      if (listItem == 'cnt') {
        forecast_List_Length = weatherData[listItem];
      }
      if (listItem == 'list') {
        let tempList = weatherData[listItem];
        for (let forecast_Item in tempList) {
          let tempFields = tempList[forecast_Item]
          // First loop to find and update the day and time - we need to do this before doing anything else
          for (let field in tempFields) {
            if (field == "dt_txt") {
              // console.log("dt_txt for this day_time forecast");
              //console.log(tempFields[field]);
              curr_forecastDay = this.analyze_UTC_dt(tempFields[field])
              // console.log("Current Forecast Day: " + curr_forecastDay);
              // console.log("Previous Forecast Day: " + prev_forecastDay);
              if (curr_forecastDay != prev_forecastDay) {
                day_iterator++;
                dayForecast.temperature = this.kelvinToCelsius(dayForecast.temperature / time_iterator)
                dayForecast.humidity = dayForecast.humidity / time_iterator;
                dayForecast.rain_amount_mm = Math.ceil(dayForecast.rain_amount_mm)
                dayForecast.day_string = prev_forecastDay;
                this.five_Day_Forecast.push(dayForecast);
                dayForecast = {} as Day_Forecast;
                dayForecast.rain = false;
                dayForecast.rain_amount_mm = 0;
                dayForecast.humidity = 0;
                dayForecast.temperature = 0;
                time_iterator = 0;
              }
              prev_forecastDay = curr_forecastDay;
              // console.log("Day Iterator");
              // console.log(day_iterator)
              break;
            }
            //console.log("Field in time forecast for specific day");
            //console.log(tempFields[field])
          }
          // Second loop to update everything else
          for (let field in tempFields) {
            switch (field) {
              case "main":
                //console.log("Main for this day_time forecast");
                let tempMain = tempFields[field]
                for (let mainField in tempMain) {
                  switch (mainField) {
                    case "temp":
                      // console.log("The temperature is:")
                      // console.log(tempMain[mainField]);
                      dayForecast.temperature += Number(tempMain[mainField])
                      break;
                    case "humidity":
                      // console.log("The humidity is:")
                      // console.log(tempMain[mainField]);
                      dayForecast.humidity += Number(tempMain[mainField]);
                      break;
                  }
                }
                break;
              case "weather":
                //console.log("Weather for this day_time forecast");
                //console.log(tempFields[field]);
                // The api spits out a one object array instead of the actual object straight as it states in the docs
                let tempWeather = tempFields[field][0];
                for (let weatherField in tempWeather) {
                  switch (weatherField) {
                    case "main":
                      dayForecast.forecast_main = tempWeather[weatherField];
                      break;
                    case "description":
                      dayForecast.forecast_description = tempWeather[weatherField];
                      break;
                  }
                }
                break;
              case "rain":
                //console.log("Rain for this day_time forecast");
                let tempRain = tempFields[field];
                for (let rainField in tempRain) {
                  if (rainField == "3h") {
                    dayForecast.rain = true;
                    dayForecast.rain_amount_mm += Number(tempRain[rainField]);
                  }
                }
                break;
            }
          }
          time_iterator++;
          //console.log('Time Forecast For Specific Day');
          //console.log(tempList[forecast_Item])
        }
      }
    }
    // console.log(this.five_Day_Forecast)
    this.weather_Forecast_For_Today =  this.five_Day_Forecast[0];
    // console.log(this.weather_Forecast_For_Today)
  }
  analyze_UTC_dt_txt(dt_txt: string) {
    // Example dt: 2017-09-02 12:00:00
    let month = dt_txt.slice(5, 7);
    let day = dt_txt.slice(8, 10);
    let time = dt_txt.slice(11, 16)
  }
  analyze_UTC_dt(dt: string) {
    let currentDate = new Date();
    let forecastDate = new Date(dt);
    let todayString = this.getDayString(currentDate.getDay());
    let forecast_Day_String = this.getDayString(forecastDate.getDay());
    return forecast_Day_String;
  }
  requestWeather(coords: Coordinates, callback) {
    var api_res;
    //api.openweathermap.org/data/2.5/forecast?lat=35&lon=139
    var com = this.createUrl(coords);
    this.http.get(com).map(res => res.json()).subscribe(data => {
      callback(data);
    });
  }
  createUrl(coords: Coordinates) {
    let weatherURL: string = this.url;
    weatherURL += "?lat=" + coords.lat + "&lon=" + coords.lon + "&APPID=" + this.API_KEY;
    console.log(weatherURL);
    return weatherURL
  }
  extractData(res) {
    let body = res.json();
    switch (body.success) {
      case true:
        for (var key in body) {
          if (key == 'data') {
            //this.userSystems = body[key];
          }
        }
        break;
      case false:
        console.log('Failed on request to obtain users systems array from the server');
        break;
    }
    return body.data || {};
  }
  getDayString(day: Number) {
    let todayStr: string;
    switch (day) {
      case 0:
        todayStr = 'Sunday';
        break;
      case 1:
        todayStr = 'Monday';
        break;
      case 2:
        todayStr = 'Tuesday';
        break;
      case 3:
        todayStr = 'Wednesday';
        break;
      case 4:
        todayStr = 'Thursday';
        break;
      case 5:
        todayStr = 'Friday';
        break;
      case 6:
        todayStr = 'Saturday';
        break;
    }
    return todayStr;
  }
  kelvinToCelsius(tempK) {
    return Math.round(tempK - 273.15);
  }
  get_Icon_For_Main_Description(main_description) {
    switch (main_description) {
      case "Rain":
        return "rainy";
      case "Clear":
        return "sunny";
      case "Clouds":
        return "cloudy";
      case "Thunderstorm":
        return "thunderstorm";
      case "Drizzle":
        return "rainy";
      case "Snow":
        return "snow";
      case "Atmosphere":
        return "nuclear";
      case "Extreme":
        return "alert";
      case "Additional":
        return "ios-help";
    }
  }
}
