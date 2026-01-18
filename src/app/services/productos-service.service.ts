import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { TipoProducto } from '../models/tipoProducto';

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

  getProductosActivos(): Observable<Producto[]> {
    return this.httpClient.get<Producto[]>(environment.serverUrl + 'producto/activos/')
      .pipe(
        map((response: any) => response.data))
  }

  getProductosByFilters(
    descripcion: string = '',
    tipoProducto: TipoProducto | null = null,
    precioMinimo: number | null = null,
    precioMaximo: number | null = null
  ): Observable<Producto[]> {
    let params = new HttpParams();

    if (descripcion) {
      params = params.set('descripcion', descripcion);
    }

    if (tipoProducto !== null) {
      params = params.set('tipoProducto', tipoProducto.id.toString());
    }

    if (precioMinimo !== null) {
      params = params.set('precioMinimo', precioMinimo.toString());
    }

    if (precioMaximo !== null) {
      params = params.set('precioMaximo', precioMaximo.toString());
    }

    return this.httpClient.get<any>(environment.serverUrl + 'producto/filter', { params })
      .pipe(
        map((response) => response.productos)
      );
  }

  update(producto: Producto): Observable<Producto> {
    return this.httpClient.put<Producto>(environment.serverUrl + 'producto/' + producto.codigo, producto)
  }
  save(producto: Producto): Observable<Producto> {
    return this.httpClient.post<Producto>(environment.serverUrl + 'producto', producto)
  }
  delete(producto: Producto): Observable<Producto> {
    return this.httpClient.delete<Producto>(environment.serverUrl + 'producto/' + producto.codigo)
  }
  findOne(codigo: number): Observable<Producto> {
    return this.httpClient.get<Producto>(environment.serverUrl + 'producto/' + codigo)
      .pipe(
        map((response: any) => response.data))
  }
}
