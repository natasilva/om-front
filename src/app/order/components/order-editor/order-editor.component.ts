import { Component, OnInit } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { OrderService } from '../../../services/order.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DrinkService } from '../../../services/drink.service';
import { IngredientService } from '../../../services/ingredient.service';
import { BurgerService } from '../../../services/burger.service';

@Component({
  selector: 'app-order-editor',
  standalone: true,
  imports: [CommonModule, NzSelectModule, NzIconModule, NzFormModule, NzInputModule, NzButtonModule, FormsModule, NzModalModule, ReactiveFormsModule, NzDatePickerModule],
  templateUrl: './order-editor.component.html',
  styleUrls: ['./order-editor.component.scss']
})
export class OrderEditorComponent implements OnInit {
  orderForm: FormGroup;

  burgers: any[]  = [];
  additionals: any[]  = [];
  drinks: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private orderService: OrderService,
    private drinkService: DrinkService,
    private ingredientService: IngredientService,
    private burgerService: BurgerService
  ) {
    this.orderForm = this.fb.group({
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
      orderDate: [null, [Validators.required]],
      address: this.fb.group({
        street: ['', [Validators.required]],
        number: ['', [Validators.required]],
        district: ['', [Validators.required]],
      }),
      notes: this.fb.array([]),
      orderBurgers: this.fb.array([]),
      orderAdditionals: this.fb.array([]),
      orderDrinks: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.listDrinks()
    this.listAdditionals()
    this.listBurgers()
  }

  listAdditionals() {
    this.ingredientService.list({ is_additional: true }).subscribe((additional) => {
      this.additionals = additional;
    });
  }

  listBurgers() {
    this.burgerService.list().subscribe((burgers) => {
      this.burgers = burgers;
    });
  }

  listDrinks() {
    this.drinkService.list().subscribe((drinks) => {
      this.drinks = drinks;
    });
  }

  get notes() {
    return this.orderForm.get('notes') as FormArray;
  }

  addNote(): void {
    this.notes.push(this.fb.control(''));
  }

  removeNote(index: number): void {
    this.notes.removeAt(index);
  }

  get orderBurgers(): FormArray {
    return this.orderForm.get('orderBurgers') as FormArray;
  }

  get orderAdditionals(): FormArray {
    return this.orderForm.get('orderAdditionals') as FormArray;
  }

  get orderDrinks(): FormArray {
    return this.orderForm.get('orderDrinks') as FormArray;
  }

  addBurger(): void {
    this.orderBurgers.push(
      this.fb.group({
        burgerId: [null, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeBurger(index: number): void {
    this.orderBurgers.removeAt(index);
  }

  addAdditional(): void {
    this.orderAdditionals.push(
      this.fb.group({
        ingredientId: [null, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeAdditional(index: number): void {
    this.orderAdditionals.removeAt(index);
  }

  addDrink(): void {
    this.orderDrinks.push(
      this.fb.group({
        drinkId: [null, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeDrink(index: number): void {
    this.orderDrinks.removeAt(index);
  }


  closeModal(): void {
    this.modalRef.close();
  }

  saveOrder(): void {
    if (this.orderForm.valid) {
      debugger
      const orderData = this.orderForm.value;
      this.orderService.create(orderData).subscribe({
        next: (response: any) => {
          console.log('Pedido salvo com sucesso!', response);
          this.closeModal()
        },
        error: (error: any) => {
          console.error('Erro ao salvar pedido', error);
        }
      });
    } else {
      this.orderForm.markAllAsTouched();
      console.log('Formulário inválido');
    }
  }
}