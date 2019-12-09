import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WheatherService {
  private url  = "https://api.weatherbit.io/v2.0/";
  private apiKey = "0a6e2ea6691142d2a940c8eaecb328ba";
  constructor( private http: HttpClient ) { }

  //Conecta a la API y obtiene los datos
  getWheather(lat:string,lon:string,units="M",days=16){
    return this.http.get(`${this.url}forecast/daily?lat=${lat}&lon=${lon}&key=${this.apiKey}&units=${units}&days=${days}`).pipe(
    map( resp => { return resp;}));
  }
}
