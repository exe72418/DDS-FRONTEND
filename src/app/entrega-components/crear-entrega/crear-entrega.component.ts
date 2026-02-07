import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Entrega } from '../../models/entrega';
import { Pedido } from '../../models/pedido';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RepartidorService } from '../../services/repartidor.service';
import { Repartidor } from '../../models/repartidor';
import { EntregaService } from '../../services/entrega.service';
import { Zona } from '../../models/zona';
import { ZonaService } from '../../services/zona.service';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';
import { forkJoin, Observable,of } from 'rxjs';
import { AuthservicesService } from '../../services/authservices.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-crear-entrega',
  templateUrl: './crear-entrega.component.html',
  styleUrl: './crear-entrega.component.css'
})
export class CrearEntregaComponent implements OnInit {
  @Input() entrega: Entrega | null = null;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  entregaForm!: FormGroup;

  zonas: Zona[] = [];
  todosLosRepartidores: Repartidor[] = [];
  todosLosPedidos: Pedido[] = [];

  repartidoresFiltrados: Repartidor[] = [];
  pedidosFiltrados: Pedido[] = [];

  constructor(
    private repartidorService: RepartidorService,
    private cargaService: CargaService,
    private _entregaService: EntregaService,
    private zonaService: ZonaService,
    private authService: AuthservicesService,
    private clienteService: ClienteService
  ) {
    this.entregaForm = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl('', [Validators.required]),
      zona: new FormControl(null, [Validators.required]),
      repartidor: new FormControl(null, [Validators.required]),
      pedidos: new FormControl([])
    });
  }

  get zonaFormValue() {
    return this.entregaForm.getRawValue().zona;
  }

  isAdmin(): boolean {
    return this.authService.getUserData()?.role === 'admin';
  }

  ngOnInit(): void {
    this.cargaService.show();

    let pedidosObservable;
    if (this.isAdmin()) {
        pedidosObservable = this._entregaService.getPedidosPagosSinEntrega();
    } else {
        pedidosObservable = this._entregaService.getMisPedidosParaEntrega();
    }

    forkJoin({
      zonas: this.zonaService.getZonasActivas(),
      repartidores: this.repartidorService.getRepartidoresActivos(),
      pedidos: pedidosObservable,
      miPerfil: !this.isAdmin() ? this.clienteService.getMiPerfil() : of(null)
    }).subscribe({
      next: (result: any) => {
        this.zonas = result.zonas.data || result.zonas;
        this.todosLosRepartidores = result.repartidores.data || result.repartidores;

        const pedidosSinEntrega = result.pedidos.data || result.pedidos;
        const mapaPedidos = new Map<number, Pedido>();

        // CORRECCIÓN: Normalizamos los pedidos AQUÍ, para todos los casos (Crear y Editar)
        pedidosSinEntrega.forEach((p: Pedido) => {
          if (p.nroPedido) {
             this.normalizarPedido(p); // <--- Helper para asegurar estructura
             mapaPedidos.set(p.nroPedido, p);
          }
        });

        // AUTORRELLENADO PARA CLIENTE
        if (!this.isAdmin() && result.miPerfil) {
            const miZona = result.miPerfil.zona;
            if (miZona) {
                const zonaEnLista = this.zonas.find(z => z.id === miZona.id);
                if (zonaEnLista) {
                    this.entregaForm.patchValue({ zona: zonaEnLista });
                    
                    // Como el pedido ya está normalizado (tiene zona), esto funcionará:
                    this.todosLosPedidos = Array.from(mapaPedidos.values()); 
                    
                    this.filtrarPorZona(zonaEnLista); 
                    this.entregaForm.get('zona')?.disable();
                }
            }
        }

        // MODO EDICIÓN
        if (this.entrega && this.entrega.pedidos) {
          this.entrega.pedidos.forEach((p: Pedido) => {
            if (p.nroPedido) {
              this.normalizarPedido(p); // Aseguramos también los que vienen en la entrega
              mapaPedidos.set(p.nroPedido, p);
            }
          });
        }

        this.todosLosPedidos = Array.from(mapaPedidos.values());

        if (this.entrega) {
          this.configurarModoEdicion();
        } else {
          if(!this.entregaForm.get('fecha')?.value) {
             this.entregaForm.patchValue({ fecha: new Date() });
          }
          // Si ya filtramos arriba (caso cliente), no hace falta ocultar nada.
          // Si es admin y no eligió zona, limpiamos:
          if (this.isAdmin() && !this.entregaForm.get('zona')?.value) {
             this.repartidoresFiltrados = [];
             this.pedidosFiltrados = [];
          }
          this.cargaService.hide();
        }
      },
      error: (err) => {
        console.error(err);
        this.cargaService.hide();
      }
    });
  }

  // --- Helper nuevo para arreglar datos incompletos ---
  normalizarPedido(p: Pedido) {
      // 1. Si cliente no existe o es solo ID
      if (!p.cliente || typeof p.cliente === 'number') {
          // Intentamos salvarlo si tenemos zona elegida, sino quedará incompleto
          // (Generalmente el populate del backend debería evitar esto)
           return; 
      }
      
      // 2. Si cliente existe pero su zona es solo un ID o falta
      if (p.cliente && typeof p.cliente === 'object') {
          const clienteAny = p.cliente as any;
          
          // A veces viene zona: 4 (number) en lugar de zona: {id: 4}
          if (typeof clienteAny.zona === 'number') {
              const zonaId = clienteAny.zona;
              clienteAny.zona = { id: zonaId, nombre: 'Zona ' + zonaId }; // Mock para que pase el filtro
          }
      }
  }

  configurarModoEdicion() {
    this.entrega!.fecha = new Date(this.entrega!.fecha as any);

    if (this.entrega!.zona) {
      const zonaSeleccionada = this.zonas.find(z => z.id === this.entrega!.zona.id!);
      
      this.filtrarPorZona(zonaSeleccionada || this.entrega!.zona, false);
      
      this.entregaForm.get('zona')?.setValue(zonaSeleccionada || this.entrega!.zona);
      
      if (!this.isAdmin()) {
          this.entregaForm.get('zona')?.disable();
      }
    }

    const repartidorEnLista = this.repartidoresFiltrados.find(r => r.id === this.entrega!.repartidor.id!);

    const pedidosSeleccionados: Pedido[] = [];
    if (this.entrega!.pedidos && this.entrega!.pedidos.length > 0) {
      this.entrega!.pedidos.forEach(pEntrega => {
        const encontrado = this.pedidosFiltrados.find(pOpcion => pOpcion.nroPedido == pEntrega.nroPedido);
        if (encontrado) {
          pedidosSeleccionados.push(encontrado);
        }
      });
    }

    this.entregaForm.patchValue({
      id: this.entrega!.id,
      fecha: this.entrega!.fecha,
      repartidor: repartidorEnLista,
      pedidos: pedidosSeleccionados
    });

    this.cargaService.hide();
  }

  filtrarPorZona(zona: Zona, limpiarSelecciones: boolean = true) {
    if (!zona) {
      this.repartidoresFiltrados = [];
      this.pedidosFiltrados = [];
      this.entregaForm.patchValue({ repartidor: null, pedidos: [] });
      return;
    }

    this.repartidoresFiltrados = this.todosLosRepartidores.filter(
      rep => rep.zona && (rep.zona.id == zona.id)
    );

    // Filtro robusto: Verifica que exista cliente, zona y coincida ID
    this.pedidosFiltrados = this.todosLosPedidos.filter(ped => {
        if (!ped.cliente) return false;
        
        // Casteo a any para manejar si zona viene rara
        const zonaCliente = (ped.cliente as any).zona; 
        
        // Si zona es objeto {id:...}
        if (zonaCliente && zonaCliente.id) {
            return zonaCliente.id == zona.id;
        }
        
        // Si zona es solo ID (number)
        if (typeof zonaCliente === 'number') {
            return zonaCliente == zona.id;
        }

        return false;
    });

    if (limpiarSelecciones) {
      this.entregaForm.patchValue({
        repartidor: null,
        pedidos: []
      });
    }
  }

  back() {
    this.editCrear.emit(false);
  }

  guardar(formValue: any) {
    if (this.entregaForm.valid) {
      this.cargaService.show();

      const entregaData = this.entregaForm.getRawValue();

      if (this.entrega && this.entrega.id) {
        entregaData.id = this.entrega.id;
        this._entregaService.update(entregaData).subscribe(() => {
          this.cargaService.hide();
          Swal.fire({ title: "Guardado", text: "Entrega actualizada", icon: "success" });
          this.editCrear.emit(false);
        }, error => {
          this.cargaService.hide();
          Swal.fire({ title: "Error", text: error.error.message || 'Error al modificar', icon: "error" });
        });
      } else {
        entregaData.id = 0;
        this._entregaService.save(entregaData).subscribe(() => {
          this.cargaService.hide();
          Swal.fire({ title: "Guardado", text: "Entrega creada", icon: "success" });
          this.editCrear.emit(false);
        }, error => {
          this.cargaService.hide();
          Swal.fire({ title: "Error", text: error.error.message || 'Error al crear', icon: "error" });
        });
      }
    } else {
      Swal.fire({ title: "Error", text: "Formulario inválido", icon: "warning" });
    }
  }
}