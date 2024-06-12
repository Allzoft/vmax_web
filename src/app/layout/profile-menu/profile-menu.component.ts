import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import {
  ConfirmationService,
  MenuItem,
  Message,
  MessageService,
} from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { UsersService } from '../../services/user.service';
import { ToastModule } from 'primeng/toast';
import { Order } from '../../interfaces/order.interface';
import { MessagesModule } from 'primeng/messages';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ClientDialogComponent } from '../../shared/client-dialog/client-dialog.component';
import { environment } from '../../../environments/environment';
type VipEarningsKeys = 'vip_1_earnings' | 'vip_2_earnings' | 'vip_3_earnings';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    ConfirmDialogModule,
    DividerModule,
    OverlayPanelModule,
    MessagesModule,
    ToastModule,
    BadgeModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    DynamicDialogConfig,
  ],
  templateUrl: './profile-menu.component.html',
  styles: `
  .text-xxs {
    font-size: 0.75rem
  }
  `,
})
export class ProfileMenuComponent {
  public confirmationService = inject(ConfirmationService);
  public usersService = inject(UsersService);
  public layoutService = inject(LayoutService);
  public messageService = inject(MessageService);
  public router = inject(Router);

  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);

  public ref: DynamicDialogRef | undefined;

  public user = this.usersService.user;
  public loading = this.usersService.loading;

  public messages: Message[] = [
    {
      severity: 'warn',
      detail: 'Porfavor actualize su VIP',
    },
    {
      severity: 'success',
      detail: '¡Ya puedes retirar tus fondos!',
    },
  ];

  public copyUuid() {
    const uuid = this.user()!.uuid;
    const urlAffilate = `${environment.url_public}/#/home/register/${uuid}`;
    navigator.clipboard.writeText(urlAffilate).then(
      () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Link copiado al portapapeles',
          detail:
            'Link de afiliación copiado con exito, compártelo con tu afiliado',
        });
      },
      (err) => {
        this.messageService.add({
          severity: 'errpr',
          summary: 'Error',
          detail: 'Error con el codigo de afiliación',
        });
      }
    );
  }

  get ordersCompleteCount(): number {
    let count = 0;
    this.user()?.phase!.orders?.forEach((order) =>
      order.stateIdState === 3 ? count++ : ''
    );
    return count;
  }

  get orderInProcess(): Order | null {
    if (!this.user()) return null;
    const indexInProcess = this.user()?.phase?.orders!.findIndex(
      (order) => order.stateIdState === 2
    );

    if (indexInProcess === -1) return null;

    return this.user()!.phase!.orders![indexInProcess!];
  }

  get orderPendding(): Order | null {
    if (!this.user()) return null;
    const indexInProcess = this.user()?.phase?.orders!.findIndex(
      (order) => order.stateIdState === 1
    );

    if (indexInProcess === -1) return null;

    return this.user()!.phase!.orders![indexInProcess!];
  }

  get lastOrderComplete(): Order | null {
    if (!this.user()) return null;
    if (this.orderInProcess) {
      const indexInProcess = this.user()?.phase?.orders!.findIndex(
        (order) => order.stateIdState === 2
      );

      const lastOrder = this.user()!.phase!.orders![indexInProcess! - 1];

      return lastOrder ? lastOrder : null;
    } else {
      const indexInPendding = this.user()?.phase?.orders!.findIndex(
        (order) => order.stateIdState === 1
      );

      if (indexInPendding === -1) return null;

      const lastOrder = this.user()!.phase!.orders![indexInPendding! - 1];

      return lastOrder ? lastOrder : null;
    }
  }

  get currentGains(): number | null {
    if (!this.user() || !this.user()?.wallet) {
      return null;
    }

    const vipNumber: VipEarningsKeys = `vip_${
      this.user()!.phaseIdPhase
    }_earnings` as VipEarningsKeys;

    if (!(vipNumber in this.user()!.wallet)) {
      throw new Error(`La propiedad ${vipNumber} no existe en Wallet`);
    }

    return this.user()!.wallet[vipNumber];
  }

  public redirectOrder() {
    this.router.navigateByUrl('orders-list');
  }

  public redirectTo(module: string) {
    this.router.navigateByUrl(module);
    if (this.layoutService.isMobile()) {
      this.layoutService.state.profileSidebarVisible = false;
    }
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
        this.usersService.closeSession();
        this.messageService.add({
          severity: 'success',
          summary: '¡Exito!',
          detail: 'Cierre de sesión exitoso',
        });
      },
    });
  }

  public get unreadCount(): number {
    const count = this.usersService.notifications.reduce(
      (acc, notification) => acc + (notification.isRead ? 0 : 1),
      0
    );
    return count;
  }

  public updateVIP() {
    this.confirmationService.confirm({
      message:
        'Confirma tu actualización, te recomendamos retirar tus fondos antes de continuar.',
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-rounded p-button-success w-7rem',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-rounded p-button-danger w-7rem',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.updateUserVIP().subscribe((res) => {
          this.messageService.add({
            severity: 'success',
            summary: `¡Actualización a VIP ${res.phaseIdPhase} exitosa!`,
            detail: 'Ya puedes gozar de mayores comisiones',
          });
        });
      },
    });
  }

  public showInfoUser() {
    this.ref = this.dialogService.open(ClientDialogComponent, {
      header: 'Informacion sobre el usuario',
      draggable: true,
      styleClass: 'w-11 md:w-7',
    });
  }
}
