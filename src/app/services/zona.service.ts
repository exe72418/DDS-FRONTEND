import { Injectable } from '@angular/core';
import { Zona } from '../models/zona';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Zona[]> {
    return this.httpClient.get<Zona[]>(environment.serverUrl + 'zonas/');
  }

  getZonasActivas(): Observable<Zona[]> {
    return this.httpClient.get<Zona[]>(environment.serverUrl + 'zonas/activos/');
  }

  delete(idZona: number): Observable<void> {
    return this.httpClient.delete<void>(environment.serverUrl + 'zonas/' + idZona);
  }

  update(zona: Zona): Observable<Zona> {
    return this.httpClient.put<Zona>(environment.serverUrl + 'zonas/' + zona.id, zona);
  }

  create(zona: Zona): Observable<Zona> {
    return this.httpClient.post<Zona>(environment.serverUrl + 'zonas', zona);
  }
}