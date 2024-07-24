import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crear-clientes.component.html',
  styleUrl: './crear-clientes.component.css'
})
export class CrearClientesComponent {

  constructor(public router: Router) { }
}
