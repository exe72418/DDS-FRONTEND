import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Pago } from '../models/pago';
import { Pedido } from '../models/pedido';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  public pedidoPendienteId: number | null = null;
  
  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Pago[]> {
    return this.httpClient.get<any>(environment.serverUrl + 'pago')
      .pipe(
        map((response: any) => response.data)
      );
  }

  misPagos() {
    return this.httpClient.get<Pago[]>(environment.serverUrl + 'pago/mis-pagos');
  }

  update(pago: Pago): Observable<Pago> {
    return this.httpClient.put<Pago>(environment.serverUrl + 'pago/' + pago.id, pago)
  }

  save(pago: Pago): Observable<Pago> {
    return this.httpClient.post<Pago>(environment.serverUrl + 'pago', pago)
  }

  delete(idPago: number): Observable<void> {
    return this.httpClient.delete<void>(environment.serverUrl + 'pago/' + idPago);
  }

  getPedidosSinPago(): Observable<Pedido[]> {
    return this.httpClient.get<any>(environment.serverUrl + 'pedido/pedidos/impagos/')
      .pipe(
        map((response: any) => response.data || response)
      );
  }

  getMisPedidosSinPago(): Observable<Pedido[]> {
    return this.httpClient.get<any>(environment.serverUrl + 'pedido/mis-pedidos-impagos')
      .pipe(map(res => res.data));
  }
}