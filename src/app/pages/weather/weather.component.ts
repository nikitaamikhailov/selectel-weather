import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {WeatherService} from "../../data/services/weather/weather.service";
import {IWeatherListDay} from "../../data/services/weather/weather.service.model";
import { PlatformLocation} from "@angular/common";
import {Router} from "@angular/router";
import {take} from "rxjs";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  public errorMessage: string = '';

  public weatherListByDay: IWeatherListDay[] | null = null;

  public showedCity: string = '';

  public cityForExpample: string = 'Bangkok';

  constructor(
    private _formBuilder: FormBuilder,
    private weatherService: WeatherService,
    private _location: PlatformLocation,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.setCityFromURL();
    this.subscribeOnErrors();
  }

  public sortByTimeUp() {
    this.weatherListByDay = this.weatherListByDay!.sort(function (a, b) {
      return (a.date + a.time > b.date + b.time) ? 1 : -1 ;
    })
  }

  public sortByTimeDown() {
    this.weatherListByDay = this.weatherListByDay!.sort(function (a, b) {
      return (a.date + a.time < b.date + b.time) ? 1 : -1 ;
    })
  }

  public sortByTempUp() {
    this.weatherListByDay = this.weatherListByDay!.sort(function (a, b) {
      return (a.temperature > b.temperature) ? 1 : -1 ;
    })
  }

  public sortByTempDown() {
    this.weatherListByDay = this.weatherListByDay!.sort(function (a, b) {
      return (a.temperature < b.temperature) ? 1 : -1 ;
    })
  }


  public subscribeOnErrors() {
    this.weatherService.errorMessage.subscribe(
      (message) => {
        this.errorMessage = message;
      }
    )
  }

  public cityForm: FormGroup = this._formBuilder.group(
    {
      cityToGetWeather: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]/)]],
    }
  )

  public getParamsFromURL() {
    let paramsList = new Map;
    this._location.search.substring(1).split('&').forEach((param: string) => {
      let params = param.split('=');
      paramsList.set(params[0], params[1]);
    })

    return paramsList;
  }

  public setCityFromURL() {
    const paramsList = this.getParamsFromURL();
    const city = paramsList.get('city');
    if (city) {
      this.searchCity(city);
      console.log(city);
    }
  }

  public searchCity(city: string) {
    this.weatherService.errorMessage.next('');
    this.weatherService.getWeatherByCity(city).pipe(take(1))
      .subscribe(
        (weatherList: IWeatherListDay[]) => {
            this.weatherListByDay = weatherList;
            this.showedCity = city.toUpperCase();
            this.saveCityInURL(city);
        }
      );
  }

  public saveCityInURL(city: string){
    this._router.navigate([], {
      queryParams: {
        city,
      },
      queryParamsHandling: 'merge',
    });
  }

  public submit() {
    if (this.cityForm.invalid) {
      return;
    }
    this.searchCity(this.cityForm.value.cityToGetWeather);
  }
}
