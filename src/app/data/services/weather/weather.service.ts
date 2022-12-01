import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { map, Observable, catchError, BehaviorSubject } from "rxjs";
import { IApiError, IResponseWeather, IResponseWeatherDay, IWeatherListDay } from "./weather.service.model";

@Injectable({
  providedIn: 'root',
})

export class WeatherService {
  constructor(
    private readonly _http: HttpClient,
  ) {}

  public errorMessage: BehaviorSubject<string> = new BehaviorSubject('')

  public getWeatherByCity(city: string): Observable<IWeatherListDay[]> {
    return this._http.get<IResponseWeather>(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${environment.apiKey}`)
      .pipe(
        map((response: IResponseWeather) => {
          console.log(response);
          let weatherList: IWeatherListDay[] = [];
          response.list.forEach((day: IResponseWeatherDay, idx: number) => {
            weatherList[idx] = {
              date: this.getDateFromString(day.dt_txt),
              time: this.getTimeFromString(day.dt_txt),
              temperature: day.main.temp,
              weather: day.weather[0].main
            }
          })
          return weatherList;
        }),
        catchError((err: IApiError) => {
          this.errorMessage.next(err.error.message)
          return [];
        })
    );
  }

  public getDateFromString(date: string) {
    return date
      .split(' ')[0]
      .split('-')
      .reverse()
      .join('.');
  }

  public getTimeFromString(date: string) {
    return date
      .split(' ')[1]
  }

}

