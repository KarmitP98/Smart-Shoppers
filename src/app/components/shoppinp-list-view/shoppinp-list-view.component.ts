import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListItem, ShoppingList, StoreModel, UserModel } from '../../model/models';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import firebase from 'firebase';
import { StoreService } from '../../services/store.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import Timestamp = firebase.firestore.Timestamp;

@Component( {
              selector: 'app-shoppinp-list-view',
              templateUrl: './shoppinp-list-view.component.html',
              styleUrls: [ './shoppinp-list-view.component.css' ]
            } )
export class ShoppinpListViewComponent implements OnInit, OnDestroy {

  user: UserModel;
  userSub: Subscription;

  @ViewChild( 'panel', { static: false } ) panel: MatExpansionPanel;

  storeSub: Subscription;
  stores: StoreModel[] = [];

  constructor( private route: ActivatedRoute,
               public userService: UserService,
               public storeService: StoreService ) {
  }

  ngOnInit(): void {
    const uId = this.route.snapshot.parent.parent.params.uId;
    this.userSub = this.userService.fetchUser( 'uId', '==', uId )
                       .valueChanges()
                       .subscribe( value => {
                         if ( value?.length > 0 ) {
                           this.user = value[0];
                         }
                       } );

    this.storeSub = this.storeService.fetchStore()
                        .valueChanges()
                        .subscribe( value => {
                          if ( value?.length > 0 ) {
                            this.stores = value;
                          }
                        } );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.storeSub.unsubscribe();
  }

  saveShoppingList( b: boolean ): void {

    this.user.currentShoppingList.sStatus = b ? 'saved' : 'cancelled';
    this.user.currentShoppingList.sId = Timestamp.now().toDate().toDateString();

    if ( !this.user.shoppingLists ) {
      this.user.shoppingLists = [];
    }
    this.user.shoppingLists.push( this.user.currentShoppingList );
    // this.userService.updateUser( this.user );

    this.reset();
  }

  changeQuantity( item: ListItem, num: number ): void {

    item.iQuantity += num;

    if ( item.iQuantity === 0 ) {
      this.removeItem( item );
    } else {
      this.userService.updateUser( this.user );
    }
  }

  removeItem( item: ListItem ) {
    for ( let i = 0; i < this.user.currentShoppingList.sItems.length; i++ ) {
      if ( this.user.currentShoppingList.sItems[i].item === item.item ) {
        this.user.currentShoppingList.sItems.splice( i, 1 );
      }
    }
    this.userService.updateUser( this.user );
  }

  getCurrentShoppingList() {
    return this.user.shoppingLists;
  }

  public getStore( sId ) {
    return this.stores.filter(
      value => value.sId === sId )[0];
  }

  getItemSize( iSize: number ) {
    switch ( iSize ) {
      case 1:
        return 'Small';
      case 2:
        return 'Medium';
      case 3:
        return 'Large';
      default:
        return 'X-Large';
    }
  }

  getCurrentItems( list: ShoppingList ) {
    return list.sItems.sort( ( a, b ) => a.item.isle > b.item.isle ? 1 : -1 );
  }

  getListStatus( list: ShoppingList ): any {
    return list.sStatus === 'pending' ? 'current-panel' : list.sStatus === 'cancelled' ? 'declined-panel' : 'approved-panel';
  }

  private reset(): void {
    const sId = this.user.preferedStore.length === 0 ? this.user.savedStore : this.user.preferedStore;
    this.user.currentShoppingList = {
      sStatus: 'pending',
      sId,
      sItems: [],
      date: Timestamp.now(),
      lName: this.getStore( sId ).sName + ' - ' + Timestamp.now().toDate().toDateString()
    };

    this.userService.updateUser( this.user );
  }
}
