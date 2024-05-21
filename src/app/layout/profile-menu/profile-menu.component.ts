import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { ConfirmationService, MenuItem } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './profile-menu.component.html',
})
export class ProfileMenuComponent {
  public confirmationService = inject(ConfirmationService);
  public layoutService = inject(LayoutService);
}
