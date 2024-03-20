import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { SidebarModule } from 'primeng/sidebar'
import { ButtonModule } from 'primeng/button'
import { ToolbarModule } from 'primeng/toolbar'
import { CardModule } from 'primeng/card'
import { ToastModule } from 'primeng/toast'
import { TableModule } from 'primeng/table'
import { InputMaskModule } from 'primeng/inputmask'
import { InputSwitchModule } from 'primeng/inputswitch'
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { InputNumberModule } from 'primeng/inputnumber'
import { DropdownModule } from 'primeng/dropdown'
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';

import { ConfirmationService } from 'primeng/api';

import { SharedModule } from '../../shared/shared.module';

import { CATEGORIES_ROUTES } from './categories.routing';


import { CategoriesHomeComponent } from './page/categories-home/categories-home.component';
import { CategoriesTableComponent } from './components/categories-table/categories-table.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';



@NgModule({
  declarations: [
    CategoriesHomeComponent,
    CategoriesTableComponent,
    CategoryFormComponent
  ],
  imports: [
    SharedModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(CATEGORIES_ROUTES),
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    TableModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    TooltipModule,
  ],
  providers:[
    DialogService,
    ConfirmationService
  ]
})
export class CategoriesModule { }
