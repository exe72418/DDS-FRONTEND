import { Component, OnInit } from '@angular/core';
import { Zona } from '../../models/zona';
import { ZonaService } from '../../services/zona.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CrearZonasComponent } from "../crear-zonas/crear-zonas.component"; 
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.css']
})
export class ZonasComponent implements OnInit {
  crearEditarMode: boolean = false;
  zonaSelected!: Zona; 
  zonaForm!: FormGroup;
  zonas: Zona[] = [];

  constructor(private zonaService: ZonaService, private cargaService: CargaService) { }

  ngOnInit(): void {
    this.zonaForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
    })
    this.search();
  }

  search() {
    this.cargaService.show();
    this.zonaService.getAll().subscribe((data: any) => {
      this.zonas = data['data'].map((zona: Zona) => {
        const zonaFormateada: Zona = {
          id: zona.id,
          nombre: zona.nombre,
          descripcion: zona.descripcion,
          disponible: zona.disponible
        };
        return zonaFormateada;
      });
      this.cargaService.hide();
    }, error => {
      this.cargaService.hide();
      console.error(error);
    })
  }

  changeEditCreate() {
    this.crearEditarMode = false;
    this.search(); 
  }

  new() {
    this.crearEditarMode = true;
    this.zonaSelected = null!; 
  }

  editZona(zona: Zona) {
    this.crearEditarMode = true;
    this.zonaSelected = zona;
  }

  deleteZona(zona: Zona) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Deseas dar de baja la zona: ' + zona.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, dar de baja!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        
        this.zonaService.delete(zona.id!).subscribe(() => {
          this.cargaService.hide();
          Swal.fire(
            'Eliminado',
            'La zona ha sido dada de baja.',
            'success'
          );
          this.search();
        }, (error) => {
          this.cargaService.hide();
          Swal.fire({
            title: "Error",
            text: 'Error al dar de baja la zona',
            icon: "error"
          });
        });
      }
    });
  }
}