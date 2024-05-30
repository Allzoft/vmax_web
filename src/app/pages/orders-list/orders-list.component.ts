import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/user.service';
import { Order } from '../../interfaces/order.interface';
import {
  SelectButtonModule,
  SelectButtonOptionClickEvent,
} from 'primeng/selectbutton';
import { DataViewModule } from 'primeng/dataview';
import { StatesService } from '../../services/states.service';
import { State } from '../../interfaces/state.interface';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TagModule,
    FormsModule,
    SelectButtonModule,
    DataViewModule,
    BadgeModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './orders-list.component.html',
})
export default class OrdersListComponent implements OnInit {
  public userService = inject(UsersService);
  public statesService = inject(StatesService);
  public messageService = inject(MessageService);
  public layoutService = inject(LayoutService);

  public orders: Order[] = [];
  public ordersFilter: Order[] = [];
  public statesFilters: State[] = [];

  public user = this.userService.user!.user;

  ngOnInit(): void {
    this.statesService.getStatesByTpe('Order').subscribe((res) => {
      this.statesFilters = res;
      const state: State = {
        id_state: 0,
        severity: '',
        name: 'Todos',
        status: 1,
        type: ['Order'],
        priority: 0,
      };
      this.statesFilters.unshift(state);
      console.log(this.statesFilters);
    });
    this.userService.getOrdersByUser().subscribe((res) => {
      this.orders = res;
      this.ordersFilter = [...this.orders];
      console.log(res);
    });
  }

  public filterOrders(event: SelectButtonOptionClickEvent) {
    const idState = event.option.id_state;
    idState === 0
      ? (this.ordersFilter = [...this.orders])
      : (this.ordersFilter = this.orders.filter(
          (order) => order.stateIdState === idState
        ));
  }

  public payOrder(order: Order) {
    order.loading = true;
    this.userService.payOrder(order.id_order).subscribe(
      (res) => {
        console.log(res);
        order.loading = false;
        const index = this.orders.findIndex(
          (order) => order.id_order === res.order.id_order
        );
        this.orders[index] = res.order;
        const indexF = this.ordersFilter.findIndex(
          (order) => order.id_order === res.order.id_order
        );
        this.ordersFilter[indexF] = res.order;
        this.messageService.add({
          severity: 'success',
          summary: '¡Exito!',
          detail: '¡El envió de fondo fue exitoso!',
        });
        this.messageService.add({
          severity: 'info',
          summary: '¡Exito!',
          detail:
            '¡La orden esta en curso, deberia completarse en máximo 24 horas!',
        });
      },
      (error) => {
        console.log(error);
        order.loading = false;

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      }
    );
  }

  public showMessage(order: Order) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Actualize su VIP',
      detail: 'Porfavor actualize su VIP para poder continuar'
    })
  }
}
