import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from '../../../models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {

  private productDataEmitters$ = new BehaviorSubject<Array<GetAllProductsResponse> | null>(null)
  private productsDatas: Array<GetAllProductsResponse> = []


  setProductsDatas(products: Array<GetAllProductsResponse>): void {
    if(products) {
      this.productDataEmitters$.next(products)
      this.getProductsDatas()
    }
  }


  getProductsDatas() {
    this.productDataEmitters$
      .pipe(
        take(1),
        map(d => d?.filter(p => !p.amount))
      )
      .subscribe({
        next: resp => this.productsDatas = resp ? resp : this.productsDatas
      })
    return this.productsDatas
  }

}
