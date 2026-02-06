import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  getMiPerfil(): Observable<Cliente> {
    return this.httpClient.get<any>(environment.serverUrl + 'clientes/me')
      .pipe(map(response => response.data));
  }

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any> {
    return this.httpClient.get<any>(environment.serverUrl + 'clientes');
  }

  getClientesActivos() {
  return this.httpClient.get<any>(environment.serverUrl + 'clientes/activos');
}


  delete(idCliente: number): Observable<void> {
    return this.httpClient.delete<void>(environment.serverUrl + 'clientes/' + idCliente);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.put<Cliente>(environment.serverUrl + 'clientes/' + cliente.id, cliente);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(environment.serverUrl + 'clientes', cliente);
  }
}
