import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
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

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './login-dialog.component.html',
})
export class LoginDialogComponent {
  public dialogService = inject(DialogService);
  public configRef = inject(DynamicDialogConfig);
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
  }

  public logInUser() {}

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
  }
}
