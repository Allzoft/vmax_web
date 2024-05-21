import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './layout.component.html',
})
export default class LayoutComponent { }
