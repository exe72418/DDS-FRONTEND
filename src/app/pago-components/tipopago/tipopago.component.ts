import { TipoPago } from '../../models/tipopago';
import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { TipopagoService } from '../../services/tipopago.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CargaService } from '../../services/carga.service';
import { BreakpointService } from '../../services/breakpoint.service'; 
import { Subscription } from 'rxjs'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipopago',
  templateUrl: './tipopago.component.html',
  styleUrl: './tipopago.component.css'
})
export class TipopagoComponent implements OnInit, OnDestroy {
  crearEditarMode: boolean = false;
  tipoPagoelected: TipoPago | null = null;
  tipoPagoForm!: FormGroup;

  tiposPago: TipoPago[] = [];

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private tipopagoService: TipopagoService, 
    private cargaService: CargaService,
    private breakpointService: BreakpointService 
  ) {}

  ngOnInit(): void {
    this.resizeSub = this.breakpointService.isMobile$.subscribe(mobile => {
      this.isMobile = mobile;
    });

    this.tipoPagoForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
    });
    this.search();
  }

  ngOnDestroy(): void {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

  search() {
    this.cargaService.show();

    this.tipopagoService.getAll().subscribe({
      next: (data: any) => {
        this.tiposPago = data['data'].map((tipopago: TipoPago) => {
          const tipoPagoFormateado: TipoPago = {
            id: tipopago.id,
            nombre: tipopago.nombre,
            descripcion: tipopago.descripcion,
            disponible: tipopago.disponible
          };
          return tipoPagoFormateado;
        });
      },
      error: (error) => {
        console.error('Error al cargar tipos de pago:', error);
        this.cargaService.hide(); 
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los tipos de pago",
          icon: "error"
        });
      },
      complete: () => {
        this.cargaService.hide();
      }
    });
  }

  changeEditCreate() {
    this.crearEditarMode = false;
    this.tipoPagoelected = null;
    this.search();
  }

  new() {
    this.tipoPagoelected = null;
    this.crearEditarMode = true;
  }

  editTipoPago(tipopago: TipoPago) {
    this.tipoPagoelected = tipopago;
    this.crearEditarMode = true;
  }

  deleteTipoPago(tipoPago: TipoPago) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Deseas dar de baja el tipo de pago ' + tipoPago.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, dar de baja!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargaService.show();
        this.tipopagoService.delete(tipoPago.id).subscribe(() => {
          this.cargaService.hide();
          Swal.fire(
            'Eliminado',
            'El tipo de pago ha sido dado de baja.',
            'success'
          );
          this.search();
        }, () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Error",
            text: 'Error al dar de baja el tipo de pago',
            icon: "error"
          });
        });
      }
    });
  }
}