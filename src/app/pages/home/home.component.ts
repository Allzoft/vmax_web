import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { CarouselModule } from 'primeng/carousel';
import { DividerModule } from 'primeng/divider';
import { LayoutService } from '../../services/layout.service';
import { ButtonModule } from 'primeng/button';
import { UsersService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { RegisterDialogComponent } from '../../shared/register-dialog/register-dialog.component';

export interface Products {
  name: string;
  photo: string;
  commission: number;
  rating: number;
  price: number;
}

export interface CurrentRetreats {
  amount: number;
  account_numb: string;
  acount_name: string;
  date: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DividerModule,
    RatingModule,
    ButtonModule,
    FormsModule,
    CarouselModule,
  ],
  providers: [DialogService, DynamicDialogConfig],
  templateUrl: './home.component.html',
  styles: `
  .carousel-container {
    display: flex;
    overflow: hidden;
  }

  .carousel-item {
    flex: 0 0 100%;
  }

  .dot {
    width: 2px;
    height: 2px;
  }

  .w-0 {
    width: 0%
  }

`,
})
export default class HomeComponent {
  public carouselItems = [1, 2, 3];
  public currentRetreats: CurrentRetreats[] = [];
  public layoutService = inject(LayoutService);
  public userService = inject(UsersService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);

  public ref: DynamicDialogRef | undefined;

  public user = this.userService.user;
  public loading = this.userService.loading;

  public productsA: Products[] = [
    {
      name: 'HAVIT HV-G92 Gamepad',
      photo: 'p1.png',
      commission: 27,
      rating: 3.5,
      price: 12.0,
    },
    {
      name: 'AK-900 Wired Keyboard',
      photo: 'p2.png',
      commission: 25,
      rating: 3.8,
      price: 56.5,
    },
    {
      name: 'IPS LCD Gaming Monitor',
      photo: 'p3.png',
      commission: 30,
      rating: 4,
      price: 370.5,
    },
    {
      name: 'S-Series Comfort Chair',
      photo: 'p4.png',
      commission: 25,
      rating: 4,
      price: 57.35,
    },
  ];

  public productsB: Products[] = [
    {
      name: 'The north coat',
      photo: 'p5.png',
      commission: 15,
      rating: 4.8,
      price: 260.0,
    },
    {
      name: 'Gucci duffle bag',
      photo: 'p6.png',
      commission: 18,
      rating: 5,
      price: 960.2,
    },
    {
      name: 'RGB liquid CPU Cooler',
      photo: 'p7.png',
      commission: 23,
      rating: 4.5,
      price: 160.5,
    },
    {
      name: 'Small BookSelf',
      photo: 'p8.png',
      commission: 20,
      rating: 5,
      price: 360.3,
    },
  ];

  constructor() {
    for (let i = 0; i < 9; i++) {
      this.currentRetreats.push({
        amount: this.generateRandomAmount(),
        account_numb: this.generateRandomAccountNumber(),
        acount_name: this.generateRandomAccountName(),
        date: this.getCurrentDate(),
      });
    }
    setInterval(() => {
      this.currentRetreats.push({
        amount: this.generateRandomAmount(),
        account_numb: this.generateRandomAccountNumber(),
        acount_name: this.generateRandomAccountName(),
        date: this.getCurrentDate(),
      });
    }, 10200);

    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.ref = this.dialogService.open(RegisterDialogComponent, {
        header: 'Registro de usuario afiliado',
        data: {
          uuid: uuid,
        },
        draggable: true,
        styleClass: 'w-11 md:w-4',
      });

      this.ref.onClose.subscribe((resUser) => {
        this.redirectTo('home')
      });
    }
  }

  generateRandomAmount(): number {
    const baseAmount = Math.random() * 2000 + 10;
    const additionalAmount =
      Math.random() * 60 * (Math.random() < 0.9 ? 1 : 15);
    return +(baseAmount + additionalAmount).toFixed(2);
  }

  generateRandomAccountName(): string {
    const accountNames = ['Skrill', 'Uphold', 'Airtm', 'Binance', 'AdvCash'];
    return accountNames[Math.floor(Math.random() * accountNames.length)];
  }

  getCurrentDate(): string {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  }

  generateRandomAccountNumber(): string {
    const providers = ['gmail', 'yahoo', 'hotmail', 'outlook', 'aol'];
    const randomProvider =
      providers[Math.floor(Math.random() * providers.length)];
    const username = Math.random().toString(36).substr(2, 2);
    const domain = randomProvider + '.com';
    return `${username}********@${domain}`;
  }

  public redirectTo(url: string) {
    this.router.navigateByUrl(url);
  }
}
