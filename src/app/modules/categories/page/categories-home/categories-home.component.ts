import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


import { MessageService, ConfirmationService } from 'primeng/api';

import { DialogService } from 'primeng/dynamicdialog';

import { CategoriesService } from '../../../../services/categories/categories.service';

import { GetAllCategoriesResponse } from '../../../../models/interfaces/categories/response/GetAllCategoriesResponse';

import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrl: './categories-home.component.scss'
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject()

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

  private allCategoriesObservableHandler = {
    next: (resp: GetAllCategoriesResponse[]) => this.handleSuccessGetCategories(resp),
    error: (error: HttpErrorResponse) => this.handleErrorGetCategories(error),
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }
}
