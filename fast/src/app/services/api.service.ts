import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private urlClientes = "http://localhost:3000/api/v2/clientes";

  constructor(private http: HttpClient) { }

  public getAllClientes(): Observable<any> {
    return this.http.get<any>(this.urlClientes)
  }
}
