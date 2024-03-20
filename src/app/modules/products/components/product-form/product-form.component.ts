import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

import { Subject, takeUntil } from 'rxjs';

import { CategoriesService } from '../../../../services/categories/categories.service';

import { ProductEventAction } from '../../../../models/interfaces/products/event/ProductEventAction';
import { GetAllCategoriesResponse } from '../../../../models/interfaces/categories/response/GetAllCategoriesResponse';
import { CreateProductRequest } from '../../../../models/interfaces/products/request/CreateProductRequest';
import { EditProductRequest } from '../../../../models/interfaces/products/request/EditProductRequest';
import { EditProductResponse } from '../../../../models/interfaces/products/response/EditProductResponse';
import { ProductsService } from '../../../../services/products/products.service';
import { CreateProductResponse } from '../../../../models/interfaces/products/response/CreateProductResponse';
import { ProductEvent } from '../../../../models/enums/products/ProductEvent';
import { GetAllProductsResponse } from '../../../../models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from '../../../../shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject()

  categoriesDatas: GetAllCategoriesResponse[] = []
  selectedCategory: Array<{name: string, code: string}> = []

  public selectedDatas!: GetAllProductsResponse
  public productAction!: {
    event: ProductEventAction,
    productDatas: Array<GetAllProductsResponse>
  }
  public productsdDatas: Array<GetAllProductsResponse> = []

  public addProductEvent = ProductEvent.ADD_PRODUCT_ITEM
  public editProductEvent = ProductEvent.EDIT_PRODUCT_ITEM
  public saleProductEvent = ProductEvent.SALE_PRODUCT_ITEM

  public renderDropDown = false

  public productAddForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  })

  public productEditForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  })

  ngOnInit(): void {
    this.productAction = this.ref.data
    this.getProductToEdit();

    this.productAction?.event?.action === this.saleProductEvent &&
      this.getProductDatas();

    this.getAllCategories()
    this.renderDropDown = true
  }

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private prodtuctDataTransferService: ProductsDataTransferService,
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

  private productsEditObservableHandler = {
    next: () => this.handleSuccessProductEdit(),
    error: (error: HttpErrorResponse) => this.handleErrorProductEdit(error),
  }

  private productsGetallObservableHandler = {
    next: (resp: Array<GetAllProductsResponse>) => this.handleSuccessProductGetAll(resp),
    error: (error: HttpErrorResponse) => this.handleErrorProductGetAll(error),
  }

  private getProductToEdit() {
    const hasData = this.productAction?.event?.action === this.editProductEvent
      && !!this.productAction?.productDatas;
    if (hasData) {
      this.getProductSelected(this.productAction?.event?.id as string);
    }
  }

  getAllCategories() {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.allCategoriesObservableHandler)
  }

  getProductSelected(id: string):void {
    const datas = this.productAction?.productDatas
    if(!datas || !datas.length) return
    const products = datas.filter(p => p.id === id)

    if(products) {
      this.selectedDatas = products[0]
      this.productEditForm.setValue({
        name: this.selectedDatas?.name,
        price: this.selectedDatas?.price,
        description: this.selectedDatas?.description,
        category_id: this.selectedDatas?.category.id,
        amount: this.selectedDatas?.amount
      })
    }
  }

  getProductDatas():void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.productsGetallObservableHandler)
  }

  private handleSuccessProductGetAll(resp: Array<GetAllProductsResponse>) {
    if(!resp) return
    this.productsdDatas = resp
    this.prodtuctDataTransferService.setProductsDatas(this.productsdDatas)
  }

  private handleErrorProductGetAll(error: HttpErrorResponse) {
    console.log(error.error)
  }

  private handleSuccessGetCategories(resp: GetAllCategoriesResponse[]) {
    if(!resp?.length) return
    this.categoriesDatas = resp
    this.getProductToEdit()
  }

  private handleErrorGetCategories(error: HttpErrorResponse) {
    console.log(error.error)
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
    if(!this.productEditForm?.value || this.productEditForm.invalid) return
    this.productsService
      .editProduct(this.createEditProductRequest())
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.productsEditObservableHandler)
  }

  private handleSuccessProductEdit() {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Produto editado com sucesso.',
      life: 2000
    });
    this.productEditForm.reset()
  }

  private handleErrorProductEdit(error: HttpErrorResponse) {
    console.log(error.error)
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao editar produto.',
      life: 2000
    });
    this.productEditForm.reset()
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

  private createEditProductRequest(): EditProductRequest {
    return {
      product_id: this.productAction.event.id as string,
      category_id: this.productEditForm?.value.category_id as string,
      name: this.productEditForm.value.name as string,
      price: this.productEditForm.value.price as string,
      description: this.productEditForm.value.description as string,
      amount: Number(this.productEditForm.value.amount)
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }

}
