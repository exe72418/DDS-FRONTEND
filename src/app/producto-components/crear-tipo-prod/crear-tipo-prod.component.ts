import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core'; 
import { TipoproductoService } from '../../services/tipoproducto.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoProducto } from '../../models/tipoProducto';
import Swal from 'sweetalert2';
import { CargaService } from '../../services/carga.service';
import { BreakpointService } from '../../services/breakpoint.service'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crear-tipo-prod',
  templateUrl: './crear-tipo-prod.component.html',
  styleUrl: './crear-tipo-prod.component.css'
})
export class CrearTipoProdComponent implements OnInit, OnDestroy {

  @Input() tipoProd: TipoProducto | null = null;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  tipoProdForm: FormGroup;

  isMobile: boolean = false;
  private resizeSub!: Subscription;

  constructor(
    private tipoproductoService: TipoproductoService,
    private cargaService: CargaService,
    private breakpointService: BreakpointService 
  ) {
    this.tipoProdForm = new FormGroup({
      id: new FormControl(''),
      nombre: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.resizeSub = this.breakpointService.isMobile$.subscribe(mobile => {
      this.isMobile = mobile;
    });

    if (this.tipoProd?.id) {
      this.tipoProdForm.patchValue(this.tipoProd);
    } else {
      this.tipoProdForm.reset();
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

  guardar(tipoProducto: TipoProducto) {
    if (!this.tipoProdForm.valid) {
      return;
    }

    const esEdicion = !!this.tipoProd && !!this.tipoProd.id;

    this.cargaService.show();

    if (!esEdicion) {
      tipoProducto.id = 0;
      this.tipoproductoService.create(tipoProducto).subscribe({
        next: () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Guardado",
            text: "Tipo de producto creado",
            icon: "success"
          });
          this.editCrear.emit(false);
        },
        error: (error) => {
          this.cargaService.hide();
          Swal.fire({
            title: "Error",
            text: "Error al crear el tipo de producto",
            icon: "error"
          });
        }
      });

    } else {
      this.tipoproductoService.update(tipoProducto).subscribe({
        next: () => {
          this.cargaService.hide();
          Swal.fire({
            title: "Guardado",
            text: "Tipo de producto actualizado",
            icon: "success"
          });
          this.editCrear.emit(false);
        },
        error: (error) => {
          this.cargaService.hide();
          Swal.fire({
            title: "Error",
            text: "Error al modificar el tipo de producto",
            icon: "error"
          });
        }
      });
    }
  }
}