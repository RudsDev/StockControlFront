import { Component, EventEmitter, Input, Output } from '@angular/core';

import { GetAllProductsResponse } from '../../../../models/interfaces/products/response/GetAllProductsResponse';
import { ProductEvent } from '../../../../models/enums/products/ProductEvent';
import { ProductEventAction } from '../../../../models/interfaces/products/event/ProductEventAction';
import { DeleteProductAction } from '../../../../models/enums/products/DeleteProductAction';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent {

  @Input() products: Array<GetAllProductsResponse> = []
  @Output() productEvent = new EventEmitter<ProductEventAction>()
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>()

  public productSelected!: GetAllProductsResponse
  public addProductEvent = ProductEvent.ADD_PRODUCT_ITEM
  public editProductEvent = ProductEvent.EDIT_PRODUCT_ITEM

  public handleProductEvent(action: string, id?:string):void{
    if(action) {
      const productEventData = !!id ? { id, action } : { action }
      this.productEvent.emit(productEventData);
    }
  }

  public handleDeleteProduct(id: string, name:string):void {
    if(!id || !name) return
    this.deleteProductEvent.emit({ id, name })

  }
}
