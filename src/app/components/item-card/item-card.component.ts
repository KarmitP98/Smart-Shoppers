import { Component, Input, OnInit } from '@angular/core';
import { ItemModel, ListItem, StoreModel, UserModel } from '../../model/models';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { StoreService } from '../../services/store.service';
import { ItemCardDetailComponent } from './item-card-detail/item-card-detail.component';

@Component( {
              selector: 'app-item-card',
              templateUrl: './item-card.component.html',
              styleUrls: [ './item-card.component.css' ]
            } )
export class ItemCardComponent implements OnInit {

  @Input() user: UserModel;
  @Input() item: ItemModel;
  @Input() store: StoreModel;
  @Input() color;

  // @ViewChild( 'card', { static: false } ) card;

  constructor( public matDialog: MatDialog,
               public userService: UserService,
               public storeService: StoreService ) {

    // if ( this.item.onSale ) {
    //   this.card.className = 'sale';
    // }

  }

  ngOnInit(): void {
  }

  addToList( item: ItemModel ): void {

    const listItem: ListItem = {
      item,
      iQuantity: 1,
      iStoreId: this.store.sId,
      iStoreName: this.store.sName,
      iSize: 2
    };


    let found: boolean = false;

    // if ( !this.user.currentShoppingList ) {
    //   this.user.currentShoppingList = {
    //     sId: this.user.preferedStore,
    //     sStatus: 'pending',
    //     sItems: [ listItem ],
    //     lName: this.getStoreName() + ' - ' + Timestamp.now().toDate()
    //                                                   .toDateString(),
    //     date: Timestamp.now()
    //   };
    //   this.userService.showToast(
    //     item.itemDetail.iName + ' has been added to the Shopping List!',
    //     1000 );
    // } else {

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
    // }
    this.userService.updateUser( this.user );
  }

  showItemDetail( item: any ): void {
    const dialogRef = this.matDialog.open( ItemCardDetailComponent, {
      data: { item, user: this.user, store: this.store }
    } );

    dialogRef.afterClosed().subscribe( result => {
      if ( result ) {
        console.log( result );
      }
    } );
  }

}
