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

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Pago[]> {
    return this.httpClient.get<Pago[]>(environment.serverUrl + 'pago')
      .pipe(
        map((response: any) => response.pagos))
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
    console.log('yendo a buscar los pedidos sin pago')
    return this.httpClient.get<Pedido[]>(environment.serverUrl + 'pedido/pedidos/impagos/');
  }

}
