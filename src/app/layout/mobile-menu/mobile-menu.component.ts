import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './mobile-menu.component.html',
})
export class MobileMenuComponent {}
