import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { MessageService } from 'primeng/api';

import { ProductsDataTransferService } from '../../../../shared/services/products/products-data-transfer.service';
import { ProductsService } from '../../../../services/products/products.service';

import { Observable, Subject, takeUntil } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

import { GetAllProductsResponse } from '../../../../models/interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit, OnDestroy{

  private readonly destroy$: Subject<void> = new Subject()
  public productList: Array<GetAllProductsResponse> = []
  public observbleTest$ = new Observable()

  public productChartData!: ChartData
  public productChartOptions!: ChartOptions

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
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.productsDatasObservableHandler)
  }

  private productsDatasObservableHandler = {
    next: (resp: GetAllProductsResponse[]) => this.handleSuccessProductsDatas(resp),
    error: (error: HttpErrorResponse) => this.handleErrorProductsDatas(error),
  }

  private handleSuccessProductsDatas(response: GetAllProductsResponse[]) {
    if(response.length) {
      this.productList = response
      this.productsDataTransferService.setProductsDatas(this.productList);
      this.setProductsChartConfig()
    }
  }

  private setProductsChartConfig(): void {
    if(!this.productList?.length) return
    const documentStyle = getComputedStyle(document.documentElement)
    const textColor =  documentStyle.getPropertyValue('--text-color')
    const textColorSecondary =  documentStyle.getPropertyValue('--text-color-secondary')
    const surfaceBorder =  documentStyle.getPropertyValue('--surface-border')
    this.productChartData = {
      labels: this.productList.map(p => p?.name),
      datasets:[{
        label: 'quantidades',
        backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
        borderColor: documentStyle.getPropertyValue('--indigo-400'),
        hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
        data: this.productList.map(p => p?.amount)
      }]
    }

    this.productChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary,
            /* font: {
              weight: 500,
            }, */
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete()
  }

}
