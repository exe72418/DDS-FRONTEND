import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseUrl = "http://localhost:3000/api/v2/clientes";

  constructor(private http: HttpClient) { }

  get(id: number): Observable<Cliente> {
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }

  getAllClients(): Observable<any> {
    return this.http.get<any>(this.baseUrl)
  }

  createClient(data: Cliente): Observable<Cliente> {
    return this.http.post<any>(this.baseUrl, data)
  }

  updateClient(data: Cliente): Observable<Cliente> {
    return this.http.put<any>(`${this.baseUrl}`, data)
  }

  deleteClient(id: any): Observable<Cliente> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`)
  }
}
