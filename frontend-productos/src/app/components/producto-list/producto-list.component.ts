import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.scss']
})
export class ProductoListComponent implements OnInit {

  productos: Producto[] = [];
  cargando: boolean = true;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.cargando = false;
      }
    });
  }
}
