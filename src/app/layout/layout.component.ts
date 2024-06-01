import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { LayoutService } from '../services/layout.service';
import { RouterModule } from '@angular/router';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { UsersService } from '../services/user.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    SideMenuComponent,
    ProfileMenuComponent,
    TopBarComponent,
    MobileMenuComponent,
    RouterModule,
  ],
  templateUrl: './layout.component.html',
  styles: `
    .w-0 {
      width: 0%
    }
  `,
})
export default class LayoutComponent {
  public layoutService = inject(LayoutService);
  public userService = inject(UsersService);

  public user = this.userService.user;
}
