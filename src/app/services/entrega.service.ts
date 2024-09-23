import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Entrega } from '../models/entrega';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Entrega[]> {
    return this.httpClient.get<Entrega[]>(environment.serverUrl + 'entregas')
      .pipe(
        map((response: any) => response.entregas))
  }
  update(entrega: Entrega): Observable<Entrega> {
    return this.httpClient.put<Entrega>(environment.serverUrl + 'entregas', entrega)
  }
  save(entrega: Entrega): Observable<Entrega> {
    return this.httpClient.post<Entrega>(environment.serverUrl + 'entregas', entrega)
  }
}
