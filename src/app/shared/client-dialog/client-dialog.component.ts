import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { UsersService } from '../../services/user.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FloatLabelModule,
    DropdownModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    InputNumberModule,
  ],
  providers: [MessageService],
  templateUrl: './client-dialog.component.html',
})
export class ClientDialogComponent {
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public usersService = inject(UsersService);
  public configRef = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public formBuild = inject(FormBuilder);
  public uploadService = inject(UploadService);

  public user = this.usersService.user;

  public inputsDirt = {
    name: false,
    phone: false,
  };

  public getInitials(userName: string): string {
    const words = userName.split(' ');
    if (words.length === 1) {
      return words[0].slice(0, 2);
    }
    if (words.length === 2) {
      return words[0].charAt(0) + words[1].charAt(0);
    }
    return words[0].slice(0, 2);
  }
}
