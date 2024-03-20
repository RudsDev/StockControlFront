import { Component, EventEmitter, Input, Output } from '@angular/core';

import { GetAllCategoriesResponse } from '../../../../models/interfaces/categories/response/GetAllCategoriesResponse';
import { EditCategoryEvent } from '../../../../models/interfaces/categories/events/EditCategoryEvent';
import { CategoryEvent } from '../../../../models/enums/categories/CategoryEvent';
import { DeleteCategoryAction } from '../../../../models/enums/categories/DeleteCategoryAction';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrl: './categories-table.component.scss'
})
export class CategoriesTableComponent {

  @Input() public categories: Array<GetAllCategoriesResponse> = []
  @Output() categoryEvent = new EventEmitter<EditCategoryEvent>()
  @Output() deleteCategoryEvent = new EventEmitter<DeleteCategoryAction>()

  public categorieSelected!: GetAllCategoriesResponse
  public addCategoryEvent = CategoryEvent.ADD_CATEGORY_ITEM
  public editCategoryEvent = CategoryEvent.EDIT_CATEGORY_ITEM

  public handleDeleteProduct(id: string, name:string):void {
    if(!id || !name) return
    this.deleteCategoryEvent.emit({ id, name })
  }

  public handleCategoryEvent(action: string, id?:string, categoryName?: string):void{
    if(action) {
      this.categoryEvent.emit({ id, action, categoryName });
    }
  }

}
