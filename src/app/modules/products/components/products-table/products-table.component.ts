import { Component, Input } from '@angular/core';
import { GetAllProductsResponse } from '../../../../models/interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent {

  @Input() products: Array<GetAllProductsResponse> = []

  public productSelected!: GetAllProductsResponse

}
