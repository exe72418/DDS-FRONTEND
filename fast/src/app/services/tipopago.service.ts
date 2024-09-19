import { Injectable } from '@angular/core';
import { TipoPago } from '../models/tipopago';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TipopagoService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<TipoPago[]>{
    console.log('yendo a buscar los tipos de productos')
    return this.httpClient.get<TipoPago[]>(environment.serverUrl+'tiposDePago/');
  }
  delete(idTipoPago:number):Observable<void>{
    return this.httpClient.delete<void>(environment.serverUrl+'tiposDePago/'+idTipoPago);
  }
  update (tipopago:TipoPago):Observable<TipoPago>{
    return this.httpClient.put<TipoPago>(environment.serverUrl+'tiposDePago',tipopago)
  }
  create (tipopago:TipoPago):Observable<TipoPago>{
    return this.httpClient.post<TipoPago>(environment.serverUrl+'tiposDePago',tipopago)
  } 
}
