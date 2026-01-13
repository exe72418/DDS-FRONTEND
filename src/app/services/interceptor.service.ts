import { HttpHeaders, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(
  ) { }

  armarHttpRequest(req: HttpRequest<any>) {
    return req.clone({
      url: this.setUrlBase(req) + req.url,
      headers: this.setHeader(req.url),
      body: req.body,
      withCredentials: true,
    });
  }

  private setHeader(url: string) {
    const urlSubirAdjuntos = url.includes('archivosadjuntos') && !url.includes('find');
    const urlSubirFicha = url.includes('fichaspacientes') && !url.includes('find');
    const peticionCarpetaAssets = url.includes('assets');
    const peticionForm = url.includes('auth/inicioSesion') || url.includes('oauth/token');
    let headers: HttpHeaders = new HttpHeaders();

    // Seteo header segun la url que se recibe.
    if (urlSubirAdjuntos) {
      headers = headers.append('Accept', 'application/json');
    } else if (urlSubirFicha) {
      headers = headers.append('Accept', 'application/json');
    } else if (peticionCarpetaAssets) {
      headers = headers.append('Accept', 'application/html');
    } else if (peticionForm) {
      headers = headers.append('Content-type', 'application/x-www-form-urlencoded; charset=utf-8').set('Authorization', 'Basic ' + btoa("client:password"));
    } else {
      headers = headers.append('Content-Type', 'application/json; charset=utf-8');
    }

    // Si estoy autenticado agrego el token a la peticion.


    return headers;
  }

  private setUrlBase(url: HttpRequest<any>) {
    const peticionAlBackend: boolean = !url.url.includes('assets');
    return environment.serverUrl
  }

  // private getAccessToken() {
  //   const token = this.store.selectSnapshot(AuthState.token);
  //   return token != null ? token : '';
  // }
}
