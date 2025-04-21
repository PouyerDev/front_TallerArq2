import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8080/api/productos';
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();

  private productoSeleccionadoSubject = new BehaviorSubject<Producto | null>(null);
  productoSeleccionado$ = this.productoSeleccionadoSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener todos los productos y emitirlos
  fetchProductos(): void {
    const headers = new HttpHeaders().set('Accept', 'application/xml');
    this.http.get(this.baseUrl, { headers, responseType: 'text' }).pipe(
      map(xml => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'application/xml');
        const items = Array.from(xmlDoc.getElementsByTagName('item'));
        return items.map(item => ({
          id: +item.getElementsByTagName('id')[0].textContent!,
          nombre: item.getElementsByTagName('nombre')[0].textContent!,
          precio: +item.getElementsByTagName('precio')[0].textContent!
        }));
      })
    ).subscribe({
      next: (productos) => this.productosSubject.next(productos),
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  // Obtener un producto por ID
  getProducto(id: number): Observable<Producto> {
    const headers = new HttpHeaders().set('Accept', 'application/xml');
    return this.http.get(`${this.baseUrl}/${id}`, { headers, responseType: 'text' }).pipe(
      map(xml => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'application/xml');
        const productoNode = xmlDoc.getElementsByTagName('Producto')[0];
        return {
          id: +productoNode.getElementsByTagName('id')[0].textContent!,
          nombre: productoNode.getElementsByTagName('nombre')[0].textContent!,
          precio: +productoNode.getElementsByTagName('precio')[0].textContent!
        } as Producto;
      })
    );
  }

  // Crear un nuevo producto
  createProducto(producto: Producto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/xml',
      'Accept': 'application/xml'
    });

    const xmlBody = `
      <Producto>
        <nombre>${producto.nombre}</nombre>
        <precio>${producto.precio}</precio>
      </Producto>
    `.trim();

    return this.http.post(this.baseUrl, xmlBody, { headers, responseType: 'text' });
  }

  // Actualizar un producto
  updateProducto(producto: Producto): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/xml',
      'Accept': 'application/xml'
    });

    const xmlBody = `
      <Producto>
        <id>${producto.id}</id>
        <nombre>${producto.nombre}</nombre>
        <precio>${producto.precio}</precio>
      </Producto>
    `.trim();

    // Usar el endpoint PUT con el ID del producto
    return this.http.put(`${this.baseUrl}/${producto.id}`, xmlBody, { headers, responseType: 'text' });
  }

  // Eliminar un producto por ID
  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Seleccionar un producto
  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionadoSubject.next(producto);
  }
}
