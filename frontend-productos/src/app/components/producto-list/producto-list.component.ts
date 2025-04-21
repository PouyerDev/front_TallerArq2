import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./producto-list.component.scss']
})
export class ProductoListComponent implements OnInit {
  productos: Producto[] = [];
  cargando: boolean = true;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.productos$.subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.cargando = false;
      }
    });

    this.productoService.fetchProductos();
  }

  editarProducto(producto: Producto): void {
    this.productoService.seleccionarProducto(producto);
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.deleteProducto(id).subscribe({
        next: () => {
          this.productos = this.productos.filter((p) => p.id !== id);
          console.log('Producto eliminado con éxito');
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
        }
      });
    }
  }
}