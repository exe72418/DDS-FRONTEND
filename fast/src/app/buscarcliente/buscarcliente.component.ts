import { Component } from '@angular/core';

@Component({
  selector: 'app-buscarcliente',
  standalone: true,
  imports: [],
  templateUrl: './buscarcliente.component.html',
  styleUrl: './buscarcliente.component.css'
})
export class BuscarclienteComponent {
  cliente!: Cliente  
}
