import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListItem, UserModel } from '../../model/models';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Component( {
              selector: 'app-shoppinp-list-view',
              templateUrl: './shoppinp-list-view.component.html',
              styleUrls: [ './shoppinp-list-view.component.css' ]
            } )
export class ShoppinpListViewComponent implements OnInit, OnDestroy {

  user: UserModel;
  userSub: Subscription;

  constructor( private route: ActivatedRoute,
               private userService: UserService ) { }

  ngOnInit(): void {
    const uId = this.route.snapshot.parent.parent.params.uId;
    this.userSub = this.userService.fetchUser( 'uId', '==', uId )
                       .valueChanges()
                       .subscribe( value => {
                         if ( value?.length > 0 ) {
                           this.user = value[0];
                         }
                       } );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
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

  private reset(): void {
    this.user.currentShoppingList = {
      sStatus: 'current',
      sId: 'current',
      sItems: []
    };

    this.userService.updateUser( this.user );
  }

  getCurrentShoppingList(): any {
    return this.user.shoppingLists.filter(
      list => list.sId === this.user.preferedStore );
  }
}
