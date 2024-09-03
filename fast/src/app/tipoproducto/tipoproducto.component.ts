import { Component, OnInit } from '@angular/core';
import { TipoproductoService } from '../services/tipoproducto.service';
import { TipoProducto } from '../models/tipoProducto';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import Swal from 'sweetalert2';
import { CardModule } from 'primeng/card';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CrearTipoProdComponent } from "../crear-tipo-prod/crear-tipo-prod.component";
import { CustomComponentsModule } from '../modules/custom-components.module';

@Component({
  selector: 'app-tipoproducto',
  standalone: true,
  imports: [CustomComponentsModule, CrearTipoProdComponent],
  templateUrl: './tipoproducto.component.html',
  styleUrl: './tipoproducto.component.css'
})



export class TipoproductoComponent implements OnInit {


  crearEditarMode: boolean= false;
  tipoProdSelected!: TipoProducto;
  tipoProdForm!: FormGroup;
    
  constructor(private tipoproductoService : TipoproductoService){}

  tiposProducto: TipoProducto[] = [];

  ngOnInit(): void {
    this.tipoProdForm = new FormGroup({
      id:new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
    })
    this.search();
    
  }
  search(){
    this.tipoproductoService.getAll().subscribe((data:any)=>{
      this.tiposProducto =data['data'].map((tipoprod: TipoProducto) => {
        const tipoProductoFormateado: TipoProducto = {
          id: tipoprod.id,
          nombre: tipoprod.nombre,
        };
        return tipoProductoFormateado;
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

  editProduct(tipoprod: TipoProducto) {
      this.crearEditarMode = true;
      this.tipoProdSelected = tipoprod;
      
  }

  deleteProduct(tipoprod: TipoProducto){
    Swal.fire({
      title: "Atencion?",
      text: "Deseas borrar el cliente " + tipoprod.nombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si"
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoproductoService.delete(tipoprod.id).subscribe(()=>{
          Swal.fire({
            title: "Tipo de producto borrado",
            text: "",
            icon: "success"
          });
          this.search();
        },(error)=>{
          Swal.fire({
            title: "Tipo de producto no se borro",
            text: error.message,
            icon: "error"
          });
        })
      }
    });
  }

}
