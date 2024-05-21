import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { LayoutService } from '../services/layout.service';
import { RouterModule } from '@angular/router';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    SideMenuComponent,
    ProfileMenuComponent,
    RouterModule,
  ],
  templateUrl: './layout.component.html',
})
export default class LayoutComponent {
  public layoutService = inject(LayoutService);
}
