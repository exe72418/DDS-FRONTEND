import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  
  private readonly BREAKPOINT_WIDTH = 768;
  
  private isMobileSubject = new BehaviorSubject<boolean>(false);
  public isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
    this.checkWidth();
    this.initListener();
  }

  private initListener() {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(200), 
        map(() => window.innerWidth < this.BREAKPOINT_WIDTH),
        distinctUntilChanged() 
      )
      .subscribe((isMobile) => {
        this.isMobileSubject.next(isMobile);
      });
  }

  private checkWidth() {
    const isMobile = window.innerWidth < this.BREAKPOINT_WIDTH;
    this.isMobileSubject.next(isMobile);
  }
}