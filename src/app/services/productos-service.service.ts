import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosServiceService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Producto[]> {
    return this.httpClient.get<Producto[]>(environment.serverUrl + 'producto')
      .pipe(
        map((response: any) => response.productos))
  }
  update(producto: Producto): Observable<Producto> {
    return this.httpClient.put<Producto>(environment.serverUrl + 'producto/' + producto.codigo, producto)
  }
  save(producto: Producto): Observable<Producto> {
    return this.httpClient.post<Producto>(environment.serverUrl + 'producto', producto)
  }
}
