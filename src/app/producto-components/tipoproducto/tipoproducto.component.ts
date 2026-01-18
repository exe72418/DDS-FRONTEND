import { Component, OnInit } from '@angular/core';
import { TipoproductoService } from '../../services/tipoproducto.service';
import { TipoProducto } from '../../models/tipoProducto';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CargaService } from '../../services/carga.service';

@Component({
  selector: 'app-tipoproducto',
  templateUrl: './tipoproducto.component.html',
  styleUrl: './tipoproducto.component.css'
})
export class TipoproductoComponent implements OnInit {

  crearEditarMode: boolean = false;

  tipoProdSelected: TipoProducto | null = null;

  tipoProdForm!: FormGroup;
  tiposProducto: TipoProducto[] = [];

  constructor(
    private tipoproductoService: TipoproductoService,
    private cargaService: CargaService
  ) {}

  ngOnInit(): void {
    this.tipoProdForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
    });
    this.search();
  }

  search() {
    this.cargaService.show();
    this.tipoproductoService.getAll().subscribe({
      next: (data: any) => {
        this.tiposProducto = data['data'].map((tipoprod: TipoProducto) => ({
          id: tipoprod.id,
          nombre: tipoprod.nombre,
          disponible: tipoprod.disponible
        }));
      },
      error: (err) => {
        console.error(err);
        this.cargaService.hide();
      },
      complete: () => {
        this.cargaService.hide();
      }
    });
  }


  changeEditCreate() {
    this.crearEditarMode = false;
    this.tipoProdSelected = null; 
    this.search();
  }


  new() {
    this.tipoProdSelected = null; 
    this.crearEditarMode = true;
  }

  
  editProduct(tipoprod: TipoProducto) {
    this.tipoProdSelected = tipoprod;
    this.crearEditarMode = true;
  }

  deleteProduct(tipoprod: TipoProducto) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Deseas dar de baja el tipo de producto ' + tipoprod.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, Dar de baja!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        this.tipoproductoService.delete(tipoprod.id).subscribe(() => {
          this.cargaService.hide();
          Swal.fire(
            'Eliminado',
            'El tipo de producto ha sido dado de baja.',
            'success'
          );
          this.search();
        }, () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Error",
            text: 'Error al dar de baja el tipo de producto',
            icon: "error"
          });
        });
      }
    });
  }
}
