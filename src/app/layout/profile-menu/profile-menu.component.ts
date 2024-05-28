import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { UsersService } from '../../services/user.service';
import { ToastModule } from 'primeng/toast';
import { Order } from '../../interfaces/order.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    ConfirmDialogModule,
    DividerModule,
    ToastModule,
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
  private usersService = inject(UsersService);
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

      const lastOrder = this.user!.phase!.orders![indexInPendding! - 1];

      return lastOrder ? lastOrder : null;
    }
  }

  public redirectOrder() {
    this.router.navigateByUrl('orders-list');
  }
}
