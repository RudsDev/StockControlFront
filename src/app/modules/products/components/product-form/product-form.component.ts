import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { Subject, takeUntil } from 'rxjs';

import { CategoriesService } from '../../../../services/categories/categories.service';

import { GetAllCategoriesResponse } from '../../../../models/interfaces/categories/response/GetAllCategoriesResponse';
import { CreateProductRequest } from '../../../../models/interfaces/products/request/CreateProductRequest';
import { ProductsService } from '../../../../services/products/products.service';
import { CreateProductResponse } from '../../../../models/interfaces/products/response/CreateProductResponse';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject()

  categoriesDatas: GetAllCategoriesResponse[] = []
  selectedCategory: Array<{name: string, code: string}> = []

  public productAddForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  })

  ngOnInit(): void {
    this.getAllCategories()
  }

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  private allCategoriesObservableHandler = {
    next: (resp: GetAllCategoriesResponse[]) => this.handleSuccessGetCategories(resp),
    error: (error: HttpErrorResponse) => this.handleErrorGetCategories(error),
  }

  private productsCreateObservableHandler = {
    next: (resp: CreateProductResponse) => this.handleSuccessProductCreate(resp),
    error: (error: HttpErrorResponse) => this.handleErrorProductCreate(error),
  }

  getAllCategories() {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.allCategoriesObservableHandler)
  }

  private handleSuccessGetCategories(resp: GetAllCategoriesResponse[]) {
    if(!resp?.length) return
    this.categoriesDatas = resp
  }

  private handleErrorGetCategories(error: HttpErrorResponse) {
    console.log(error)
  }

  handleSubmitAddProduct():void {
    if(!this.productAddForm?.value || this.productAddForm.invalid) return
    this.productsService
      .createProduct(this.createProductRequest())
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.productsCreateObservableHandler)
    this.productAddForm.reset()
  }

  handleSubmitEditProduct():void {

  }

  private handleSuccessProductCreate(resp: CreateProductResponse) {
    if(!resp) return
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Produto criado com sucesso.',
      life: 2000
    });
  }

  private handleErrorProductCreate(error: HttpErrorResponse) {
    console.log(error.error)
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao criar produto.',
      life: 2000
    });
  }

  private createProductRequest(): CreateProductRequest {
    return {
      name: this.productAddForm.value.name as string,
      price: this.productAddForm.value.price as string,
      description: this.productAddForm.value.description as string,
      category_id: this.productAddForm.value.category_id as string,
      amount: Number(this.productAddForm.value.amount)
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }

}
