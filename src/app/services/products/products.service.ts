import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';

import { DeleteProductsResponse } from '../../models/interfaces/products/response/DeleteProductsResponse';
import { GetAllProductsResponse } from '../../models/interfaces/products/response/GetAllProductsResponse';
import { CreateProductRequest } from '../../models/interfaces/products/request/CreateProductRequest';
import { CreateProductResponse } from '../../models/interfaces/products/response/CreateProductResponse';
import { EditProductRequest } from '../../models/interfaces/products/request/EditProductRequest';
import { EditProductResponse } from '../../models/interfaces/products/response/EditProductResponse';
import { SaleProductRequest } from '../../models/interfaces/products/request/SaleProductRequest';
import { SaleProductResponse } from '../../models/interfaces/products/response/SaleProductResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookieService.get(environment.USER_COOKIE);
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getAllProducts(): Observable<Array<GetAllProductsResponse>> {
    const filter = map((p: GetAllProductsResponse[]) => p.filter(d => !!d.amount));
    return this.http
    .get<Array<GetAllProductsResponse>>(
      `${this.API_URL}/products`,
      this.httpOptions
    )
    .pipe(filter)
    ;
  }

  deleteProduct(product_id: string): Observable<DeleteProductsResponse> {
    return this.http.delete<DeleteProductsResponse>(`${this.API_URL}/product/delete`, {
      ...this.httpOptions,
      params: { product_id }
    })
  }

  createProduct(productData: CreateProductRequest): Observable<CreateProductResponse> {
    return this.http.post<CreateProductResponse>(
      `${this.API_URL}/product`,
      productData,
      this.httpOptions
    )
  }

  editProduct(productData: EditProductRequest): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/product/edit`,
      productData,
      this.httpOptions
    )
  }

  saleProduct(saleData: SaleProductRequest): Observable<SaleProductResponse> {
    return this.http.put<SaleProductResponse>(
      `${this.API_URL}/product/sale`,
      {
        amount: saleData.amount
      },
      {
        ...this.httpOptions,
        params: {
          product_id: saleData.product_id
        }
      },
    )
  }
}
