import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { StoreModel, UserModel } from '../../../model/models';
import { MatDialog } from '@angular/material/dialog';
import { StoreSelectionComponent } from '../../store-selection/store-selection.component';
import { StoreService } from '../../../services/store.service';
import { Subscription } from 'rxjs';
import { ItemService } from '../../../services/item.service';

@Component( {
              selector: 'app-customer',
              templateUrl: './customer.component.html',
              styleUrls: [ './customer.component.css' ]
            } )
export class CustomerComponent implements OnInit, OnDestroy {

  @Input( 'user' ) user: UserModel;
  itemName: string;
  store: StoreModel;
  storeSub: Subscription;

  constructor( public userService: UserService,
               public storeService: StoreService,
               public dialog: MatDialog,
               private itemService: ItemService ) { }

  ngOnInit(): void {
    this.fetchStore();

  }

  selectStore(): any {
    const dialogRef = this.dialog.open( StoreSelectionComponent, {
      data: this.user,
      width: '75vw',
      height: '75vh'
    } );

    dialogRef.afterClosed().subscribe( result => {
      if ( result ) {
        this.user.preferedStore = result;
        this.userService.updateUser( this.user );
        this.fetchStore();
      }
    } );
  }

  ngOnDestroy(): void {
    if ( this.storeSub ) {
      this.storeSub.unsubscribe();
    }
  }

  logOut(): void {
    this.userService.logOut();
  }

  getStore() {
    return this.store;
  }

  private fetchStore(): void {
    if ( this.user.preferedStore ) {
      this.storeSub = this.storeService.fetchStore( 'sId', '==', this.user.preferedStore )
                          .valueChanges()
                          .subscribe( value => {
                            if ( value?.length > 0 ) {
                              this.store = value[0];
                            }
                          } );
    }
  }
}
