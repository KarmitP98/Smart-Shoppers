import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemDetailModel, ItemModel, ListItem, StoreModel, UserModel } from '../../model/models';
import { StoreService } from '../../services/store.service';
import { Subscription } from 'rxjs';
import { CATEGORIES } from '../../shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { ItemCardDetailComponent } from '../item-card/item-card-detail/item-card-detail.component';
import { opacityLoadTrigger, pushTrigger } from '../../shared/animations';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import firebase from 'firebase';
import { ItemService } from '../../services/item.service';
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
  itemSub: Subscription;
  allItems: ItemDetailModel[];
  newItem: ItemDetailModel;

  constructor( private storeService: StoreService,
               private userService: UserService,
               private dialog: MatDialog,
               private route: ActivatedRoute,
               private itemService: ItemService ) {
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

    this.itemSub = this.itemService.fetchItems()
                       .valueChanges()
                       .subscribe( value => {
                         this.allItems = value;
                       } );

  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.storeSub.unsubscribe();
    this.itemSub.unsubscribe();
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

  getSuggestions() {
    return this.store.sItems.concat().sort( ( a, b ) => a.iBought > b.iBought ? 1 : -1 ).slice( 0, 4 );
  }


  showItemDetail( item: any ): void {
    const dialogRef = this.dialog.open( ItemCardDetailComponent, {
      data: { item, user: this.user, store: this.store }
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
      this.userService.showToast(
        item.itemDetail.iName + ' has been added to the Shopping List!',
        1000 );
    } else {

      for ( const sItem of this.user.currentShoppingList.sItems ) {
        if ( sItem.item.itemDetail.iName === item.itemDetail.iName && sItem.iStoreId === this.store.sId ) {
          found = true;
          if ( sItem.iQuantity < item.iStoreQuantity ) {
            sItem.iQuantity += 1;
            this.userService.showToast(
              item.itemDetail.iName + ' has been added to the Shopping List!',
              1000 );
          } else {
            this.userService.showToast(
              item.itemDetail.iName + ' has reached maximum in-stock items!',
              1000 );
          }
        }
      }

      if ( !found ) {
        this.user.currentShoppingList.sItems.push( listItem );
        this.userService.showToast(
          item.itemDetail.iName + ' has been added to the Shopping List!',
          1000 );
      }
    }
    this.userService.updateUser( this.user );
  }

  addItemToStore( itemDetail: ItemDetailModel ) {
    this.store.sItems.push( {
                              itemDetail,
                              onSale: false,
                              iBought: Math.round( (Math.random() * 50) + 1 ),
                              isle: this.getIsle( itemDetail.iCategory ),
                              iStatus: 'stock',
                              price: itemDetail.iPrice * this.store.sPriceMult,
                              iStoreQuantity: 10,
                              oldPrice: 0
                            } );
    this.storeService.updateStore( this.store );
    this.newItem = null;
  }

  public getAvailableItems() {
    return this.allItems
               .filter( item => !this.store.sItems.some( value => value.itemDetail === item ) )
               .sort( ( a, b ) => this.getIsle( a.iCategory ) > this.getIsle( b.iCategory ) ? 1 : -1 );
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
      if ( this.user.shoppingLists ) {
        for ( let sl of this.user.shoppingLists ) {
          if ( sl.sId === this.user.currentShoppingList.sId && sl.sStatus === 'pending' ) {
            sl = this.user.currentShoppingList;
            found = true;
          }
        }
      }

      if ( !found ) {
        if ( this.user.currentShoppingList.sItems.length > 0 ) {
          if ( !this.user.shoppingLists ) {
            this.user.shoppingLists = [];
          }
          this.user.shoppingLists.push( this.user.currentShoppingList );
        }
      }

      this.userService.updateUser( this.user );


      found = false;

      if ( this.user.shoppingLists ) {
        for ( let sl of this.user.shoppingLists ) {
          if ( sl.sId === this.user.preferedStore && sl.sStatus === 'pending' ) {
            this.user.currentShoppingList = sl;
            this.user.shoppingLists.splice( this.user.shoppingLists.indexOf( sl ) );
            found = true;
          }
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

  private getIsle( category: string ) {
    for ( let i = 0; i < this.categories.length; i++ ) {
      if ( this.categories[i] === category ) {
        return (i + 1);
      }
    }
  }

}
