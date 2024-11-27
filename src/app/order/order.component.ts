import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { OrderRegisterComponent } from './components/order-register/order-register.component';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';
import { GenericRegisterComponent } from './components/generic-register/generic-register.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, OrderRegisterComponent, NzModalModule],
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
      nzTitle: 'Registrar Pedido',
      nzContent: OrderRegisterComponent,
      nzFooter: null,
    }).afterClose.subscribe(() => this.listOrders());
  }
  
  openRegisterModal(modalType: string): void {
    const title: { [key: string]: string} = {
      drink: 'Bebida',
      ingredient: 'Ingrediente',
      burger: 'Hambúrguer',
    }

    this.modal.create({
      nzTitle: 'Cadastrar ' + title[modalType],
      nzContent: GenericRegisterComponent,
      nzFooter: null,
      nzData: {
        type: modalType
      }
    });
  }

  listOrders() {
    this.orderService.list().subscribe((orders) => {
      this.orders = orders;
    });
  }
}