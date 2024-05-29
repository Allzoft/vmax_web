import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/user.service';
import { LayoutService } from '../../services/layout.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StatesService } from '../../services/states.service';
import { Retreat } from '../../interfaces/retreat.interface';
import { State } from '../../interfaces/state.interface';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import {
  SelectButtonModule,
  SelectButtonOptionClickEvent,
} from 'primeng/selectbutton';
import { DataViewModule } from 'primeng/dataview';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { RetreatRequestComponent } from '../../shared/retreat-request/retreat-request.component';

@Component({
  selector: 'app-retreats-list',
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
  templateUrl: './retreats-list.component.html',
})
export default class RetreatsListComponent implements OnInit {
  public userService = inject(UsersService);
  public statesService = inject(StatesService);
  public messageService = inject(MessageService);
  public layoutService = inject(LayoutService);
  public configRef = inject(DynamicDialogConfig);
  public dialogService = inject(DialogService);

  public ref: DynamicDialogRef | undefined;

  public retreats: Retreat[] = [];
  public retreatsFilters: Retreat[] = [];
  public statesFilters: State[] = [];

  public limit = 5;
  public offset = 0;

  ngOnInit(): void {
    this.statesService.getStatesByTpe('Retreat').subscribe((res) => {
      this.statesFilters = res;
      const state: State = {
        id_state: 0,
        severity: '',
        name: 'Todos',
        status: 1,
        type: ['Retreat'],
        priority: 0,
      };
      this.statesFilters.unshift(state);
      console.log(this.statesFilters);
    });

    this.userService.getRetreats(this.limit, this.offset).subscribe((res) => {
      this.offset += this.limit;
      this.retreats = [...this.retreats, ...res];
      this.retreatsFilters = [...this.retreats];
      console.log(this.retreats);
    });
  }

  public getMoreRetreats() {
    this.userService.getRetreats(this.limit, this.offset).subscribe((res) => {
      this.offset += this.limit;
      this.retreats = [...this.retreats, ...res];
      this.retreatsFilters = [...this.retreats];
      console.log(res);
    });
  }

  public filterRetreats(event: SelectButtonOptionClickEvent) {
    const idState = event.option.id_state;
    idState === 0
      ? (this.retreatsFilters = [...this.retreats])
      : (this.retreatsFilters = this.retreats.filter(
          (retreat) => retreat.stateIdState === idState
        ));
  }

  public addRetreats() {
    this.ref = this.dialogService.open(RetreatRequestComponent, {
      header: 'Agrega los datos de Retiro',
      draggable: true,
      styleClass: 'w-11 md:w-4',
    });

    this.ref.onClose.subscribe((res) => {
      if (res) {
        this.retreats.unshift(res);
        this.retreatsFilters.unshift(res);
      }
    });
  }
}
