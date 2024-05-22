import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { LayoutService } from '../../services/layout.service';
import { ConfirmationService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './side-menu.component.html',
  styles: `
    .dot-card {
      width: 2px;
      height: 2px;
    }
    .menu-content {
      width: 100%;
      position: -webkit-sticky;
      position: sticky;
      top: 0;
      z-index: 2;
    }
  `,
})
export class SideMenuComponent {
  public confirmationService = inject(ConfirmationService);
  public layoutService = inject(LayoutService);
  public router = inject(Router);

  public redirectTo(path: string) {
    this.router.navigateByUrl(path);
    console.log(this.router.url);
  }
}
