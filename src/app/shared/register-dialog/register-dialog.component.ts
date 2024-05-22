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
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-register-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
  ],
  providers: [DialogService, DynamicDialogConfig],
  templateUrl: './register-dialog.component.html',
})
export class RegisterDialogComponent {
  public dialogService = inject(DialogService);
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
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required]],
    });
  }

  async newAccount() {
    // if (this.registerForm.controls['password'].value.length < 8) {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'La contraseña debe ser mayor a 8 caracteres',
    //   });
    //   return;
    // }
    // if (!this.passwordEqual()) {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'Las contraseñas no coinciden',
    //   });
    //   return;
    // }
    // if (this.registerForm.invalid) {
    //   this.messageService.add({
    //     severity: 'error',
    //     summary: 'Error',
    //     detail: 'Por favor, completa todos los campos obligatorios.',
    //   });
    //   return;
    // }
    // const newClient: Client = {
    //   name: this.registerForm.controls['name'].value,
    //   lastname: this.registerForm.controls['lastname'].value,
    //   email: this.registerForm.controls['email'].value,
    //   password: this.registerForm.controls['password'].value,
    //   phone: this.registerForm.controls['phone'].value,
    //   status: 1,
    //   type_business: 0,
    //   source: 10,
    // };
    // this.wsService.postClient(newClient).subscribe(
    //   (resClient) => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Registro exitoso',
    //       detail: `${resClient.token.client.name} te registraste exitosamente`,
    //     });
    //     localStorage.setItem('user', JSON.stringify(resClient.token));
    //     this.userService.openSession(resClient.token);
    //     this.closeLoginUser.emit(true);
    //   },
    //   (error) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error de registro',
    //       detail: error.error.message, // Utiliza error.error.message para obtener el mensaje de error
    //     });
    //   }
    // );
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
}
