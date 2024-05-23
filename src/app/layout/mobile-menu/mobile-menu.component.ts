import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { LoginDialogComponent } from '../../shared/login-dialog/login-dialog.component';
import { UsersService } from '../../services/user.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, ToastModule, ConfirmDialogModule, ButtonModule],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    DynamicDialogConfig,
    ConfirmationService,
  ],
  templateUrl: './mobile-menu.component.html',
})
export class MobileMenuComponent {
  public confirmationService = inject(ConfirmationService);
  public configRef = inject(DynamicDialogConfig);
  public messageService = inject(MessageService);
  public userService = inject(UsersService);
  public dialogService = inject(DialogService);

  public ref: DynamicDialogRef | undefined;

  public router = inject(Router);

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
