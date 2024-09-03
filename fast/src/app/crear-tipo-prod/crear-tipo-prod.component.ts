import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TipoproductoService } from '../services/tipoproducto.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoProducto } from '../models/tipoProducto';
import Swal from 'sweetalert2';
import { CustomComponentsModule } from '../modules/custom-components.module';

@Component({
  selector: 'app-crear-tipo-prod',
  standalone: true,
  imports: [CustomComponentsModule],
  templateUrl: './crear-tipo-prod.component.html',
  styleUrl: './crear-tipo-prod.component.css'
})
export class CrearTipoProdComponent implements OnInit{

  @Input() tipoProd!:TipoProducto;
  @Output() editCrear: EventEmitter<boolean> = new EventEmitter();
  tipoProdForm!: FormGroup;
    
  constructor(private tipoproductoService : TipoproductoService){
    this.tipoProdForm = new FormGroup({
      id:new FormControl(''),
      nombre: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
    if(this.tipoProd != null ){
      this.tipoProdForm.patchValue(this.tipoProd);
    }
  }

  guardar(tipoProducto: TipoProducto){
    if (this.tipoProdForm.valid) {
      if(!this.tipoProd){
        tipoProducto.id = 0;
        // Aquí puedes enviar los datos al servidor usando HttpClient
        this.tipoproductoService.create(tipoProducto)
          .subscribe(response => {
            // Puedes realizar acciones adicionales después de crear el cliente
            this.editCrear.emit(false);
          }, error => {
            console.error('Error al crear el tipo de producto:', error);
          });
      }else{
        // Aquí puedes enviar los datos al servidor usando HttpClient
        this.tipoproductoService.update(tipoProducto)
          .subscribe(response => {
            Swal.fire({
              title: "Guardado",
              text: "Tipo de producto guardado",
              icon: "success"
            });
            this.editCrear.emit(false);

            // Puedes realizar acciones adicionales después de crear el cliente
          }, error => {
            console.error('Error al modificar el Tipo de producto:', error);
          });
      }
      
    } else {
      // Manejar errores de validación
      console.error('Formulario inválido');
    }
  }
       
}
