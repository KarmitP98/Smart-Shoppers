import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemModel, ListItem, StoreModel, UserModel } from '../../model/models';
import { StoreService } from '../../services/store.service';
import { Subscription } from 'rxjs';
import { CATEGORIES } from '../../shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { ItemCardDetailComponent } from '../item-card/item-card-detail/item-card-detail.component';
import { opacityLoadTrigger, pushTrigger } from '../../shared/animations';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Component( {
              selector: 'app-store',
              templateUrl: './store.component.html',
              styleUrls: [ './store.component.css' ],
              animations: [ pushTrigger, opacityLoadTrigger ]
            } )
export class StoreComponent implements OnInit, OnDestroy {

  store: StoreModel;
  user: UserModel;
  itemName: string = '';
  category: string = '';
  categories = CATEGORIES;
  items: ItemModel[] = [];
  storeSub: Subscription;
  userSub: Subscription;

  constructor( private storeService: StoreService,
               private userService: UserService,
               private dialog: MatDialog,
               private route: ActivatedRoute ) {
  }

  ngOnInit(): void {
    const uId = this.route.snapshot.parent.parent.params.uId;
    const sId = this.route.snapshot.params.sId;

    this.fetchStore( sId );

    this.userSub = this.userService.fetchUser( 'uId', '==', uId )
                       .valueChanges()
                       .subscribe( value => {
                         if ( value?.length > 0 ) {
                           this.user = value[0];
                           if ( this.user.uType === 'customer' ) {

                             setTimeout( () => {
                               this.updateUserShoppingList();
                               this.userSub.unsubscribe();
                             }, 500 );
                           }
                         }
                       } );

  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.storeSub.unsubscribe();
  }

  search( sale: boolean ) {
    if ( sale ) {
      return this.store.sItems.filter( value => !value.onSale );
    } else if ( this.category ) {
      return this.store.sItems.filter(
        item => !item.onSale && item.itemDetail.iCategory === this.category &&
          item.itemDetail.iName.toLowerCase().includes(
            this.itemName.toLowerCase() ) );
    } else {
      return this.store.sItems.filter(
        item => !item.onSale && item.itemDetail.iName.toLowerCase().includes(
          this.itemName.toLowerCase() ) );
    }
  }

  getNonSaleItems() {
    return this.store.sItems.filter( value => !value.onSale );
  }

  getSaleItems() {
    return this.store.sItems.filter( value => value.onSale ).slice( 0, 5 );
  }

  showItemDetail( item: any ): void {
    const dialogRef = this.dialog.open( ItemCardDetailComponent, {
      data: { item, user: this.user, store: this.store },
      width: '50vw',
      height: '65vh'
    } );

    dialogRef.afterClosed().subscribe( result => {
      if ( result ) {
        console.log( result );
      }
    } );
  }

  public getStoreName() {
    return setTimeout( () => {
      return this.store.sName;
    }, 500 );

  }

  addToList( item: ItemModel ): void {

    const listItem: ListItem = {
      item: item,
      iQuantity: 1,
      iStoreId: this.store.sId,
      iStoreName: this.store.sName,
      iSize: 2
    };


    let found: boolean = false;

    if ( !this.user.currentShoppingList ) {
      this.user.currentShoppingList = {
        sId: this.user.preferedStore,
        sStatus: 'pending',
        sItems: [ listItem ],
        lName: this.getStoreName() + ' - ' + Timestamp.now().toDate()
                                                      .toDateString(),
        date: Timestamp.now()
      };
    } else {

      for ( const sItem of this.user.currentShoppingList.sItems ) {
        if ( sItem.item.itemDetail.iName === item.itemDetail.iName && sItem.iStoreId === this.store.sId ) {
          found = true;
          sItem.iQuantity += 1;
        }
      }

      if ( !found ) {
        this.user.currentShoppingList.sItems.push( listItem );
      }
    }
    this.userService.updateUser( this.user );

    this.userService.showToast(
      item.itemDetail.iName + ' has been added to the Shopping List!',
      1000 );

  }

  private fetchStore( sId: any ): void {
    this.storeSub = this.storeService.fetchStore( 'sId', '==',
                                                  sId )
                        .valueChanges()
                        .subscribe( value => {
                          if ( value?.length > 0 ) {
                            value[0].sItems.sort(
                              ( a, b ) => a.isle < b.isle ? -1 : 1 );
                            this.store = value[0];
                          }
                        } );

  }

  private updateUserShoppingList(): void {

    if ( !this.user.currentShoppingList ) {

      this.user.currentShoppingList = {
        sId: this.user.preferedStore,
        sStatus: 'pending',
        sItems: [],
        date: Timestamp.now(),
        lName: this.store.sName + ' - ' + Timestamp.now()
                                                   .toDate()
                                                   .toDateString()
      };

    } else {

      let found = false;
      for ( let sl of this.user.shoppingLists ) {
        if ( sl.sId === this.user.currentShoppingList.sId && sl.sStatus === 'pending' ) {
          sl = this.user.currentShoppingList;
          found = true;
        }
      }

      if ( !found ) {
        if ( this.user.currentShoppingList.sItems.length > 0 ) {
          this.user.shoppingLists.push( this.user.currentShoppingList );
        }
      }

      this.userService.updateUser( this.user );


      found = false;

      for ( let sl of this.user.shoppingLists ) {
        if ( sl.sId === this.user.preferedStore && sl.sStatus === 'pending' ) {
          this.user.currentShoppingList = sl;
          this.user.shoppingLists.splice( this.user.shoppingLists.indexOf( sl ) );
          found = true;
        }
      }

      if ( !found ) {
        this.user.currentShoppingList = {
          sId: this.user.preferedStore,
          sStatus: 'pending',
          sItems: [],
          date: Timestamp.now(),
          lName: this.store.sName + ' - ' + Timestamp.now()
                                                     .toDate()
                                                     .toDateString()
        };
      }

    }
    this.userService.updateUser( this.user );

  }

}
