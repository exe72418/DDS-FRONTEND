import { Component, OnInit } from '@angular/core';
import { RepartidorService } from '../../services/repartidor.service';
import { Repartidor } from '../../models/repartidor';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import Swal from 'sweetalert2';
import { CardModule } from 'primeng/card';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CrearRepartidoresComponent } from "../crear-repartidores/crear-repartidores.component";
import { CustomComponentsModule } from '../../modules/custom-components.module';

@Component({
  selector: 'app-repartidor',
  templateUrl: './repartidor.component.html',
  styleUrl: './repartidor.component.css'
})
export class RepartidorComponent implements OnInit {

  crearEditarMode: boolean = false;
  repartidorSelected!: Repartidor;
  repartidorForm!: FormGroup;

  constructor(private repartidorService: RepartidorService) { }

  repartidores: Repartidor[] = [];

  ngOnInit(): void {
    this.repartidorForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      cuit: new FormControl('', [Validators.required]),
      apellidoNombre: new FormControl('', [Validators.required]),
      vehiculo: new FormControl('', [Validators.required]),
      zona: new FormControl('', [Validators.required]),
    })
    this.search();

  }
  search() {
    this.repartidorService.getAll().subscribe((data: any) => {
      this.repartidores = data['data'].map((repartidor: Repartidor) => {
        const repartidorFormateado: Repartidor = {
          id: repartidor.id,
          cuit: repartidor.cuit,
          apellidoNombre: repartidor.apellidoNombre,
          vehiculo: repartidor.vehiculo,
          zona: repartidor.zona,
        };
        return repartidorFormateado;
      });
    })
  }

  changeEditCreate() {
    this.crearEditarMode = false
    this.search();
  }

  new() {
    this.crearEditarMode = true;
  }

  editRepartidor(repartidor: Repartidor) {
    this.crearEditarMode = true;
    this.repartidorSelected = repartidor;

  }

  deleteRepartidor(repartidor: Repartidor) {
    Swal.fire({
      title: "Atencion?",
      text: "Deseas borrar el repartidor " + repartidor.apellidoNombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this.repartidorService.delete(repartidor.id).subscribe(() => {
          Swal.fire({
            title: "Repartidor borrado",
            text: "",
            icon: "success"
          });
          this.search();
        }, (error) => {
          Swal.fire({
            title: "Repartidor no se borro",
            text: error.message,
            icon: "error"
          });
        })
      }
    });
  }

}
