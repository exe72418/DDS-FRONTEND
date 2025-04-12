import { Component, OnInit } from '@angular/core';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrl: './carga.component.css'
})
export class CargaComponent implements OnInit {
  estacargando = false;
  constructor(public cargaService: CargaService) { }

  ngOnInit(): void {
    this.cargaService.carga$.subscribe(value => {
      this.estacargando = value;
    });
  }

}
