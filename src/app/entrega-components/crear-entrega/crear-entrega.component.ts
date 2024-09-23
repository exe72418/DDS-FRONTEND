import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Entrega } from '../../models/entrega';
import { CustomComponentsModule } from '../../modules/custom-components.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RepartidorService } from '../../services/repartidor.service';
import { Repartidor } from '../../models/repartidor';
import { EntregaService } from '../../services/entrega.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-entrega',
  standalone: true,
  imports: [CustomComponentsModule],
  templateUrl: './crear-entrega.component.html',
  styleUrl: './crear-entrega.component.css'
})
export class CrearEntregaComponent {

  @Input() entrega!: Entrega;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();

  entregaForm!: FormGroup;
  repartidores: Repartidor[] = [];

  constructor(private repartidorService: RepartidorService, private _entregaService: EntregaService) {
    this.entregaForm = new FormGroup({
      id: new FormControl(''),
      fecha: new FormControl('', [Validators.required]),
      lote: new FormControl('', [Validators.required]),
      zona: new FormControl('', [Validators.required]),
      repartidor: new FormControl('', [Validators.required]),

    })
  }
  ngOnInit(): void {
    if (this.entrega != null) {
      this.entregaForm.patchValue(this.entrega)
    }
    this.repartidorService.getAll().subscribe((data: any) => {
      this.repartidores = data['data'].map((repartidor: Repartidor) => {
        const repartidorFormateado: Repartidor = {
          id: repartidor.id,
          cuit: repartidor.cuit,
          apellidoNombre: repartidor.apellidoNombre,
          vehiculo: repartidor.vehiculo,
          zona: repartidor.zona
        };
        return repartidorFormateado;
      });
    })
  }


  guardar(ent: Entrega) {
    if (this.entrega != undefined || this.entrega != null) {
      if (this.entrega.id) {
        this._entregaService.update(ent).subscribe(entBackend => {
          Swal.fire({
            title: "Guardado",
            text: "Entrega actualizada",
            icon: "success"
          });
          this.editCrear.emit(false);

          console.log(entBackend)
        }, error => {
          console.error('Error al modificar la entrega:', error);
        })
      }
    } else {
      console.log(ent)
      ent.id = 0;
      this._entregaService.save(ent).subscribe(entBackend => {
        Swal.fire({
          title: "Guardado",
          text: "Entrega creada",
          icon: "success"
        });
        this.editCrear.emit(false);

        console.log(entBackend)
      }, error => {
        console.error('Error al crear la entrega:', error);
      });
    }
  }

}

