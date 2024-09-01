import { Component, OnInit } from '@angular/core';
import { TipoproductoService } from '../services/tipoproducto.service';
import { TipoProducto } from '../models/tipoProducto';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-tipoproducto',
  standalone: true,
  imports: [MatTable, MatTableModule, CommonModule, TableModule, ButtonModule],
  templateUrl: './tipoproducto.component.html',
  styleUrl: './tipoproducto.component.css'
})



export class TipoproductoComponent implements OnInit {
deleteProduct(arg0: any) {
throw new Error('Method not implemented.');
}
editProduct(arg0: any) {
throw new Error('Method not implemented.');
}

  displayedColumns: string[] = ['nombre'];
    
  constructor(private tipoproductoService : TipoproductoService){}

  tiposProducto: TipoProducto[] = [];

  ngOnInit(): void {
    this.tipoproductoService.getAll().subscribe((data:any)=>{
      console.log(data);
      this.tiposProducto =data['data'].map((tipoprod: TipoProducto) => {
        const tipoProductoFormateado: TipoProducto = {
          id: tipoprod.id,
          nombre: tipoprod.nombre,
        };
        return tipoProductoFormateado;
      });
    })
  }

}
