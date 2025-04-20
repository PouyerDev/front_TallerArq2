import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductoListComponent } from './components/producto-list/producto-list.component';
import { ProductoFormComponent } from './components/producto-form/producto-form.component'; // 👈 Nuevo import

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ProductoListComponent,
    ProductoFormComponent  // 👈 Añadido aquí también
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend-productos';
}
