import { Component, OnInit } from '@angular/core';
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
export class ProductoFormComponent implements OnInit {
  producto: Producto = {
    id: 0,
    nombre: '',
    precio: 0
  };
  mensaje: string | undefined;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.productoSeleccionado$.subscribe((producto) => {
      if (producto) {
        this.producto = { ...producto }; // Cargar el producto seleccionado
      }
    });
  }

  guardarProducto(): void {
    if (this.producto.id) {
      // Si el producto tiene un ID, se está editando
      this.productoService.updateProducto(this.producto).subscribe({
        next: () => {
          console.log('Producto actualizado');
          this.mensaje = 'Producto actualizado exitosamente.';
          this.productoService.fetchProductos(); // Actualizar la lista de productos
        },
        error: (err) => console.error('Error al actualizar producto:', err)
      });
    } else {
      // Si no tiene ID, se está creando un nuevo producto
      this.productoService.createProducto(this.producto).subscribe({
        next: () => {
          console.log('Producto creado');
          this.mensaje = 'Producto creado exitosamente.';
          this.productoService.fetchProductos(); // Actualizar la lista de productos
        },
        error: (err) => console.error('Error al crear producto:', err)
      });
    }
  }
}
