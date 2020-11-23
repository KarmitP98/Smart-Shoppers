import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { StoreModel, UserModel } from '../../../model/models';
import { MatDialog } from '@angular/material/dialog';
import { StoreSelectionComponent } from '../../store-selection/store-selection.component';
import { StoreService } from '../../../services/store.service';
import { Subscription } from 'rxjs';
import { ItemService } from '../../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    setTimeout( () => {
                  if ( this.user ) {
                    this.loading = false;
                    this.router.navigate( [ this.user.preferedStore ],
                                          { relativeTo: this.route } );
                  }
                },
                1000 );

  }

  ngOnDestroy(): void {
    if ( this.storeSub ) {
      this.storeSub.unsubscribe();
    }
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
                    },
                    500 );
      }
    } );
  }

  logOut(): void {
    this.userService.logOut();
  }

  getStore() {
    return this.store;
  }

  private fetchStore(): void {
    if ( this.user.preferedStore ) {
      this.storeSub = this.storeService.fetchStore( 'sId', '==',
                                                    this.user.preferedStore )
                          .valueChanges()
                          .subscribe( value => {
                            if ( value?.length > 0 ) {
                              this.store = value[0];
                            }
                          } );
    }
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
      this.user.shoppingLists.push( this.user.currentShoppingList );
    }

    this.userService.updateUser( this.user );

    this.user.preferedStore = result;
    this.user.currentShoppingList = {
      sId: result,
      sStatus: 'pending',
      sItems: []
    };
    found = false;

    for ( let sl of this.user.shoppingLists ) {
      if ( sl.sStatus === 'pending' && sl.sId === result ) {
        this.user.currentShoppingList = sl;
        found = true;
      }
    }

    this.userService.updateUser( this.user );

  }
}
