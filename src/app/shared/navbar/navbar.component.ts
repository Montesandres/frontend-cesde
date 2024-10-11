import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule,IconFieldModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Gestionar Docentes',
        icon: 'pi pi-pencil',
         routerLink:"professors"
      },
      {
        label: 'Gestionar Materias',
        icon: 'pi pi-star',
        routerLink:"subjects"
      },
    ];
  }
}
