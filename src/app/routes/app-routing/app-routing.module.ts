import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../../components/login/login.component';
import { LoginGuard } from '../../guards/login.guard';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { AuthGuard } from '../../guards/auth.guard';
import { UserComponent } from '../../components/user/user.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent, canActivate: [ LoginGuard ] },
  { path: 'signup', component: SignUpComponent, canActivate: [ LoginGuard ] },
  {
    path: ':uId', component: UserComponent, canActivate: [ AuthGuard ], canDeactivate: [ AuthGuard ], children: []
  }
];

@NgModule( {
             declarations: [],
             imports: [ RouterModule.forRoot( routes ) ],
             exports: [ RouterModule ]
           } )
export class AppRoutingModule {}
