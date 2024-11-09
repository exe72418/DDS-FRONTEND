import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Pedido } from '../models/pedido';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class PedidoServiceService {

  constructor(private httpClient: HttpClient) { }

  guardar(pedido: Pedido): Observable<Pedido> {
    return this.httpClient.post<Pedido>(environment.serverUrl + 'pedido', pedido)
  }
  editar(pedido:Pedido):Observable<Pedido>{
    return this.httpClient.put<Pedido>(environment.serverUrl + 'pedido/' + pedido.nroPedido, pedido)
  }
  getAll():Observable<Pedido[]>{
    return this.httpClient.get<Pedido[]>(environment.serverUrl+'pedido')
    .pipe(
      map((response: any) => response.data))
  }
  delete(pedido:Pedido):Observable<Pedido>{
    return this.httpClient.delete<Pedido>(environment.serverUrl + 'pedido/' + pedido.nroPedido)
  }

  getPedidosByFilters(
    clienteId: Cliente | null = null, 
    fechaInicio: Date | null = null,
    fechaFin: Date | null = null
  ): Observable<Pedido[]> {
    let params = new HttpParams();
  
    // Añadir los parámetros que están presentes
    if (clienteId !== null) {
      params = params.set('clienteId', clienteId.id.toString());
    }
  
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio.toISOString());
    }
  
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin.toISOString());
    }
    // Realizar la solicitud GET con los filtros
    return this.httpClient.get<any>(environment.serverUrl + 'pedido/pedido/filter', { params })
      .pipe(
        map((response) => response.pedidos)  // Extraemos la lista de pedidos desde la respuesta
      );
  }
  

}
