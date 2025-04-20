import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Producto } from '../models/producto';
import { parseStringPromise } from 'xml2js';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private baseUrl = 'http://localhost:5120/api/productos';

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getProductos(): Observable<Producto[]> {
    const headers = new HttpHeaders().set('Accept', 'application/xml');
    return this.http.get(this.baseUrl, { headers, responseType: 'text' }).pipe(
      switchMap(xml =>
        from(parseStringPromise(xml, { explicitArray: false })).pipe(
          map(result => {
            const items = result?.List?.item ?? [];
            return Array.isArray(items) ? items : [items];
          })
        )
      )
    );
  }

  // Obtener un producto por ID
  getProducto(id: number): Observable<Producto> {
    const headers = new HttpHeaders().set('Accept', 'application/xml');
    return this.http.get(`${this.baseUrl}/${id}`, { headers, responseType: 'text' }).pipe(
      switchMap(xml =>
        from(parseStringPromise(xml, { explicitArray: false })).pipe(
          map(result => result.Producto as Producto)
        )
      )
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

  // Eliminar un producto por ID
  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
