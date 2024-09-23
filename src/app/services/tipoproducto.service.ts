import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoProducto } from '../models/tipoProducto';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoproductoService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<TipoProducto[]>{
    console.log('yendo a buscar los tipos de productos')
    return this.httpClient.get<TipoProducto[]>(environment.serverUrl+'tiposDeProducto/');
  }
  delete(idTipoProd:number):Observable<void>{
    return this.httpClient.delete<void>(environment.serverUrl+'tiposDeProducto/'+idTipoProd);
  }
  update (tipoprod:TipoProducto):Observable<TipoProducto>{
    return this.httpClient.put<TipoProducto>(environment.serverUrl+'tiposDeProducto',tipoprod)
  }
  create (tipoprod:TipoProducto):Observable<TipoProducto>{
    return this.httpClient.post<TipoProducto>(environment.serverUrl+'tiposDeProducto',tipoprod)
  } 
}
