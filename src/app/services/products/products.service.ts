import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';
import { GetAllProductsResponse } from '../../models/interfaces/products/response/GetAllProductsResponse';
import { DeleteProductsResponse } from '../../models/interfaces/products/response/DeleteProductsResponse';

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
}
