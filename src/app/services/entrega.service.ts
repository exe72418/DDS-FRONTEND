import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Entrega } from '../models/entrega';
import { Pedido } from '../models/pedido';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Entrega[]> {
    return this.httpClient.get<any>(environment.serverUrl + 'entregas')
      .pipe(
        map((response: any) => response.data) 
      );
  }
  update(entrega: Entrega): Observable<Entrega> {
    return this.httpClient.put<Entrega>(environment.serverUrl + 'entregas/' + entrega.id, entrega)
  }
  save(entrega: Entrega): Observable<Entrega> {
    return this.httpClient.post<Entrega>(environment.serverUrl + 'entregas', entrega)
  }

  delete(idEntrega: number): Observable<void> {
    return this.httpClient.delete<void>(environment.serverUrl + 'entregas/' + idEntrega);
  }

  getPedidosPagosSinEntrega(): Observable<Pedido[]> {
    return this.httpClient.get<Pedido[]>(environment.serverUrl + 'pedido/pedidos/noentregados/');
  }
}
