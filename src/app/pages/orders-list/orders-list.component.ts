import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './orders-list.component.html',
})
export default class OrdersListComponent { }
