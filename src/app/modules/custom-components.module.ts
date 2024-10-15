import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { NGXS_PLUGINS } from '@ngxs/store';
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTable, MatTableModule } from "@angular/material/table";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from 'primeng/dropdown';
import { NgxsModule } from '@ngxs/store';
import { AppComponent } from "../app.component";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Importar HttpClientModule
import { AppRoutingModule } from "../app.routes";
import { ClientesComponent } from "../cliente-components/clientes/clientes.component";
import { TipoproductoComponent } from "../producto-components/tipoproducto/tipoproducto.component";
import { ProductosComponent } from "../producto-components/productos/productos.component";
import { RepartidorComponent } from "../repartidor-components/repartidor/repartidor.component";
import { TipopagoComponent } from "../pago-components/tipopago/tipopago.component";
import { CrearTipoPagoComponent } from "../pago-components/crear-tipopago/crear-tipopago.component";
import { CrearClientesComponent } from "../cliente-components/crear-clientes/crear-clientes.component";
import { CrearProductosComponent } from "../producto-components/crear-productos/crear-productos.component";
import { CrearRepartidoresComponent } from "../repartidor-components/crear-repartidores/crear-repartidores.component";
import { CrearTipoProdComponent } from "../producto-components/crear-tipo-prod/crear-tipo-prod.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponentComponent } from "../../../fast/src/app/home-component/home-component.component";
import { CarritoComponent } from "../../../fast/src/app/carrito/carrito.component";
import { PedidosComponent } from "../../../fast/src/app/pedidos/pedidos.component";
import { PedidoState } from "../../../fast/src/app/states/pedido.state";

@NgModule({
    declarations:[AppComponent,
        HomeComponentComponent,
        ClientesComponent,
        TipoproductoComponent,
        ProductosComponent,
        RepartidorComponent,
        TipopagoComponent,
        CrearTipoPagoComponent,
        CrearClientesComponent,
        CrearProductosComponent,
        CrearRepartidoresComponent,
        CrearTipoProdComponent,
        CarritoComponent,
        PedidosComponent,
    ],
    imports:[
        NgxsModule.forRoot([PedidoState], { developmentMode: true }),
        AppRoutingModule,
        TableModule, 
        InputTextModule,
        CardModule,  
        CommonModule, 
        ReactiveFormsModule,
        MatTable, 
        MatTableModule, 
        CommonModule, 
        ButtonModule, 
        CardModule,
        DropdownModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
    ],
    exports:[
        TableModule,
        InputTextModule,
        CardModule,  
        CommonModule, 
        ReactiveFormsModule,
        MatTable, 
        MatTableModule, 
        CommonModule, 
        ButtonModule, 
        CardModule,
        DropdownModule,
        PedidosComponent,
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]

})
export class CustomComponentsModule{}