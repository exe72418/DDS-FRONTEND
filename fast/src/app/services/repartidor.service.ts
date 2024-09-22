import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Repartidor } from '../models/repartidor';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepartidorService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Repartidor[]> {
    console.log('yendo a buscar los tipos de productos')
    return this.httpClient.get<Repartidor[]>(environment.serverUrl + 'repartidores/');
  }
  delete(idRepartidor: number): Observable<void> {
    return this.httpClient.delete<void>(environment.serverUrl + 'repartidores/' + idRepartidor);
  }
  update(repartidor: Repartidor): Observable<Repartidor> {
    return this.httpClient.put<Repartidor>(environment.serverUrl + 'repartidores/' + repartidor.id, repartidor)
  }
  create(repartidor: Repartidor): Observable<Repartidor> {
    return this.httpClient.post<Repartidor>(environment.serverUrl + 'repartidores', repartidor)
  }
}
