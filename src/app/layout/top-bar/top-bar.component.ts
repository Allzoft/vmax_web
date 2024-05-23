import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from '../../services/layout.service';
import { UsersService } from '../../services/user.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent {
  public layoutService = inject(LayoutService);
  public userService = inject(UsersService);
}
