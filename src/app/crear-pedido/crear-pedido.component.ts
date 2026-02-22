import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core'; // Agregado OnDestroy
import { Pedido } from '../models/pedido';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../models/cliente';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PedidoServiceService } from '../services/pedido-service.service';
import Swal from 'sweetalert2';
import { CargaService } from '../services/carga.service';
import { forkJoin, of, Subscription } from 'rxjs'; 
import { ProductosServiceService } from '../services/productos-service.service';
import { TipoproductoService } from '../services/tipoproducto.service';
import { Producto } from '../models/producto';
import { TipoProducto } from '../models/tipoProducto';
import { LineaDeProducto } from '../models/lineaProducto';
import { AuthservicesService } from '../services/authservices.service'; 
import { BreakpointService } from '../services/breakpoint.service'; 

@Component({
  selector: 'app-crear-pedido',
  templateUrl: './crear-pedido.component.html',
  styleUrl: './crear-pedido.component.css'
})
export class CrearPedidoComponent implements OnInit, OnDestroy {

  @Input() pedido!: Pedido;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  pedidoForm!: FormGroup;
  
  clientes: Cliente[] = [];
  tiposProducto: TipoProducto[] = [];
  
  productosDisponibles: Producto[] = []; 
  productosFiltrados: Producto[] = [];   

  filtroNombre: string = '';
  filtroPrecioMin: number | null = null;
  filtroPrecioMax: number | null = null;
  filtroTipo: TipoProducto | null = null;

  minDateCalendar!: Date;
  fechaOriginalPedido!: Date | null;

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private _clienteService: ClienteService,
    private _productoService: ProductosServiceService,
    private _tipoProductoService: TipoproductoService,
    private cargaService: CargaService,
    private _pedidoService: PedidoServiceService,
    private authService: AuthservicesService,
    private breakpointService: BreakpointService
  ) {}

  esAdmin(): boolean {
    return this.authService.getUserData()?.role === 'admin';
  }

  ngOnInit(): void {
    this.cargaService.show();

    this.resizeSub = this.breakpointService.isMobile$.subscribe({
      next: (mobile) => {
        this.isMobile = mobile;
      }
    });

    this.pedidoForm = new FormGroup({
      nroPedido: new FormControl(''),
      cliente: new FormControl(null, [Validators.required]),
      fecha: new FormControl(new Date(), [Validators.required]),
      total: new FormControl(0)
    });

    let clientesObservable;
    
    if (this.esAdmin()) {
        clientesObservable = this._clienteService.getClientesActivos();
    } else {
        clientesObservable = this._clienteService.getMiPerfil();
    }

    forkJoin({
      clientesData: clientesObservable,
      productos: this._productoService.getAll(),
      tipos: this._tipoProductoService.getTiposDeProductoActivos()
    }).subscribe({
      next: (res: any) => {
        
        if (this.esAdmin()) {
            const lista = res.clientesData.data || res.clientesData;
            this.clientes = lista.filter((c: Cliente) => c.disponible === true);
        } else {
            const miPerfil = res.clientesData.data || res.clientesData;
            this.clientes = [miPerfil]; 
            this.pedidoForm.patchValue({ cliente: miPerfil });
            this.pedidoForm.get('cliente')?.disable();
        }

        this.tiposProducto = res.tipos.data || res.tipos;
        this.productosDisponibles = res.productos.data || res.productos || res.productos;
        
        if (this.pedido) {
          if(!this.pedido.lineas) { this.pedido.lineas = []; }
          
          this.pedido.lineas.forEach(linea => {
            const prodId = (linea.producto as any).codigo || (linea.producto as any).id || linea.producto;
            const productoCompleto = this.productosDisponibles.find(p => p.codigo == prodId);
            if (productoCompleto) {
                linea.producto = productoCompleto;
            }
          });
          
          this.configurarEdicion();
        } else {
          this.pedido = new Pedido();
          this.pedido.lineas = [];
          this.pedido.total = 0;
          this.fechaOriginalPedido = null;
          this.minDateCalendar = new Date();
          
          if (!this.esAdmin()) {
             this.pedidoForm.patchValue({ fecha: new Date() });
          } 
        }

        this.aplicarFiltros();
        this.cargaService.hide();
      },
      error: (err) => {
        console.error(err);
        this.cargaService.hide();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

  get clienteControlValue() {
      return this.pedidoForm.getRawValue().cliente;
  }

  configurarEdicion() {
    this.pedidoForm.patchValue({
      nroPedido: this.pedido.nroPedido,
      total: this.pedido.total
    });

    if (this.pedido.cliente) {
        if (this.esAdmin()) {
            const clienteEnLista = this.clientes.find(c => c.id === this.pedido.cliente.id);
            this.pedidoForm.controls['cliente'].setValue(clienteEnLista || this.pedido.cliente);
        } else {
            this.pedidoForm.controls['cliente'].setValue(this.pedido.cliente);
            this.pedidoForm.controls['cliente'].disable();
        }
    }

    if (this.pedido.fecha) {
      const fecha = new Date(this.pedido.fecha);
      this.fechaOriginalPedido = fecha;
      this.pedidoForm.controls['fecha'].setValue(fecha);
      
      const hoy = new Date();
      hoy.setHours(0,0,0,0);
      const fechaOriginalSoloFecha = new Date(fecha);
      fechaOriginalSoloFecha.setHours(0,0,0,0);

      this.minDateCalendar = fechaOriginalSoloFecha < hoy ? fechaOriginalSoloFecha : hoy;
    }
  }

  agregar(producto: Producto) {
    let lineaProd = new LineaDeProducto();
    lineaProd.cantidad = 1;
    lineaProd.producto = producto;
    lineaProd.subtotal = producto.precio;

    let encontro = false;

    if (this.pedido.lineas.length > 0) {
      this.pedido.lineas.forEach((linea) => {
        if (linea.producto.codigo == producto.codigo) {
          encontro = true;
          linea.cantidad++;
          linea.subtotal += producto.precio;
          this.pedido.total += linea.producto.precio;
        }
      });
    }

    if (!encontro) {
      this.pedido.lineas.push(lineaProd);
      this.pedido.total += lineaProd.producto.precio;
    }
  }

  restar(producto: Producto) {
    let index = this.pedido.lineas.findIndex(linea => linea.producto.codigo == producto.codigo);

    if (index !== -1) {
      let linea = this.pedido.lineas[index];

      if (linea.cantidad > 1) {
        linea.cantidad--;
        linea.subtotal -= producto.precio;
        this.pedido.total -= producto.precio;
      } else {
        this.eliminar(producto);
      }
    }
  }

  eliminar(producto: Producto) {
    const lineaABorrar = this.pedido.lineas.find(l => l.producto.codigo == producto.codigo);
    if(lineaABorrar) {
        this.pedido.total -= lineaABorrar.subtotal;
    }
    this.pedido.lineas = this.pedido.lineas.filter(linea => linea.producto.codigo != producto.codigo);
  }

  getCantidadEnPedido(prod: Producto): number {
    if(!this.pedido || !this.pedido.lineas) return 0;
    
    const linea = this.pedido.lineas.find(l => l.producto && l.producto.codigo == prod.codigo);
    
    return linea ? linea.cantidad : 0;
  }

  aplicarFiltros() {
    this.productosFiltrados = this.productosDisponibles.filter(prod => {
      const coincideNombre = this.filtroNombre ? 
        prod.descripcion.toLowerCase().includes(this.filtroNombre.toLowerCase()) : true;
      
      const coincideMin = this.filtroPrecioMin ? prod.precio >= this.filtroPrecioMin : true;
      const coincideMax = this.filtroPrecioMax ? prod.precio <= this.filtroPrecioMax : true;

      const coincideTipo = this.filtroTipo ? 
        prod.tipoProducto.id === this.filtroTipo.id : true;

      return coincideNombre && coincideMin && coincideMax && coincideTipo;
    });
  }

  atras() {
    this.editCrear.emit(false);
  }

  guardarPedido() {
    if (this.pedidoForm.invalid) {
      Swal.fire({ title: "Error", text: "Complete Cliente y Fecha", icon: "warning" });
      return;
    }

    const fechaForm = this.pedidoForm.get('fecha')?.value;
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fechaElegida = new Date(fechaForm);
    fechaElegida.setHours(0,0,0,0);

    if (this.pedido.nroPedido && this.fechaOriginalPedido) {
       const original = new Date(this.fechaOriginalPedido);
       original.setHours(0,0,0,0);
       if (fechaElegida.getTime() !== original.getTime() && fechaElegida < hoy) {
          Swal.fire({ title: "Error", text: "Fecha inválida", icon: "warning" });
          return;
       }
    } else {
       if (fechaElegida < hoy) {
          Swal.fire({ title: "Error", text: "La fecha no puede ser menor a hoy", icon: "warning" });
          return;
       }
    }

    if (this.pedido.lineas.length === 0) {
      Swal.fire({ title: "Atención", text: "El pedido debe tener al menos un producto", icon: "warning" });
      return;
    }

    const pedidoAGuardar = {
      ...this.pedidoForm.getRawValue(), 
      total: this.pedido.total,
      lineas: this.pedido.lineas
    };

    if (this.pedido.nroPedido) {
      this.cargaService.show();
      pedidoAGuardar.nroPedido = this.pedido.nroPedido; 
      
      this._pedidoService.editar(pedidoAGuardar).subscribe({
        next: () => {
          this.cargaService.hide();
          Swal.fire({ title: "Pedido guardado", icon: "success" });
          this.editCrear.emit(true);
        },
        error: (err) => {
          this.cargaService.hide();
          console.error(err);
          Swal.fire({ title: "Error", text: "No se pudo actualizar", icon: "error" });
        }
      });
    } else {
      this.cargaService.show();
      this._pedidoService.guardar(pedidoAGuardar).subscribe({
        next: () => {
          this.cargaService.hide();
          Swal.fire({ title: "Pedido creado", icon: "success" });
          this.editCrear.emit(true);
        },
        error: (err) => {
          this.cargaService.hide();
          console.error(err);
          Swal.fire({ title: "Error", text: "No se pudo crear", icon: "error" });
        }
      });
    }
  }
}