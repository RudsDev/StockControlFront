import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


import { MessageService, ConfirmationService } from 'primeng/api';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CategoriesService } from '../../../../services/categories/categories.service';

import { GetAllCategoriesResponse } from '../../../../models/interfaces/categories/response/GetAllCategoriesResponse';

import { Subject, takeUntil } from 'rxjs';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { ProductEventAction } from '../../../../models/interfaces/products/event/ProductEventAction';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrl: './categories-home.component.scss'
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject()
  private dialogRef!:DynamicDialogRef
  categoriesDatas: GetAllCategoriesResponse[] = []

  ngOnInit(): void {
    this.getAllCategories()
  }

  constructor(
    private router: Router,
    private categoriesService:CategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ){}

  handleCategoryEvent(event: ProductEventAction) {
    if(!event) return
    this.dialogRef = this.dialogService.open(
      CategoryFormComponent,
      {
        header: event?.action,
        width: '70%',
        contentStyle: {
          overflow: 'auto'
        },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event
        }
       }

    )
    this.dialogRef
      .onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAllCategories()
      })
  }

  private allCategoriesObservableHandler = {
    next: (resp: GetAllCategoriesResponse[]) => this.handleSuccessGetCategories(resp),
    error: (error: HttpErrorResponse) => this.handleErrorGetCategories(error),
  }

  private categoryDeleteObservableHandler = {
    next: () => this.handleSuccessProductDelete(),
    error: (error: HttpErrorResponse) => this.handleErrorCategoryDelete(error),
  }

  private getAllCategories() {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.allCategoriesObservableHandler)
  }

  private handleSuccessGetCategories(resp: GetAllCategoriesResponse[]) {
    console.log(resp)
    if(!resp?.length) return
    this.categoriesDatas = resp
  }

  private handleErrorGetCategories(error: HttpErrorResponse) {
    console.log(error.error)
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao buscar categorias.',
      life: 2000
    });
    this.router.navigate(['/dashboard'])
  }

  public handleDeleteCategoryEvent(event: { id: string, name: string }): void {
    if(!event)return
      this.confirmationService.confirm({
        header: 'Confirmação de remoção',
        message: `Confirma a remoção da categoria ${event.name}?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteCategory(event.id)
      })
  }

  private deleteCategory(id: string) {
    if(!id)return
    this.categoriesService
      .deleteCategory(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.categoryDeleteObservableHandler)
      this.getAllCategories();
  }

  private handleSuccessProductDelete() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Categoria removida com sucesso.',
      life: 2000
    });
  }

  private handleErrorCategoryDelete(error: HttpErrorResponse) {
    console.log(error.error)
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao remover categoria.',
      life: 2000
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }
}
