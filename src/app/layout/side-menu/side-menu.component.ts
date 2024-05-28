import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { LayoutService } from '../../services/layout.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';

import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { LoginDialogComponent } from '../../shared/login-dialog/login-dialog.component';
import { UsersService } from '../../services/user.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    DynamicDialogConfig,
  ],
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
    .w-1s sr use {
      fill: red;
    }
  `,
})
export class SideMenuComponent {
  public confirmationService = inject(ConfirmationService);
  public userService = inject(UsersService);
  public messageService = inject(MessageService);
  public layoutService = inject(LayoutService);
  public router = inject(Router);
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);

  public ref: DynamicDialogRef | undefined;

  public async redirectTo(path: string) {
    const isLoggedIn = await this.userService.isUserLogin();

    if (!isLoggedIn) {
      this.messageService.add({
        severity: 'info',
        summary: 'Inicia sesión',
        detail: 'Por favor, inicia sesión para continuar',
      });
      return;
    }

    this.router.navigateByUrl(path);
  }

  public showLogin() {
    this.ref = this.dialogService.open(LoginDialogComponent, {
      header: 'Inicio de sesión de usuario',
      draggable: true,
      styleClass: 'w-11 md:w-4',
    });

    this.ref.onClose.subscribe((resUser) => {
      if (resUser) {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: `${resUser.user.name} te autenticaste exitosamente`,
        });
      }
    });
  }

  public showCloseSesion() {
    this.confirmationService.confirm({
      message: 'Esta seguro desea cerrar sesión',
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-danger w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.closeSession();
        this.messageService.add({
          severity: 'success',
          summary: '¡Exito!',
          detail: 'Cierre de sesión exitoso',
        });
      },
    });
  }
}
