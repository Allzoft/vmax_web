import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './login-dialog.component.html',
})
export class LoginDialogComponent { }
