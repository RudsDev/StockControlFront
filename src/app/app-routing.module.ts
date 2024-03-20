import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { DashboardHomeComponent } from './modules/dashboard/page/dashboard-home/dashboard-home.component';
import { AuthGuardRouteService } from './guards/auth-guard-route.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuardRouteService],
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) //lazy loading
  },
  {
    path: 'products',
    canActivate: [AuthGuardRouteService],
    loadChildren: () => import('./modules/products/products.module').then(m => m.ProductsModule) //lazy loading
  },
  {
    path: 'categories',
    canActivate: [AuthGuardRouteService],
    loadChildren: () => import('./modules/categories/categories.module').then(m => m.CategoriesModule) //lazy loading
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        preloadingStrategy: PreloadAllModules,
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
