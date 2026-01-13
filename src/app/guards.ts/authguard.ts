import { Injectable } from "@angular/core";
import { AuthservicesService } from "../services/authservices.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class AuthGuard {
  
    constructor(
      private authService: AuthservicesService,
    ) { }
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  
  
      if (!this.authService.isAuthenticated()) {
        console.log('no esta logueado')
        this.authService.logout();
        return false
      } else {
        return this.authService.isAuthenticated();
      }
  
    }
  
  
  
    // async canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    // const isAuthenticated = this.store.selectSnapshot(AuthState.isAuthenticated);
  
  
    // }
  }