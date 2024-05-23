import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { ConfirmationService, MenuItem } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { UsersService } from '../../services/user.service';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    ConfirmDialogModule,
    DividerModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './profile-menu.component.html',
  styles: `
  .text-xxs {
    font-size: 0.75rem
  }
  `,
})
export class ProfileMenuComponent {
  public confirmationService = inject(ConfirmationService);
  private usersService = inject(UsersService);
  public layoutService = inject(LayoutService);

  public user = this.usersService.user?.user;
}
