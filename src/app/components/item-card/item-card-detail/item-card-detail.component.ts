import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ItemModel, ListItem, StoreModel, UserModel } from '../../../model/models';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase';
import { StoreService } from '../../../services/store.service';
import { NgForm } from '@angular/forms';
import Timestamp = firebase.firestore.Timestamp;

@Component( {
              selector: 'app-item-card-detail',
              templateUrl: './item-card-detail.component.html',
              styleUrls: [ './item-card-detail.component.css' ]
            } )
export class ItemCardDetailComponent implements OnInit {

  quantity: number = 1;
  size: number = 2;
  available: number[] = [];
  newPrice: number = 0;

  @ViewChild( 'f', { static: true } ) f: NgForm;

  constructor( @Inject(
    MAT_DIALOG_DATA ) public data: { item: ItemModel, user: UserModel, store: StoreModel },
               private userService: UserService,
               private snackBar: MatSnackBar,
               private matDialog: MatDialog,
               private storeService: StoreService ) {
  }

  ngOnInit(): void {
    for ( let i = 1; i <= this.data.item.iStoreQuantity; i++ ) {
      this.available.push( i );
    }
    if ( this.data.item.onSale ) {
      this.newPrice = this.data.item.price;
    }
  }

  addToList(): void {

    const listItem: ListItem = {
      item: this.data.item,
      iQuantity: this.quantity,
      iStoreId: this.data.store.sId,
      iStoreName: this.data.store.sName,
      iSize: this.size
    };

    let found: boolean = false;

    if ( !this.data.user.currentShoppingList ) {
      this.data.user.currentShoppingList = {
        sId: this.data.user.preferedStore,
        sStatus: 'pending',
        sItems: [ listItem ],
        lName: this.getStoreName() + ' - ' + Timestamp.now().toDate()
                                                      .toDateString(),
        date: Timestamp.now()
      };
    } else {

      for ( const sItem of this.data.user.currentShoppingList.sItems ) {
        if ( sItem.item.itemDetail.iName === this.data.item.itemDetail.iName && sItem.iStoreId === this.data.store.sId ) {
          found = true;
          sItem.iQuantity += this.quantity;
        }
      }

      if ( !found ) {
        this.data.user.currentShoppingList.sItems.push( listItem );
      }
    }
    this.userService.updateUser( this.data.user );

    this.showToast(
      this.data.item.itemDetail.iName + ' has been added to the Shopping List!',
      1000 );

    this.matDialog.closeAll();

  }

  public showToast( message, time? ) {
    this.snackBar.open( message,
                        'Close',
                        {
                          duration: time || 2000,
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          politeness: 'polite'
                        } );
  }

  private getStoreName(): any {
    return this.data.store.sName;
  }

  saveItem() {
    if ( this.data.item.onSale ) {
      this.data.item.oldPrice = this.data.item.price;
      this.data.item.price = this.newPrice;
    }

    this.storeService.updateStore( this.data.store );
    this.showToast( 'Item has been updated!' );
    this.matDialog.closeAll();
  }
}
