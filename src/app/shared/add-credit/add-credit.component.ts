import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { UsersService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Credit } from '../../interfaces/credit.interface';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-add-credit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './add-credit.component.html',
})
export class AddCreditComponent {
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public configRef = inject(DynamicDialogConfig);
  public userService = inject(UsersService);
  public ref = inject(DynamicDialogRef);

  public amount = 0;

  public foundAccount() {
    if (this.amount < 1.5) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El minimo fondeo es de USD 1.50',
      });
      return;
    }
    const newCredit: Partial<Credit> = {
      credit_amount: this.amount,
      stateIdState: 4,
      type_credit: 'Fondeo',
      walletIdWallet: this.userService.user?.user.walletId,
      credit_date: new Date(),
    };

    this.userService.postCredit(newCredit).subscribe((res) => [
      this.messageService.add({
        severity: 'success',
        summary: 'Solicitud exitosa',
        detail: '¡Solicitud de fondeo de USD' + this.amount + ' exitosa!',
      }),
      setTimeout(() => {
        this.ref.close(res);
      }, 2500),
    ]);
  }
}
