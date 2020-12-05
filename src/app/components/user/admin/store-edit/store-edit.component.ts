import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { StoreService } from '../../../../services/store.service';
import { ActivatedRoute } from '@angular/router';
import { StoreModel, UserModel } from '../../../../model/models';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddNewStoreComponent } from '../../../store/add-new-store/add-new-store.component';

declare function confirmation(): boolean;

@Component( {
              selector: 'app-store-edit',
              templateUrl: './store-edit.component.html',
              styleUrls: [ './store-edit.component.css' ]
            } )
export class StoreEditComponent implements OnInit, OnDestroy {

  stores: StoreModel[] = [];
  allStores: StoreModel[] = [];
  users: UserModel[] = [];
  postalCode: string = '';
  city: string = '';
  province: string = '';
  country: string = '';

  storeSub: Subscription;
  userSub: Subscription;
  managerId: string;

  constructor( private storeService: StoreService,
               private userService: UserService,
               private route: ActivatedRoute,
               private matDialog: MatDialog ) {
  }

  ngOnInit(): void {

    this.storeSub = this.storeService.fetchStore()
                        .valueChanges()
                        .subscribe( value => {
                          if ( value?.length > 0 ) {
                            this.allStores = value;
                            this.stores = this.allStores;
                          }
                        } );

    this.userSub = this.userService.fetchUser()
                       .valueChanges()
                       .subscribe( value => {
                         if ( value?.length > 0 ) {
                           this.users = value.filter( value1 => !value1.disabled );
                         }
                       } );
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.userSub.unsubscribe();
  }

  updateStoreStatus( store: StoreModel ) {
    this.storeService.updateStore( store );
    // this.users.filter(value => value.savedStore === store.sId).forEach(value => value.savedStore = "");
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

  keyPress( $event: KeyboardEvent, num: number ): void {
    if ( $event.key === 'Enter' ) {
      this.filter( num );
    }
  }

  getManagerName( manager: string ) {
    if ( this.users?.length > 0 ) {
      return this.users.filter( value => value.uId === manager )[0].uName;
    }
  }

  removeManager( manager: string, store: StoreModel ): void {
    store.sManagerIds.splice( store.sManagerIds.indexOf( manager ), 1 );
    if ( store.sManagerIds.length === 0 ) {
      store.status = false;
      this.users.filter( value => value.savedStore === store.sId ).forEach( value => value.savedStore = '' );
    }
    this.storeService.updateStore( store );

    const m: UserModel = this.users.filter( value => value.uId === manager )[0];
    m.mStoreIds.splice( m.mStoreIds.indexOf( store.sId ), 1 );
    this.userService.updateUser( m );

  }

  addStoreManager( store: StoreModel ): void {
    if ( this.managerId.length > 0 ) {
      if ( !store.sManagerIds.some( value => value === this.managerId ) ) {
        store.sManagerIds.push( this.managerId );
        if ( !store.status ) {
          store.status = true;
        }
        this.storeService.updateStore( store );

        const temp = this.users.filter(
          value => value.uId === this.managerId )[0];

        if ( !temp.mStoreIds ) {
          temp.mStoreIds = [];
        }

        temp.mStoreIds.push( store.sId );
        this.userService.updateUser( temp );
        this.managerId = '';
      }
    }
  }

  getAvailableManagers( store: StoreModel ) {
    return this.users.filter( user => user.uType === 'manager' && !store.sManagerIds.some( value => value === user.uId ) );
  }

  addNewStore() {
    const dialogRef = this.matDialog.open( AddNewStoreComponent, {} );
  }

  removeStore( store: StoreModel ) {
    if ( confirmation() ) {
      const sId = store.sId;
      for ( let user of this.users ) {
        if ( user.uType === 'customer' && user.preferedStore === sId ) {
          user.preferedStore = '';
          this.userService.updateUser( user );
        }
        if ( user.uType === 'manager' && user.mStoreIds.some( id => id === sId ) ) {
          user.mStoreIds.splice( user.mStoreIds.indexOf( sId ), 1 );
          this.userService.updateUser( user );
        }
      }

      this.storeService.deleteStore( store );

      this.userService.showToast( 'Store ' + store.sName + ' has been successfully removed!!!' );

    }
  }
}
