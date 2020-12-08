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
  newPrice: number = 10;
  onSaleDate: Timestamp = Timestamp.now();
  onSale: boolean;
  price: number;

  @ViewChild( 'f', { static: true } ) f: NgForm;

  constructor( @Inject(
    MAT_DIALOG_DATA ) public data: { item: ItemModel, user: UserModel, store: StoreModel },
               private userService: UserService,
               private snackBar: MatSnackBar,
               private matDialog: MatDialog,
               private storeService: StoreService ) {

    this.onSale = this.data.item.onSale;
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
      this.showToast(
        this.data.item.itemDetail.iName + ' has been added to the Shopping List!',
        1000 );
    } else {

      for ( const sItem of this.data.user.currentShoppingList.sItems ) {
        if ( sItem.item.itemDetail.iName === this.data.item.itemDetail.iName && sItem.iStoreId === this.data.store.sId ) {
          found = true;
          if ( sItem.iQuantity < this.data.item.iStoreQuantity ) {
            sItem.iQuantity += this.quantity;
            this.showToast(
              this.data.item.itemDetail.iName + ' has been added to the Shopping List!',
              1000 );
          } else {
            this.showToast(
              this.data.item.itemDetail.iName + ' has reached the maximum in-store quantity!',
              1000 );
          }
        }
      }

      if ( !found ) {
        this.data.user.currentShoppingList.sItems.push( listItem );
        this.showToast(
          this.data.item.itemDetail.iName + ' has been added to the Shopping List!',
          1000 );
      }
    }
    this.userService.updateUser( this.data.user );


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

    this.data.item.onSale = this.onSale;
    if ( this.onSale ) {
      this.data.item.oldPrice = this.data.item.price;
      this.data.item.price = this.newPrice;
      this.data.item.onSaleDate = this.onSaleDate;
    } else if ( !this.onSale ) {
      this.data.item.price = this.data.item.oldPrice;
    }


    this.storeService.updateStore( this.data.store );
    this.showToast( 'Item has been updated!' );
    this.matDialog.closeAll();
  }

  removeItem() {
    this.data.store.sItems.splice( this.data.store.sItems.indexOf( this.data.item ), 1 );
    this.storeService.updateStore( this.data.store );
    this.showToast( this.data.item.itemDetail.iName + ' has been remove from ' + this.data.store.sName + '!!!' );
    this.matDialog.closeAll();
  }
}
