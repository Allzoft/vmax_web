import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { User } from '../../interfaces/user.interface';
import { UsersService } from '../../services/user.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    DropdownModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
  ],
  providers: [DialogService, DynamicDialogConfig, MessageService],
  templateUrl: './register-dialog.component.html',
})
export class RegisterDialogComponent {
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public usersService = inject(UsersService);
  public configRef = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public formBuild = inject(FormBuilder);

  public registerForm: FormGroup;
  public showPassword: boolean = false;
  public showPassword2: boolean = false;

  constructor() {
    this.registerForm = this.formBuild.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      code_country: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required]],
    });
  }

  async newAccount() {
    if (this.registerForm.controls['password'].value.length < 8) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La contraseña debe ser mayor a 8 caracteres',
      });
      return;
    }
    if (!this.passwordEqual()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Las contraseñas no coinciden',
      });
      return;
    }
    if (this.registerForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, completa todos los campos obligatorios.',
      });
      return;
    }
    const newUser: Partial<User> = {
      name: this.registerForm.controls['name'].value,
      email: this.registerForm.controls['email'].value,
      password: this.registerForm.controls['password'].value,
      phone: this.registerForm.controls['phone'].value,
      code_country: this.registerForm.controls['code_country'].value,
    };
    this.usersService.postUser(newUser).subscribe(
      (resUser) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: `Te registraste exitosamente`,
        });
        this.messageService.add({
          severity: 'info',
          summary: 'Inicia sesión',
          detail: `Porfavor inicia sesión para continuar`,
          life: 3000,
        });
        setTimeout(() => {
          this.ref.destroy();
        }, 3000);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de registro',
          detail: error.error.message,
        });
      }
    );
  }

  public passwordEqual(): boolean {
    return (
      this.registerForm.controls['password'].value ===
      this.registerForm.controls['password2'].value
    );
  }

  public backLogin() {
    this.ref.destroy();
  }

  public getCurrencyCode(currencies: {
    [key: string]: { name: string; symbol: string };
  }): string {
    return Object.keys(currencies)[0]; // Devuelve el primer código de moneda
  }
}
