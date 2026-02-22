import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthservicesService {

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(environment.serverUrl + 'login/', { username, password })
      .pipe(
        tap(res => {
          localStorage.setItem('auth_token', res.token); 
        }),
        catchError((error) => {
          console.error('Error de autenticación:', error);
          throw error;
        })
      );
  }

  register(data: any): Observable<any> {
    return this.http.post(environment.serverUrl + 'login/register', data);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

 getUserData(): { userId: number; role: string; username: string } | null {
  const token = this.getToken();
  if (!token) return null;

  const payload = token.split('.')[1];
  const decoded = JSON.parse(atob(payload));

  return {
    userId: decoded.userId,
    role: decoded.role,
    username: decoded.username,
  };
}

  logout(): void {
    localStorage.removeItem('auth_token');
  }
}