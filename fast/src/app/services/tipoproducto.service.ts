import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoProducto } from '../models/tipoProducto';

@Injectable({
  providedIn: 'root'
})
export class TipoproductoService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<TipoProducto[]>{
    console.log('yendo a buscar los tipos de productos')
    return this.httpClient.get<TipoProducto[]>('http://localhost:3000/api/v2/tiposDeProducto/');
  }
}
