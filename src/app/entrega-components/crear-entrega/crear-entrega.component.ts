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
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-crear-entrega',
  templateUrl: './crear-entrega.component.html',
  styleUrl: './crear-entrega.component.css'
})
export class CrearEntregaComponent implements OnInit {
  @Input() entrega!: Entrega;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  entregaForm!: FormGroup;

  // Listas "Maestras"
  zonas: Zona[] = [];
  todosLosRepartidores: Repartidor[] = [];
  todosLosPedidos: Pedido[] = [];

  // Listas "Visibles" (Filtradas)
  repartidoresFiltrados: Repartidor[] = [];
  pedidosFiltrados: Pedido[] = [];

  constructor(
    private repartidorService: RepartidorService, 
    private cargaService: CargaService, 
    private _entregaService: EntregaService,
    private zonaService: ZonaService
  ) {
    this.entregaForm = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl('', [Validators.required]),
      zona: new FormControl(null, [Validators.required]),
      repartidor: new FormControl(null, [Validators.required]),
      pedidos: new FormControl([])
    });
  }

  ngOnInit(): void {
    this.cargaService.show();

    forkJoin({
      zonas: this.zonaService.getZonasActivas(),
      repartidores: this.repartidorService.getRepartidoresActivos(),
      pedidos: this._entregaService.getPedidosPagosSinEntrega()
    }).subscribe({
      next: (result: any) => {
        // 1. Zonas
        this.zonas = result.zonas.data || result.zonas;

        // 2. Repartidores
        this.todosLosRepartidores = result.repartidores.data || result.repartidores;

        // 3. Pedidos (Unificación robusta)
        const pedidosSinEntrega = result.pedidos.data || result.pedidos;
        
        // Mapa para evitar duplicados por ID
        const mapaPedidos = new Map<number, Pedido>();

        // A. Agregamos los pedidos libres (sin entrega)
        pedidosSinEntrega.forEach((p: Pedido) => {
            if(p.nroPedido) mapaPedidos.set(p.nroPedido, p);
        });

        // B. Si estamos editando, agregamos los pedidos de ESTA entrega
        if (this.entrega && this.entrega.pedidos) {
            this.entrega.pedidos.forEach((p: Pedido) => {
                if (p.nroPedido) {
                    
                    // --- CORRECCIÓN AQUÍ: Validar formato de cliente ---
                    
                    // Caso 1: Cliente llega como ID numérico (causa del error)
                    if (typeof p.cliente === 'number') {
                        const clienteId = p.cliente;
                        // Lo convertimos a objeto forzosamente
                        p.cliente = { 
                            id: clienteId, 
                            zona: this.entrega.zona 
                        } as any;
                    } 
                    // Caso 2: Cliente no existe
                    else if (!p.cliente) {
                        p.cliente = { zona: this.entrega.zona } as any;
                    } 
                    // Caso 3: Cliente es objeto pero le falta la zona
                    else if (typeof p.cliente === 'object' && !(p.cliente as any).zona) {
                        (p.cliente as any).zona = this.entrega.zona;
                    }

                    // Ahora es seguro agregarlo al mapa
                    mapaPedidos.set(p.nroPedido, p);
                }
            });
        }

        // Convertimos el mapa a array final
        this.todosLosPedidos = Array.from(mapaPedidos.values());

        // 4. Configurar Edición si corresponde
        if (this.entrega) {
             this.configurarModoEdicion();
        } else {
             this.cargaService.hide();
        }
      },
      error: (err) => {
        console.error(err);
        this.cargaService.hide();
      }
    });
  }

  configurarModoEdicion() {
    this.entrega.fecha = new Date(this.entrega.fecha);
    
    // 1. Zona
    if (this.entrega.zona) {
        // Buscamos la zona en la lista cargada para tener la misma referencia
        const zonaSeleccionada = this.zonas.find(z => z.id === this.entrega.zona.id!);
        
        // Filtramos sin borrar selecciones (false)
        this.filtrarPorZona(zonaSeleccionada || this.entrega.zona, false); 
        
        this.entregaForm.get('zona')?.setValue(zonaSeleccionada);
    }

    // 2. Repartidor
    const repartidorEnLista = this.repartidoresFiltrados.find(r => r.id === this.entrega.repartidor.id!);

    // 3. Pedidos
    // Buscamos los objetos equivalentes en la lista filtrada para que el multiselect los reconozca
    const pedidosSeleccionados: Pedido[] = [];
    
    if (this.entrega.pedidos && this.entrega.pedidos.length > 0) {
        this.entrega.pedidos.forEach(pEntrega => {
            const encontrado = this.pedidosFiltrados.find(pOpcion => pOpcion.nroPedido == pEntrega.nroPedido);
            if (encontrado) {
                pedidosSeleccionados.push(encontrado);
            }
        });
    }

    // 4. Patch completo
    this.entregaForm.patchValue({
      id: this.entrega.id,
      fecha: this.entrega.fecha,
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

    // Filtrar Repartidores
    this.repartidoresFiltrados = this.todosLosRepartidores.filter(
        rep => rep.zona && rep.zona.id === zona.id
    );

    // Filtrar Pedidos
    // Nota: Aquí ya es seguro acceder a p.cliente.zona gracias a la corrección del ngOnInit
    this.pedidosFiltrados = this.todosLosPedidos.filter(
        ped => ped.cliente && ped.cliente.zona && ped.cliente.zona.id === zona.id
    );

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

  guardar(ent: Entrega) {
    if (this.entregaForm.valid) {
      this.cargaService.show();
      
      if (this.entrega && this.entrega.id) {
        // UPDATE
        ent.id = this.entrega.id; 
        this._entregaService.update(ent).subscribe(() => {
            this.cargaService.hide();
            Swal.fire({ title: "Guardado", text: "Entrega actualizada", icon: "success" });
            this.editCrear.emit(false);
        }, error => {
            this.cargaService.hide();
            Swal.fire({ title: "Error", text: error.error.message || 'Error al modificar', icon: "error" });
        });
      } else {
        // CREATE
        ent.id = 0;
        this._entregaService.save(ent).subscribe(() => {
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