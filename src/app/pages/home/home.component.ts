import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { CarouselModule } from 'primeng/carousel';

export interface Products {
  name: string;
  photo: string;
  commission: number;
  rating: number;
  price: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RatingModule, FormsModule,CarouselModule],
  templateUrl: './home.component.html',
})
export default class HomeComponent {
  public productsA: Products[] = [
    {
      name: 'HAVIT HV-G92 Gamepad',
      photo: 'p1.png',
      commission: 27,
      rating: 3.5,
      price: 120.00,
    },
    {
      name: 'AK-900 Wired Keyboard',
      photo: 'p2.png',
      commission: 25,
      rating: 3.8,
      price: 56.50,
    },
    {
      name: 'IPS LCD Gaming Monitor',
      photo: 'p3.png',
      commission: 30,
      rating: 4,
      price: 370.50,
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
      price: 260.00,
    },
    {
      name: 'Gucci duffle bag',
      photo: 'p6.png',
      commission: 18,
      rating: 5,
      price: 960.20,
    },
    {
      name: 'RGB liquid CPU Cooler',
      photo: 'p7.png',
      commission: 23,
      rating: 4.5,
      price: 160.50,
    },
    {
      name: 'Small BookSelf',
      photo: 'p8.png',
      commission: 20,
      rating: 5,
      price: 360.30,
    },
  ];

  constructor() {}
}
