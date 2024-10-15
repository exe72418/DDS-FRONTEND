import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Pedido } from '../models/pedido';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoServiceService {

  constructor(private httpClient: HttpClient) { }

  guardar(pedido:Pedido):Observable<Pedido>{
    return this.httpClient.post<Pedido>(environment.serverUrl + 'pedido', pedido)
  }
  getAll():Observable<Pedido[]>{
    console.log('yendo a buscar')
    return this.httpClient.get<Pedido[]>(environment.serverUrl+'pedido')
    .pipe(
      map((response: any) => response.data))
  }
}
