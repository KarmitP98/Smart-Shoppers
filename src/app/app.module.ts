import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment.prod';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AppRoutingModule } from './routes/app-routing/app-routing.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CustomerComponent } from './components/user/customer/customer.component';
import { ManagerComponent } from './components/user/manager/manager.component';
import { AdminComponent } from './components/user/admin/admin.component';
import { UserComponent } from './components/user/user.component';
import { ShoppinpListViewComponent } from './components/shoppinp-list-view/shoppinp-list-view.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { StoreSelectionComponent } from './components/store-selection/store-selection.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ManagerEditComponent } from './components/user/admin/manager-edit/manager-edit.component';
import { StoreEditComponent } from './components/user/admin/store-edit/store-edit.component';
import { MatListModule } from '@angular/material/list';
import { StoreComponent } from './components/store/store.component';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { ItemCardDetailComponent } from './components/item-card/item-card-detail/item-card-detail.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoresComponent } from './components/user/manager/stores/stores.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { AddNewStoreComponent } from './components/store/add-new-store/add-new-store.component';
import { AddManagerComponent } from './components/user/manager/add-manager/add-manager.component';

@NgModule( {
             declarations: [
               AppComponent,
               LoginComponent,
               SignUpComponent,
               CustomerComponent,
               ManagerComponent,
               AdminComponent,
               UserComponent,
               ShoppinpListViewComponent,
               StoreSelectionComponent,
               ManagerEditComponent,
               StoreEditComponent,
               StoreComponent,
               ItemCardComponent,
               ItemCardDetailComponent,
               StoresComponent,
               AddNewStoreComponent,
               AddManagerComponent
             ],
             imports: [
               BrowserModule,
               AppRoutingModule,
               BrowserAnimationsModule,
               MatFormFieldModule,
               MatProgressSpinnerModule,
               MatMenuModule,
               MatIconModule,
               MatButtonModule,
               FormsModule,
               MatToolbarModule,
               MatFormFieldModule,
               MatSelectModule,
               MatDatepickerModule,
               MatNativeDateModule,
               MatSlideToggleModule,
               MatInputModule,
               MatSnackBarModule, MatCardModule,
               MatTableModule,
               MatPaginatorModule,
               MatExpansionModule,
               MatBadgeModule,
               MatGridListModule,
               MatButtonToggleModule,
               MatSidenavModule,
               MatListModule,
               MatProgressBarModule,
               MatChipsModule,
               AngularFireModule.initializeApp( environment.firebaseConfig ),
               FormsModule, MatDialogModule, MatTooltipModule
               // ReactiveFormsModule
             ],
             providers: [],
             bootstrap: [ AppComponent ]
           } )
export class AppModule {
}
