import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../services/user.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login-dialog.component.html',
})
export class LoginDialogComponent {
  public messageService = inject(MessageService);
  public dialogService = inject(DialogService);
  public configRef = inject(DynamicDialogConfig);
  public userService = inject(UsersService);
  public ref = inject(DynamicDialogRef);
  public formBuild = inject(FormBuilder);

  public ref2: DynamicDialogRef | undefined;

  public loginForm: FormGroup;
  public showPassword: boolean = false;

  constructor() {
    this.loginForm = this.formBuild.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false, []],
    });
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      this.loginForm.patchValue({ email: savedEmail });
    }
  }

  public logInUser() {
    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Por favor, completa todos los campos obligatorios y corrige los errores.',
      });
      return;
    }
    const loginUser = {
      email: this.loginForm.get('email')!.value,
      password: this.loginForm.get('password')!.value, // Corregir los corchetes aquí
    };

    this.userService.logInUser(loginUser).subscribe(
      (resUser) => {
        localStorage.setItem('user', JSON.stringify(resUser));

        if (this.loginForm.get('remember')!.value) {
          localStorage.setItem('email', this.loginForm.get('email')!.value);
        } else {
          localStorage.removeItem('email');
        }
        this.ref.close(resUser);
      },
      (error) => {
        console.log(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error de accesso',
          detail: error.error.message, // Utiliza error.error.message para obtener el mensaje de error
        });
      }
    );
  }

  public toggleRemember(event: any) {
    const rememberControl = this.loginForm.get('remember');
    rememberControl!.setValue(!!event.checked.length);
  }

  public showRegister() {
    this.ref2 = this.dialogService.open(RegisterDialogComponent, {
      header: 'Registro de nuevo usuario',
      draggable: true,
      styleClass: 'w-11 md:w-4',
    });
    this.ref2.onDestroy.subscribe((resUser) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: `Te registraste exitosamente`,
      });
      this.messageService.add({
        severity: 'info',
        summary: 'Inicia sesión',
        detail: `Porfavor inicia sesión para continuar`,
        life: 5000,
      });
    });
  }
}
