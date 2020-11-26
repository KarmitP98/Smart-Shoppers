import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';
import { LoginGuard } from '../../guards/login.guard';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { AuthGuard } from '../../guards/auth.guard';
import { UserComponent } from '../../components/user/user.component';
import { ManagerEditComponent } from '../../components/user/admin/manager-edit/manager-edit.component';
import { StoreEditComponent } from '../../components/user/admin/store-edit/store-edit.component';
import { CustomerComponent } from '../../components/user/customer/customer.component';
import { ManagerComponent } from '../../components/user/manager/manager.component';
import { AdminComponent } from '../../components/user/admin/admin.component';
import { StoreComponent } from '../../components/store/store.component';
import { ShoppinpListViewComponent } from '../../components/shoppinp-list-view/shoppinp-list-view.component';
import { StoresComponent } from '../../components/user/manager/stores/stores.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent, canActivate: [ LoginGuard ] },
  { path: 'signup', component: SignUpComponent, canActivate: [ LoginGuard ] },
  {
    path: ':uId',
    component: UserComponent,
    canActivate: [ AuthGuard ],
    canActivateChild: [ AuthGuard ],
    children: [
      {
        path: 'customer', component: CustomerComponent, children: [
          { path: 'shopping-list', component: ShoppinpListViewComponent },
          { path: ':sId', component: StoreComponent }
        ]
      },
      {
        path: 'manager', component: ManagerComponent, children: [
          { path: '', redirectTo: 'stores', pathMatch: 'full' },
          { path: 'stores', component: StoresComponent },
          { path: ':sId', component: StoreComponent }
        ]
      },
      {
        path: 'admin', component: AdminComponent, children: [
          { path: '', redirectTo: 'store-edit', pathMatch: 'full' },
          { path: 'manager-edit', component: ManagerEditComponent },
          { path: 'store-edit', component: StoreEditComponent }
        ]
      }
    ]
  }
];

@NgModule( {
             declarations: [],
             imports: [ RouterModule.forRoot( routes ) ],
             exports: [ RouterModule ]
           } )
export class AppRoutingModule {}
