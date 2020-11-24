import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListItem, StoreModel, UserModel } from '../../model/models';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import firebase from 'firebase';
import { StoreService } from '../../services/store.service';
import Timestamp = firebase.firestore.Timestamp;

@Component( {
              selector: 'app-shoppinp-list-view',
              templateUrl: './shoppinp-list-view.component.html',
              styleUrls: [ './shoppinp-list-view.component.css' ]
            } )
export class ShoppinpListViewComponent implements OnInit, OnDestroy {

  user: UserModel;
  userSub: Subscription;

  storeSub: Subscription;
  stores: StoreModel[] = [];

  constructor( private route: ActivatedRoute,
               private userService: UserService,
               private storeService: StoreService ) { }

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
    this.userService.updateUser( this.user );

    this.reset();
  }

  changeQuantity( item: ListItem, num: number ): void {
    if ( item.iQuantity > 0 && item.iQuantity < item.item.iStoreQuantity ) {
      item.iQuantity += num;
      this.userService.updateUser( this.user );
    }
  }

  getCurrentShoppingList() {
    return this.user.shoppingLists;
    // return this.user.shoppingLists.filter(
    //   list => list.sId === this.user.preferedStore );
  }

  private reset(): void {
    this.user.currentShoppingList = {
      sStatus: 'pending',
      sId: this.user.preferedStore,
      sItems: [],
      date: Timestamp.now(),
      lName: this.getStoreName() + ' - ' + Timestamp.now().toDate()
                                                    .toDateString()
    };

    this.userService.updateUser( this.user );
  }

  private getStoreName() {
    return this.stores.filter(
      value => value.sId === this.user.preferedStore )[0].sName;
  }
}
