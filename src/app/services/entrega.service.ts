import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Entrega } from '../models/entrega';
import { Pedido } from '../models/pedido';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getEntregasByFilters(
    fechaDesde: Date | null, 
    fechaHasta: Date | null, 
    clienteId: number | null
  ): Observable<Entrega[]> {
    
    let params = new HttpParams();

    if (fechaDesde) {
      params = params.set('fechaDesde', fechaDesde.toISOString());
    }

    if (fechaHasta) {
      params = params.set('fechaHasta', fechaHasta.toISOString());
    }

    if (clienteId) {
      params = params.set('clienteId', clienteId.toString());
    }

    return this.httpClient.get<any>(environment.serverUrl + 'entregas/filter', { params })
      .pipe(
        map(response => response.data || response.entregas)
      );
  }
}
