import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseUrl = "http://localhost:3000/api/v2/clientes";

  constructor(private http: HttpClient) { }

  get(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }

  getAllClients(): Observable<any> {
    return this.http.get<any>(this.baseUrl)
  }

  createClient(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data)
  }

  updateClient(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data)
  }

  deleteClient(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`)
  }
}
