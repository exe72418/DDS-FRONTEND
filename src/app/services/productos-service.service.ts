import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Producto } from '../models/producto';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  getProductosByName(descripcion: string = ''): Observable<Producto[]> {
    let params = new HttpParams();

    // Solo añadimos el filtro si la descripción está presente
    if (descripcion) {
      params = params.set('descripcion', descripcion);
    }

    // Realizamos la solicitud GET
    return this.httpClient.get<Producto[]>(environment.serverUrl+'producto/ByName', { params })
    .pipe(
      map((response: any) => response.productos));
  }
  update(producto: Producto): Observable<Producto> {
    return this.httpClient.put<Producto>(environment.serverUrl + 'producto/' + producto.codigo, producto)
  }
  save(producto: Producto): Observable<Producto> {
    return this.httpClient.post<Producto>(environment.serverUrl + 'producto', producto)
  }
  delete(producto:Producto):Observable<Producto>{
    return this.httpClient.delete<Producto>(environment.serverUrl+'producto/'+producto.codigo)
  }
  findOne(codigo: number):Observable<Producto> {
    return this.httpClient.get<Producto>(environment.serverUrl+'producto/' + codigo)
      .pipe(
        map((response: any) => response.data))
  }
}
