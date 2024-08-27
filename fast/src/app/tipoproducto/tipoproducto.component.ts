import { Component, OnInit } from '@angular/core';
import { TipoproductoService } from '../services/tipoproducto.service';
import { TipoProducto } from '../models/tipoProducto';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-tipoproducto',
  standalone: true,
  imports: [MatTable, MatTableModule, CommonModule, TableModule],
  templateUrl: './tipoproducto.component.html',
  styleUrl: './tipoproducto.component.css'
})



export class TipoproductoComponent implements OnInit {

  displayedColumns: string[] = ['nombre'];
    
  constructor(private tipoproductoService : TipoproductoService){}

  tiposProducto: TipoProducto[] = [];

  
  ELEMENT_DATA: TipoProducto[] = [
    {id: 1 ,  productos : [] ,nombre: 'Electrodomesticos'}
  ];

  ngOnInit(): void {
    this.tipoproductoService.getAll().subscribe((data:any)=>{
      console.log(data);
      this.tiposProducto =data['data'].map((tipoprod: TipoProducto) => {
        const tipoProductoFormateado: TipoProducto = {
          id: tipoprod.id,
          nombre: tipoprod.nombre,
          productos: tipoprod.productos,
        };
        return tipoProductoFormateado;
      });
    })
  }

}
