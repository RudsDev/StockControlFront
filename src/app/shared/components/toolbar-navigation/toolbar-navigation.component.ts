import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { ProductEvent } from '../../../models/enums/products/ProductEvent';
import { ProductFormComponent } from '../../../modules/products/components/product-form/product-form.component';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrl: './toolbar-navigation.component.scss'
})
export class ToolbarNavigationComponent {

  constructor(
    private cookieService: CookieService,
    private dialogService: DialogService,
    private router: Router,
  ) {}

  handleLogout():void {
    this.cookieService.delete(environment.USER_COOKIE)
    void this.router.navigate(['/home'])
  }

  handleSaleProduct() {
    const action = ProductEvent.SALE_PRODUCT_ITEM
    this.dialogService.open(
      ProductFormComponent,
      {
        header: action,
        width: '70%',
        contentStyle: {
          overflow: 'auto'
        },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: { action }
        }
       }
    )
  }
}
