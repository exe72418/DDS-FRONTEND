import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core'; 
import { TipopagoService } from '../../services/tipopago.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoPago } from '../../models/tipopago';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';
import { BreakpointService } from '../../services/breakpoint.service'; 
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-crear-tipopago',
  templateUrl: './crear-tipopago.component.html',
  styleUrls: ['./crear-tipopago.component.css']
})
export class CrearTipoPagoComponent implements OnInit, OnDestroy {

  @Input() tipoPago: TipoPago | null = null;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  tipoPagoForm: FormGroup;

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private tipopagoService: TipopagoService, 
    private cargaService: CargaService,
    private breakpointService: BreakpointService 
  ) {
    this.tipoPagoForm = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.resizeSub = this.breakpointService.isMobile$.subscribe({
      next: (mobile) => {
        this.isMobile = mobile;
      }
    });

    if (this.tipoPago?.id) {
      this.tipoPagoForm.patchValue(this.tipoPago);
    } else {
      this.tipoPagoForm.reset();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }
  }

  atras() {
    this.editCrear.emit(false);
  }

  guardar(tipoPago: TipoPago) {
    if (!this.tipoPagoForm.valid) {
      Swal.fire({
        title: "Error",
        text: 'Formulario inválido. Verifique los datos ingresados.',
        icon: "error"
      });
      return;
    }

    const esEdicion = !!this.tipoPago && !!this.tipoPago.id;

    this.cargaService.show();

    if (!esEdicion) {
      tipoPago.id = 0;
      this.tipopagoService.create(tipoPago).subscribe({
        next: () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Guardado",
            text: 'Tipo de pago creado',
            icon: "success"
          });
          this.editCrear.emit(false);
        },
        error: (error) => {
          this.cargaService.hide();
          console.error('Error al crear el tipo de pago:', error);
          Swal.fire({
            title: "Error",
            text: 'Error al crear el tipo de pago',
            icon: "error"
          });
        }
      });
    } else {
      this.tipopagoService.update(tipoPago).subscribe({
        next: () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Guardado",
            text: 'Tipo de pago actualizado',
            icon: "success"
          });
          this.editCrear.emit(false);
        },
        error: (error) => {
          this.cargaService.hide();
          console.error('Error al modificar el tipo de pago:', error);
          Swal.fire({
            title: "Error",
            text: 'Error al modificar el tipo de pago',
            icon: "error"
          });
        }
      });
    }
  }
}