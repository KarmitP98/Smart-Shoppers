import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { StoreModel, UserModel } from '../../../model/models';
import { MatDialog } from '@angular/material/dialog';
import { StoreSelectionComponent } from '../../store-selection/store-selection.component';
import { StoreService } from '../../../services/store.service';
import { Subscription } from 'rxjs';
import { ItemService } from '../../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Component( {
              selector: 'app-customer',
              templateUrl: './customer.component.html',
              styleUrls: [ './customer.component.css' ]
            } )
export class CustomerComponent implements OnInit, OnDestroy {

  itemName: string;
  store: StoreModel;
  storeSub: Subscription;
  user: UserModel;
  userSub: Subscription;
  loading: boolean = false;
  stores: StoreModel[] = [];

  constructor( public userService: UserService,
               public storeService: StoreService,
               public dialog: MatDialog,
               private itemService: ItemService,
               private route: ActivatedRoute,
               private router: Router ) { }

  ngOnInit(): void {

    const uId = this.route.snapshot.parent.params.uId;
    this.userSub = this.userService.fetchUser( 'uId', '==', uId )
                       .valueChanges()
                       .subscribe( value => {
                         if ( value?.length > 0 ) {
                           this.user = value[0];
                         }
                       } );

    this.loading = true;

    this.storeSub = this.storeService.fetchStore()
                        .valueChanges()
                        .subscribe( value => {
                          if ( value?.length > 0 ) {
                            this.stores = value;
                          }
                        } );

    setTimeout( () => {
                  if ( this.user?.preferedStore ) {
                    this.loading = false;
                    this.router.navigate( [ this.user.preferedStore ],
                                          { relativeTo: this.route } );
                  }
                  this.loading = false;
                },
                1000 );

  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.userSub.unsubscribe();
  }

  selectStore(): any {
    const dialogRef = this.dialog.open( StoreSelectionComponent, {
      data: this.user,
      width: '75vw',
      height: '75vh'
    } );

    dialogRef.afterClosed().subscribe( result => {
      if ( result ) {
        this.loading = true;
        this.updateUserShoppingList( result );
        setTimeout( () => {
                      if ( this.user ) {
                        this.loading = false;
                        this.router.navigate( [ this.user.preferedStore ],
                                              { relativeTo: this.route } );
                      }
                      this.loading = false;
                    },
                    500 );
      }
    } );
  }

  logOut(): void {
    this.userService.logOut();
  }

  private updateUserShoppingList( result: string ): void {

    let found = false;
    for ( let sl of this.user.shoppingLists ) {
      if ( sl.sId === this.user.preferedStore && sl.sStatus === 'pending' ) {
        sl = this.user.currentShoppingList;
        found = true;
      }
    }

    if ( !found ) {
      if ( this.user.currentShoppingList?.sItems.length > 0 ) {
        this.user.shoppingLists.push( this.user.currentShoppingList );
      }
    }

    this.userService.updateUser( this.user );

    this.user.preferedStore = result;

    found = false;

    for ( let sl of this.user.shoppingLists ) {
      if ( sl.sId === result && sl.sStatus === 'pending' ) {
        this.user.currentShoppingList = sl;
        found = true;
      }
    }

    if ( !found ) {
      this.user.currentShoppingList = {
        sId: result,
        sStatus: 'pending',
        sItems: [],
        date: Timestamp.now(),
        lName: this.getStoreName( result ) + ' - ' + Timestamp.now().toDate()
                                                              .toDateString()
      };
    }

    this.userService.updateUser( this.user );

  }

  private getStoreName( result: string ): any {
    return this.stores.filter( value => value.sId === result )[0].sName;
  }
}
