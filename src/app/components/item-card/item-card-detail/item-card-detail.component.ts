import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  ItemModel,
  ListItem,
  StoreModel,
  UserModel
} from '../../../model/models';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Component( {
              selector: 'app-item-card-detail',
              templateUrl: './item-card-detail.component.html',
              styleUrls: [ './item-card-detail.component.css' ]
            } )
export class ItemCardDetailComponent implements OnInit {

  quantity: number = 1;
  size: number = 1;

  constructor( @Inject(
    MAT_DIALOG_DATA ) public data: { item: ItemModel, user: UserModel, store: StoreModel },
               private userService: UserService,
               private snackBar: MatSnackBar ) { }

  ngOnInit(): void {
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

  }

  public showToast( message, time? ) {
    this.snackBar.open( message,
                        'Close',
                        {
                          duration: time || 2000,
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          politeness: 'assertive'
                        } );
  }

  private getStoreName(): any {
    return this.data.store.sName;
  }
}
