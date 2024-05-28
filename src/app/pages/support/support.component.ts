import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './support.component.html',
})
export default class SupportComponent {}
