export interface IWeatherListDay {
  date: string,
  time: string,
  temperature: number,
  weather: string,
}

export interface IResponseWeather {
  cod: string,
  message: number,
  cnt: number,
  list: IResponseWeatherDay[]
}

export interface IResponseWeatherDay {
  dt: number,
  main: IResponseWeatherDayMain,
  weather: IResponseWeatherDayWeather[],
  clouds: IResponseWeatherDayClouds,
  wind: IResponseWeatherDayWind,
  visibility: number,
  pop: number,
  sys: IResponseWeatherDaySys,
  dt_txt: string
}

export interface IResponseWeatherDayMain {
  temp: number,
  feels_like: number,
  temp_min: number,
  temp_max: number,
  pressure: number,
  sea_level: number,
  grnd_level: number,
  humidity: number,
  temp_kf: number
}

export interface IResponseWeatherDayWeather {
  id: number,
  main: string,
  description: string,
  icon: string
}

export interface IResponseWeatherDayWind {
  speed: number,
  deg: number,
  gust: number
}

export interface IResponseWeatherDayClouds {
  all: number
}

export interface IResponseWeatherDaySys {
  pod: string
}

export interface IApiError {
  error: {
    cod: string,
    message: string
  }
  headers: any,
  message: string,
  name: string,
  ok: boolean,
  status: number,
  statusText: string,
  url: string,
}
