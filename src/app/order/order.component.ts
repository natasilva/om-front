import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { OrderEditorComponent } from './components/order-editor/order-editor.component';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, OrderEditorComponent, NzModalModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  orders: any[] = []

  constructor(
    private modal: NzModalService,
    private orderService: OrderService
  ) {
    this.listOrders()
  }

  openOrderEditor(): void {
    this.modal.create({
      nzTitle: 'Create Order',
      nzContent: OrderEditorComponent,
    });
  }

  listOrders() {
    this.orderService.list().subscribe((orders) => {
      this.orders = orders;
    });
  }
}