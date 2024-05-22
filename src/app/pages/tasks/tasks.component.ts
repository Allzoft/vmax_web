import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './tasks.component.html',
})
export default class TasksComponent { }
