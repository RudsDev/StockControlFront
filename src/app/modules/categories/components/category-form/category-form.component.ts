import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { CreateCategoryResponse } from '../../../../models/interfaces/categories/response/CreateCategoryResponse';
import { CategoriesService } from '../../../../services/categories/categories.service';
import { CategoryEvent } from '../../../../models/enums/categories/CategoryEvent';
import { EditCategoryEvent } from '../../../../models/interfaces/categories/events/EditCategoryEvent';

import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject()

  public categoryAction!: { event: EditCategoryEvent }

  public addCategoryEvent = CategoryEvent.ADD_CATEGORY_ITEM
  public editCategoryEvent = CategoryEvent.EDIT_CATEGORY_ITEM

  public categoryAddForm = this.formBuilder.group({
    name: ['', Validators.required],
  })

  ngOnInit(): void {
    this.categoryAction = this.ref.data
    const isValidValue = this.categoryAction.event.action === this.editCategoryEvent
      && !!this.categoryAction.event.categoryName;
    if(isValidValue) {
      this.setCategoryName(this.categoryAction.event.categoryName as string)
    }
  }

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoryService: CategoriesService,
    private router: Router,
  ) {}

  private categoryCreateObservableHandler = {
    next: (resp: CreateCategoryResponse) => this.handleSuccessProductCreate(resp),
    error: (error: HttpErrorResponse) => this.handleErrorCategoryCreate(error),
  }

  private categoryEditObservableHandler = {
    next: () => this.handleSuccessProductEdit(),
    error: (error: HttpErrorResponse) => this.handleErrorCategoryEdit(error),
  }

  setCategoryName(name: string) {
    name && this.categoryAddForm.setValue({ name })
  }

  handleSubmitEventCategory() {
    if(this.categoryAction.event.action === this.addCategoryEvent)
      this.handleSubmitAddCategory()
    else if(this.categoryAction.event.action === this.editCategoryEvent)
      this.handleSubmitEditCategory()
    return
  }

  handleSubmitAddCategory():void {
    if(!this.categoryAddForm?.value || this.categoryAddForm.invalid) return
    this.categoryService
      .createCategory({
        name: this.categoryAddForm.value.name as string
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.categoryCreateObservableHandler)
    this.categoryAddForm.reset()
  }

  private handleSuccessProductCreate(resp: CreateCategoryResponse) {
    if(!resp) return
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Categoria criada com sucesso.',
      life: 2000
    });
  }

  private handleErrorCategoryCreate(error: HttpErrorResponse) {
    console.log(error.error)
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao criar categoria.',
      life: 2000
    });
  }

  handleSubmitEditCategory():void {
    if(!this.categoryAddForm?.value || this.categoryAddForm.invalid) return
    this.categoryService
      .editProduct({
        name: this.categoryAddForm.value.name as string,
        category_id: this.categoryAction.event.id as string
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.categoryEditObservableHandler)
    this.categoryAddForm.reset()
  }

  private handleSuccessProductEdit() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Categoria editada com sucesso.',
      life: 2000
    });
  }

  private handleErrorCategoryEdit(error: HttpErrorResponse) {
    console.log(error.error)
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao editar categoria.',
      life: 2000
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }
}
