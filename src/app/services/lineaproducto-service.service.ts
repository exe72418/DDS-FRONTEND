import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { LineaDeProducto } from '../models/lineaProducto';
import { Pedido } from '../models/pedido';

@Injectable({
  providedIn: 'root'
})
export class LineaProductoService {


  constructor(private http: HttpClient) { }


  getLineasByPedidoId(pedidoId: number): Observable<LineaDeProducto[]> {
    return this.http.get<any>(environment.serverUrl + 'lineasDeProducto/pedido/' + pedidoId)
      .pipe(
        map((response) => response.data)
      );
  }
}
