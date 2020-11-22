import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { StoreService } from '../../../../services/store.service';
import { ActivatedRoute } from '@angular/router';
import { StoreModel, UserModel } from '../../../../model/models';
import { Subscription } from 'rxjs';

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


  constructor( private storeService: StoreService,
               private userService: UserService,
               private route: ActivatedRoute ) { }

  ngOnInit(): void {

    this.storeSub = this.storeService.fetchStore()
                        .valueChanges()
                        .subscribe( value => {
                          if ( value?.length > 0 ) {
                            this.allStores = value;
                            this.stores = this.allStores;
                          }
                        } );

    this.userSub = this.userService.fetchUser( 'uType', '==', 'manager' )
                       .valueChanges()
                       .subscribe( value => {
                         if ( value?.length > 0 ) {
                           this.users = value;
                         }
                       } );
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.userSub.unsubscribe();
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

  changeStoreManager( store: StoreModel ): void {

    this.users.forEach( user => {
      if ( user.mStoreIds?.some( value => value === store.sId ) ) {
        console.log( 'Found Store' );
        if ( user.uId !== store.sId ) {
          console.log( 'Not Same ID' );
          user.mStoreIds.splice( user.mStoreIds.indexOf( store.sId ), 1 );
          this.userService.updateUser( user );
        }
      }

      if ( user.uId === store.sManagerId ) {
        console.log( 'Found User' );
        if ( !user.mStoreIds ) {
          console.log( 'No Stores' );
          user.mStoreIds = [];
        }
        user.mStoreIds.push( store.sId );
        this.userService.updateUser( user );
        console.log( 'Added Store Ids' );
      }
    } );

    this.storeService.updateStore( store );
  }

}
