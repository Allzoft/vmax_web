import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../services/layout.service';
import { UsersService } from '../../services/user.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent {
  public layoutService = inject(LayoutService);
  public userService = inject(UsersService);
  private messageService = inject(MessageService);

  public async toggleProfileSideBar() {
    const isLoggedIn = await this.userService.isUserLogin();

    if (!isLoggedIn) {
      this.messageService.add({
        severity: 'info',
        summary: 'Inicia sesión',
        detail: 'Por favor, inicia sesión para continuar',
      });
      return;
    }

    this.layoutService.toggleProfile()
  }
}
