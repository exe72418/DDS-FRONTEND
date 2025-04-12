import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargaService {

  private _carga = new BehaviorSubject<boolean>(false);
  carga$ = this._carga.asObservable();

  show() {
    this._carga.next(true);
  }

  hide() {
    this._carga.next(false);
  }
}
