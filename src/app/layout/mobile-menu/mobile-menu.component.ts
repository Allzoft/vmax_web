import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './mobile-menu.component.html',
})
export class MobileMenuComponent {
  public router = inject(Router);

  public redirectTo(path: string) {
    this.router.navigateByUrl(path);
    console.log(this.router.url);
  }
}
