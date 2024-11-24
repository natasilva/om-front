import { Component } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-editor',
  standalone: true,
  imports: [CommonModule, NzFormModule, NzInputModule, NzButtonModule, FormsModule],
  templateUrl: './order-editor.component.html',
  styleUrls: ['./order-editor.component.scss']
})
export class OrderEditorComponent {
  order = {
    name: '',
    total: null,
  };

  saveOrder(): void {
    console.log('Order Saved', this.order);
  }
}