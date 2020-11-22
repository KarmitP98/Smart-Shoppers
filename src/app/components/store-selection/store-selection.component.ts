import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { StoreModel, UserModel } from '../../model/models';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { StoreService } from '../../services/store.service';
import { UserService } from '../../services/user.service';

@Component( {
              selector: 'app-store-selection',
              templateUrl: './store-selection.component.html',
              styleUrls: [ './store-selection.component.css' ]
            } )
export class StoreSelectionComponent implements OnInit, OnDestroy {

  allStores: StoreModel[] = [];
  stores: StoreModel[] = this.allStores;
  multi = false;
  storeSub: Subscription;
  postalCode: string = '';
  city: string = '';
  province: string = '';
  country: string = '';
  chosen: string;


  constructor( @Inject( MAT_DIALOG_DATA ) public data: UserModel,
               private storeService: StoreService,
               private userService: UserService,
               private dialog: MatDialog ) {


    if ( this.data.preferedStore ) {
      this.chosen = this.data.preferedStore;
    }

    this.storeSub = this.storeService.fetchStore()
                        .valueChanges()
                        .subscribe( value => {
                          if ( value?.length > 0 ) {
                            this.allStores = value.sort(
                              a => a.sId === this.data.preferedStore ? -1 : 1 );
                            this.stores = this.allStores;
                          }
                        } );

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

  filter( type: number ) {
    // this.stores = this.allStores;
    // this.stores = this.stores.filter(store => store)
    switch ( type ) {
      case 1:
        this.stores = this.allStores.filter(
          store => store.sCountry.toUpperCase().includes(
            this.country.toUpperCase() ) );
        break;
      case 2:
        this.stores = this.allStores.filter(
          store => store.sProvince.toUpperCase().includes(
            this.province.toUpperCase() ) );
        break;
      case 3:
        this.stores = this.allStores.filter(
          store => store.sCity.toUpperCase().includes(
            this.city.toUpperCase() ) );
        break;
      case 4:
        this.stores = this.allStores.filter(
          store => store.sPostalCode.toUpperCase().includes(
            this.postalCode.toUpperCase() ) );
        break;
    }

  }

  selectStore( store: StoreModel ): void {
    this.chosen = store.sId;
  }

  isSelected( store: StoreModel ): boolean {
    return this.chosen === store.sId;
  }

  colorSelector(): any {
    return Math.random() > 0.3 ? 'primary' : Math.random() > 0.6 ? 'accent' : 'warn';
  }

  keyPress( $event: KeyboardEvent, num: number ): void {
    if ( $event.key === 'Enter' ) {
      this.filter( num );
    }
  }

  addStore( save: boolean ) {
    if ( save ) {
      this.data.preferedStore = this.chosen;
      this.userService.updateUser( this.data );
    }

    this.dialog.closeAll();

  }
}
