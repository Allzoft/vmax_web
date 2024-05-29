import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/user.service';
import { StatesService } from '../../services/states.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LayoutService } from '../../services/layout.service';
import { State } from '../../interfaces/state.interface';
import {
  SelectButtonModule,
  SelectButtonOptionClickEvent,
} from 'primeng/selectbutton';
import { Credit } from '../../interfaces/credit.interface';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { DataViewModule } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { AddCreditComponent } from '../../shared/add-credit/add-credit.component';

@Component({
  selector: 'app-incomes-list',
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
  providers: [
    MessageService,
    ConfirmationService,
    DialogService,
    DynamicDialogConfig,
  ],
  templateUrl: './incomes-list.component.html',
})
export default class IncomesListComponent {
  public userService = inject(UsersService);
  public statesService = inject(StatesService);
  public messageService = inject(MessageService);
  public layoutService = inject(LayoutService);
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);

  public ref: DynamicDialogRef | undefined;

  public credits: Credit[] = [];
  public creditsFilters: Credit[] = [];
  public statesFilters: State[] = [];

  public limit = 5;
  public offset = 0;

  ngOnInit(): void {
    this.statesService.getStatesByTpe('Transactions').subscribe((res) => {
      this.statesFilters = res;
      const state: State = {
        id_state: 0,
        severity: '',
        name: 'Todos',
        status: 1,
        type: ['Transactions'],
        priority: 0,
      };
      this.statesFilters.unshift(state);
      console.log(this.statesFilters);
    });

    this.userService.getCredits(this.limit, this.offset).subscribe((res) => {
      this.offset += this.limit;
      this.credits = [...this.credits, ...res];
      this.creditsFilters = [...this.credits];
      console.log(res);
    });
  }

  public getMoreCredits() {
    this.userService.getCredits(this.limit, this.offset).subscribe((res) => {
      this.offset += this.limit;
      this.credits = [...this.credits, ...res];
      this.creditsFilters = [...this.credits];
      console.log(res);
    });
  }

  public filterCredits(event: SelectButtonOptionClickEvent) {
    const idState = event.option.id_state;
    idState === 0
      ? (this.creditsFilters = [...this.credits])
      : (this.creditsFilters = this.credits.filter(
          (credit) => credit.stateIdState === idState
        ));
  }

  public addCredits() {
    this.ref = this.dialogService.open(AddCreditComponent, {
      header: 'Agrega los datos de fondeo',
      draggable: true,
      styleClass: 'w-11 md:w-4',
    });

    this.ref.onClose.subscribe((res) => {
      if (res) {
        this.credits.unshift(res);
        this.creditsFilters.unshift(res);
      }
    });
  }
}
