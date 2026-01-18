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
        this.zonas = result.zonas.data || result.zonas;

        this.todosLosRepartidores = result.repartidores.data || result.repartidores;

        const pedidosSinEntrega = result.pedidos.data || result.pedidos;

        const mapaPedidos = new Map<number, Pedido>();

        pedidosSinEntrega.forEach((p: Pedido) => {
          if (p.nroPedido) mapaPedidos.set(p.nroPedido, p);
        });

        if (this.entrega && this.entrega.pedidos) {
          this.entrega.pedidos.forEach((p: Pedido) => {
            if (p.nroPedido) {

              if (typeof p.cliente === 'number') {
                const clienteId = p.cliente;
                p.cliente = {
                  id: clienteId,
                  zona: this.entrega!.zona
                } as any;
              }
              else if (!p.cliente) {
                p.cliente = { zona: this.entrega!.zona } as any;
              }
              else if (typeof p.cliente === 'object' && !(p.cliente as any).zona) {
                (p.cliente as any).zona = this.entrega!.zona;
              }

              mapaPedidos.set(p.nroPedido, p);
            }
          });
        }

        this.todosLosPedidos = Array.from(mapaPedidos.values());

        if (this.entrega) {
          this.configurarModoEdicion();
        } else {
          this.entregaForm.reset();
          this.repartidoresFiltrados = [];
          this.pedidosFiltrados = [];
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
    this.entrega!.fecha = new Date(this.entrega!.fecha as any);

    if (this.entrega!.zona) {
      const zonaSeleccionada = this.zonas.find(z => z.id === this.entrega!.zona.id!);

      this.filtrarPorZona(zonaSeleccionada || this.entrega!.zona, false);

      this.entregaForm.get('zona')?.setValue(zonaSeleccionada || this.entrega!.zona);
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
      rep => rep.zona && rep.zona.id === zona.id
    );

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
