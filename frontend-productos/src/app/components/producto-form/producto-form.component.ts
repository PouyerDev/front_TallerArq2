import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.scss']
})
export class ProductoFormComponent {
  producto: Producto = {
    nombre: '',
    precio: 0
  };

  mensaje: string = '';

  constructor(private productoService: ProductoService) {}

  guardarProducto(): void {
    this.productoService.createProducto(this.producto).subscribe({
      next: () => {
        this.mensaje = 'Producto guardado exitosamente ✅';
        this.producto = { nombre: '', precio: 0 }; // limpiar formulario
      },
      error: (error) => {
        console.error('Error al guardar producto:', error);
        this.mensaje = 'Error al guardar producto ❌';
      }
    });
  }
}
