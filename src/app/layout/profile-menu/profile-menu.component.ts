import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { UsersService } from '../../services/user.service';
import { ToastModule } from 'primeng/toast';
import { Order } from '../../interfaces/order.interface';
import { Router } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
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
    ToastModule,
    BadgeModule,
  ],
  providers: [ConfirmationService, MessageService],
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

  public user = this.usersService.user?.user;

  public copyUuid() {
    const uuid = this.user!.uuid;
    navigator.clipboard.writeText(uuid).then(
      () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Text copiado al portapapeles',
          detail: 'Codigo de afiliación copiado con exito',
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
    this.user?.phase!.orders?.forEach((order) =>
      order.stateIdState === 3 ? count++ : ''
    );
    return count;
  }

  get orderInProcess(): Order | null {
    const indexInProcess = this.user?.phase?.orders!.findIndex(
      (order) => order.stateIdState === 2
    );

    return indexInProcess ? this.user!.phase!.orders![indexInProcess] : null;
  }

  get orderPendding(): Order | null {
    const indexInProcess = this.user?.phase?.orders!.findIndex(
      (order) => order.stateIdState === 1
    );

    if (!indexInProcess) return null;

    return this.user!.phase!.orders![indexInProcess!];
  }

  get lastOrderComplete(): Order | null {
    if (this.orderInProcess) {
      const indexInProcess = this.user?.phase?.orders!.findIndex(
        (order) => order.stateIdState === 2
      );

      const lastOrder = this.user!.phase!.orders![indexInProcess! - 1];

      return lastOrder ? lastOrder : null;
    } else {
      const indexInPendding = this.user?.phase?.orders!.findIndex(
        (order) => order.stateIdState === 1
      );

      if (!indexInPendding) return null;

      const lastOrder = this.user!.phase!.orders![indexInPendding! - 1];

      return lastOrder ? lastOrder : null;
    }
  }

  get currentGains(): number | null {
    if (!this.user || !this.user.wallet) {
      return null;
    }

    const vipNumber: VipEarningsKeys =
      `vip_${this.user.phaseIdPhase}_earnings` as VipEarningsKeys;

    // Verificar que la propiedad existe en wallet
    if (!(vipNumber in this.user.wallet)) {
      throw new Error(`La propiedad ${vipNumber} no existe en Wallet`);
    }

    return this.user.wallet[vipNumber];
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

  public updateVIP() {}
}
