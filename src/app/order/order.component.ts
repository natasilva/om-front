import { Component } from '@angular/core';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { OrderRegisterComponent } from './components/order-register/order-register.component';
import { CommonModule } from '@angular/common';
import { OrderService } from '../services/order.service';
import { GenericRegisterComponent } from './components/generic-register/generic-register.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';
import { SearchOutline } from '@ant-design/icons-angular/icons';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzInputModule, NzIconModule, OrderRegisterComponent, NzModalModule, FormsModule, NzDatePickerModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  orders: { count: number, rows: any[] } = { count: 0, rows: [] }
  pageSize: number = 3;
  pageIndex: number = 1;
  filters: any = {};
  total = 0;

  dates: Date[] = [];
  name: string = '';

  searchTimeout: any = null;

  constructor(
    private modal: NzModalService,
    private orderService: OrderService
  ) {
    // this.listOrders(this.pageIndex, this.pageSize, null, null, [])
  }

  openOrderEditor(): void {
    this.modal.create({
      nzTitle: 'Registrar Pedido',
      nzContent: OrderRegisterComponent,
      nzFooter: null,
    }).afterClose.subscribe((reload: boolean) => reload ? this.listOrders(this.pageIndex, this.pageSize) : null);
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

  listOrders(pageIndex: number, pageSize: number) {
    const params = {
      pageIndex: pageIndex || 0,
      pageSize: pageSize || this.pageSize,
    }

    if (this.dates && this.dates[0] && this.dates[1]) {
      Object.assign(params, {
        initialDate: this.dates[0].toISOString(),
        endDate: this.dates[1].toISOString(),     
      })
    }

    if (this.name) {
      Object.assign(params, {
        name: this.name
      })
    }

    this.orderService.list(params).subscribe((orders: any) => {
      this.orders = orders;
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    this.listOrders(pageIndex, pageSize);
  }

  onChangeSearch(name: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => this.listOrders(this.pageIndex, this.pageSize), 1000)
  }

  onChangeDate(result: Date[]): void {
    this.listOrders(this.pageIndex, this.pageSize);
  }
}