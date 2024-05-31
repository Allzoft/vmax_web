import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { UsersService } from '../../services/user.service';
import { Retreat } from '../../interfaces/retreat.interface';
import { Wallet } from '../../interfaces/user.interface';

@Component({
  selector: 'app-retreat-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './retreat-request.component.html',
})
export class RetreatRequestComponent {
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public configRef = inject(DynamicDialogConfig);
  public userService = inject(UsersService);
  public ref = inject(DynamicDialogRef);

  public user = this.userService.user;

  public amount = 0;
  public bank_name = '';
  public account_name = '';
  public account_code = '';

  public foundAccount() {
    const ordersComplete = this.user()!.phase?.orders?.filter(
      (order) => order.stateIdState === 3
    ).length;
    if (ordersComplete !== this.user()!.phase?.task_number) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Completa todas las tareas para porder retirar los fondos',
      });
      return;
    }

    if (!this.bank_name || !this.account_code || !this.account_name) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Completa todos los campos de retiro',
      });
      return;
    }

    const vipNumber: string = `vip_${this.user()!.phaseIdPhase}_earnings`; // Corregido el nombre de la propiedad

    if (this.amount > +this.user()!.wallet.balance) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `El retiro no puede ser mayor a tu balance`,
      });
      return;
    }

    if (this.amount > +this.user()!.wallet[vipNumber as keyof Wallet]) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `El retiro no puede ser mayor a tus ganancias en VIP ${
          this.user()!.phaseIdPhase
        }. El monto no puede superar los USD ${
          this.user()!.wallet[vipNumber as keyof Wallet]
        }`,
      });
      return;
    }

    const newRetreat: Partial<Retreat> = {
      bank_name: this.bank_name,
      account_name: this.account_name,
      account_code: this.account_code,
      total_retreat: this.amount,
      retreat_date: new Date(),
      walletIdWallet: this.userService.user()!.walletId,
      stateIdState: 6,
    };

    this.userService.postRetreat(newRetreat).subscribe((res) => [
      this.messageService.add({
        severity: 'success',
        summary: 'Solicitud exitosa',
        detail: '¡Solicitud de retiro de USD' + this.amount + ' exitosa!',
      }),
      setTimeout(() => {
        this.ref.close(res);
      }, 2500),
    ]);
  }
}
