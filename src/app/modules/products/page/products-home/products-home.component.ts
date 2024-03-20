import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';

import { ConfirmationService, MessageService } from 'primeng/api';

import { Subject, takeUntil } from 'rxjs';

import { ProductsService } from '../../../../services/products/products.service';
import { ProductsDataTransferService } from '../../../../shared/services/products/products-data-transfer.service';

import { GetAllProductsResponse } from '../../../../models/interfaces/products/response/GetAllProductsResponse';
import { DeleteProductsResponse } from '../../../../models/interfaces/products/response/DeleteProductsResponse';
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
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){}

  private productsDatasObservableHandler = {
    next: (resp: GetAllProductsResponse[]) => this.handleSuccessProductsDatas(resp),
    error: (error: HttpErrorResponse) => this.handleErrorProductsDatas(error),
  }

  private productDeleteObservableHandler = {
    next: (resp: DeleteProductsResponse) => this.handleSuccessProductDelete(resp),
    error: (error: HttpErrorResponse) => this.handleErrorProductsDelete(error),
  }

  public handleProductAction(event: ProductEventAction): void {
    console.log(event)
  }

  public handleDeleteProductAction(event: { id: string, name: string }): void {
    if(!event)return
      this.confirmationService.confirm({
        header: 'Confirmação de remoção',
        message: `Confirma a remoção do produto ${event.name}?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: () => this.deleteProduct(event.id)
      })
  }

  deleteProduct(id: string) {
    if(!id)return
    this.productService
      .deleteProduct(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.productDeleteObservableHandler)
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

  private handleSuccessProductDelete(response: DeleteProductsResponse) {
    if(!response) return
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Produto removido com sucesso.',
      life: 2000
    });
    this.getProductsDatasFromApi()
  }

  private handleErrorProductsDelete(error: HttpErrorResponse) {
    console.log(error.error)
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao remover produto.',
      life: 2000
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }
}
