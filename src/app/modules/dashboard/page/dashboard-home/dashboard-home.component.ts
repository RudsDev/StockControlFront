import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { MessageService } from 'primeng/api';

import { ProductsDataTransferService } from '../../../../shared/services/products/products-data-transfer.service';
import { ProductsService } from '../../../../services/products/products.service';

import { GetAllProductsResponse } from '../../../../models/interfaces/products/response/GetAllProductsResponse';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit{

  public productList: Array<GetAllProductsResponse> = []
  public observbleTest$ = new Observable()

  constructor(
    private productService: ProductsService,
    private messageService: MessageService,
    private productsDataTransferService: ProductsDataTransferService,
  ) {}

  ngOnInit(): void {
    this.getProductsDatas()
  }

  getProductsDatas(): void {
    this.productService
      .getAllProducts()
      .subscribe(this.productsDatasObservableHandler)
  }

  private productsDatasObservableHandler = {
    next: (resp: GetAllProductsResponse[]) => this.handleSuccessProductsDatas(resp),
    error: (error: HttpErrorResponse) => this.handleErrorProductsDatas(error),
  }

  private handleSuccessProductsDatas(response: GetAllProductsResponse[]) {
    console.log(response)
    if(response.length) {
      this.productList = response
      this.productsDataTransferService.setProductsDatas(this.productList);
    }
  }

  private handleErrorProductsDatas(error: HttpErrorResponse) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao buscar produtos.',
      life: 2000
    });
    console.log(error.error)
  }


}
