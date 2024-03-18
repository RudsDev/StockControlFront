import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SidebarModule } from 'primeng/sidebar'
import { ButtonModule } from 'primeng/button'
import { ToolbarModule } from 'primeng/toolbar'
import { CardModule } from 'primeng/card'
import { ToastModule } from 'primeng/toast'

import { ChartModule } from 'primeng/chart';

import { MessageService } from 'primeng/api';

import { CookieService } from 'ngx-cookie-service';

import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';

import { DASHBOARD_ROUTES } from './dashoboard.routing';
import { SharedModule } from '../../shared/shared.module';




@NgModule({
  declarations: [
    DashboardHomeComponent
  ],
  imports: [
    SharedModule,
    ChartModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule
  ],
  providers: [
    MessageService,
    CookieService
  ]
})
export class DashboardModule { }
