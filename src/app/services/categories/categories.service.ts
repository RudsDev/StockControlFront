import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '../../../environments/environment';
import { GetAllCategoriesResponse } from '../../models/interfaces/categories/response/GetAllCategoriesResponse';
import { CreateCategoryResponse } from '../../models/interfaces/categories/response/CreateCategoryResponse';
import { CreateCategoryRequest } from '../../models/interfaces/categories/request/CreateCategoryRequest';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookieService.get(environment.USER_COOKIE);
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getAllCategories(): Observable<Array<GetAllCategoriesResponse>> {
    return this.http
    .get<Array<GetAllCategoriesResponse>>(
      `${this.API_URL}/categories`,
      this.httpOptions
    );
  }

  deleteCategory(category_id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/category/delete`, {
      ...this.httpOptions,
      params: { category_id }
    })
  }

  createCategory(categoryData: CreateCategoryRequest): Observable<CreateCategoryResponse> {
    return this.http.post<CreateCategoryResponse>(
      `${this.API_URL}/category`,
      categoryData,
      this.httpOptions
    )
  }
}
