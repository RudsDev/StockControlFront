import { Component, Input } from '@angular/core';
import { GetAllCategoriesResponse } from '../../../../models/interfaces/categories/response/GetAllCategoriesResponse';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrl: './categories-table.component.scss'
})
export class CategoriesTableComponent {

  @Input() public categories: Array<GetAllCategoriesResponse> = []
  public categorieSelected!: GetAllCategoriesResponse

}
