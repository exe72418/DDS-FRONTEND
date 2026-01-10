import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NgModule } from "@angular/core";
import { NGXS_PLUGINS } from '@ngxs/store';
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTable, MatTableModule } from "@angular/material/table";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from 'primeng/dropdown';
import { NgxsModule } from '@ngxs/store';
import { AppComponent } from "../app.component";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from "../app.routes";
import { ClientesComponent } from "../cliente-components/clientes/clientes.component";
import { TipoproductoComponent } from "../producto-components/tipoproducto/tipoproducto.component";
import { ProductosComponent } from "../producto-components/productos/productos.component";
import { RepartidorComponent } from "../repartidor-components/repartidor/repartidor.component";
import { TipopagoComponent } from "../pago-components/tipopago/tipopago.component";
import { CrearTipoPagoComponent } from "../pago-components/crear-tipopago/crear-tipopago.component";
import { ZonasComponent } from "../zona/zonas/zonas.component";
import { CrearZonasComponent } from "../zona/crear-zonas/crear-zonas.component";
import { CrearClientesComponent } from "../cliente-components/crear-clientes/crear-clientes.component";
import { CrearProductosComponent } from "../producto-components/crear-productos/crear-productos.component";
import { CrearRepartidoresComponent } from "../repartidor-components/crear-repartidores/crear-repartidores.component";
import { CrearTipoProdComponent } from "../producto-components/crear-tipo-prod/crear-tipo-prod.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponentComponent } from "../home-component/home-component.component";
import { CarritoComponent } from "../carrito/carrito.component";
import { PedidosComponent } from "../pedidos/pedidos.component";
import { MultiSelectModule } from 'primeng/multiselect';
import { PedidoState } from "../states/pedido.state";
import { EntregaComponent } from '../entrega-components/entrega/entrega.component';
import { CrearEntregaComponent } from '../entrega-components/crear-entrega/crear-entrega.component';
import { PagoComponent } from '../pago-components/pago/pago.component';
import { CrearPagoComponent } from '../pago-components/crear-pago/crear-pago.component';
import { CrearPedidoComponent } from "../crear-pedido/crear-pedido.component";
import { CalendarModule } from "primeng/calendar";
import { LoginComponent } from "../login/login.component";
import { CargaComponent } from '../carga/carga/carga.component.js';


@Injectable({
    providedIn: 'root'
})
@NgModule({
    declarations: [AppComponent,
        HomeComponentComponent,
        ClientesComponent,
        TipoproductoComponent,
        ProductosComponent,
        RepartidorComponent,
        PagoComponent,
        CrearPagoComponent,
        TipopagoComponent,
        CrearTipoPagoComponent,
        CrearClientesComponent,
        EntregaComponent,
        CrearEntregaComponent,
        CrearProductosComponent,
        CrearRepartidoresComponent,
        CrearTipoProdComponent,
        CarritoComponent,
        PedidosComponent,
        CrearPedidoComponent,
        LoginComponent,
        CargaComponent,
        ZonasComponent,
        CrearZonasComponent
    ],
    imports: [
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
        MultiSelectModule,
        DropdownModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        CalendarModule,
        FormsModule
    ],
    exports: [
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
        CrearPedidoComponent,
        CalendarModule,
        FormsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]

})
export class CustomComponentsModule { }
