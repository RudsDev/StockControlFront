import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { Subject, takeUntil } from 'rxjs';

import { ProductsService } from '../../../../services/products/products.service';
import { ProductsDataTransferService } from '../../../../shared/services/products/products-data-transfer.service';

import { GetAllProductsResponse } from '../../../../models/interfaces/products/response/GetAllProductsResponse';
import { ProductEventAction } from '../../../../models/interfaces/products/event/ProductEventAction';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrl: './products-home.component.scss'
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject()
  public productList: Array<GetAllProductsResponse> = []

  ngOnInit(): void {
    this.getServiceProductsDatas()
  }

  constructor(
    private router: Router,
    private productService:ProductsService,
    private productsDataTransferService: ProductsDataTransferService,
    private messageService: MessageService
  ){}

  private productsDatasObservableHandler = {
    next: (resp: GetAllProductsResponse[]) => this.handleSuccessProductsDatas(resp),
    error: (error: HttpErrorResponse) => this.handleErrorProductsDatas(error),
  }

  public handleProductAction(event: ProductEventAction): void {
    console.log(event)
  }

  private getServiceProductsDatas(): void {
    const productsLoaded = this.productsDataTransferService.getProductsDatas()
    if(productsLoaded?.length) {
      this.productList = productsLoaded
    } else {
      this.getProductsDatasFromApi()
    }
  }

  private getProductsDatasFromApi(): void {
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.productsDatasObservableHandler)
  }

  private handleSuccessProductsDatas(response: GetAllProductsResponse[]) {
    if(response?.length) {
      this.productList = response
    }
    console.log(this.productList)
  }

  private handleErrorProductsDatas(error: HttpErrorResponse) {
    console.log(error.error)
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao buscar produtos.',
      life: 2000
    });
    this.router.navigate(['/dashboard'])
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }
}
