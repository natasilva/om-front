import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { BurgerService } from '../../../services/burger.service';
import { IngredientService } from '../../../services/ingredient.service';
import { DrinkService } from '../../../services/drink.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-generic-register',
  standalone: true,
  imports: [CommonModule, NzSelectModule, NzCheckboxModule, NzIconModule, NzMessageModule, NzFormModule, NzInputModule, NzButtonModule, FormsModule, NzModalModule, ReactiveFormsModule],
  templateUrl: './generic-register.component.html',
  styleUrl: './generic-register.component.scss',
})
export class GenericRegisterComponent {
  type!: 'burger' | 'drink' | 'ingredient';
  registerForm!: FormGroup;
  submitting = false;

  ingredients: any[] = []
  
  readonly nzModalData = inject(NZ_MODAL_DATA);

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private drinkService: DrinkService,
    private ingredientService: IngredientService,
    private burgerService: BurgerService,
    private message: NzMessageService
  ) {
    this.type = this.nzModalData.type

    this.registerForm = this.fb.group({
      code: [null, [Validators.required, Validators.maxLength(5)]],
      description: [null, [Validators.required, Validators.maxLength(100)]],
      unit_price: [null, [Validators.required, Validators.min(0)]],
      ...(this.type === 'ingredient' && { is_additional: [false] }),
      ...(this.type === 'drink' && { has_sugar: [false] }),
      ...(this.type === 'burger' && { burgerIngredients: this.fb.array([], [Validators.required, this.minimumArrayLength(1)])}),
    });

    this.listIngredients();
  }

  listIngredients() {
    this.ingredientService.list().subscribe((ingredients) => {
      this.ingredients = ingredients;
    });
  }

  minimumArrayLength(minLength: number) {
    return (formArray: FormArray): { [key: string]: any } | null => {
      return formArray.length >= minLength ? null : { minimumArrayLength: true };
    };
  }

  get burgerIngredients(): FormArray {
    return this.registerForm.get('burgerIngredients') as FormArray;
  }

  addIngredient(): void {
    this.burgerIngredients.push(
      this.fb.group({
        ingredientId: [null, Validators.required],
        quantity: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeIngredient(index: number): void {
    this.burgerIngredients.removeAt(index);
  }

  closeModal(): void {
    this.modalRef.close();
  }

  submitForm(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.message.error('Preencha todos os campos obrigatórios corretamente!');
      return;
    }
  
    const data = this.registerForm.value;
    this.submitting = true;
  
    const serviceMap: { [key: string]: any } = {
      burger: this.burgerService,
      drink: this.drinkService,
      ingredient: this.ingredientService,
    };
  
    const service = serviceMap[this.type];
  
    if (!service) {
      this.message.error('Tipo inválido para cadastro!');
      this.submitting = false;
      return;
    }
  
    service.create(data).subscribe({
      next: () => {
        this.message.success('Cadastro realizado com sucesso!');
        this.closeModal();
      },
      error: (err: any) => {
        console.error(err);
        this.submitting = false
        this.message.error('Erro ao realizar cadastro!');
      },
      complete: () => (this.submitting = false),
    });
  }
}
