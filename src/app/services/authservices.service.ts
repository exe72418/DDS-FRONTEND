// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthservicesService {

  constructor(private http: HttpClient) {}

  // Método para hacer login y obtener el token
  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(environment.serverUrl + 'login/', { username, password })
      .pipe(
        catchError((error) => {
          console.error('Error de autenticación:', error);
          throw error;
        })
      );
  }

  
  register(data: any) {
  return this.http.post(
    environment.serverUrl + 'login/register',
    data
  );
  }

  // Obtener el token JWT del localStorage
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Verificar si el usuario está autenticado (si hay un token)
  isAuthenticated(): boolean {
    const token = this.getToken();
    // Aquí puedes agregar una lógica extra para verificar la validez del token (por ejemplo, expiración)
    return token !== null;
  }

  getUserData(): { userId: number; role: string } | null {
    const token = this.getToken();
    if (!token) return null;

    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    return {
      userId: decoded.userId,
      role: decoded.role,
    };
  }

  // Método para cerrar sesión (eliminar el token)
  logout(): void {
    console.log('cerrando sesion')
    localStorage.removeItem('auth_token');
  }
}
