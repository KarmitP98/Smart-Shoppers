import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { StoreModel, UserModel } from '../../../../model/models';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddManagerComponent } from '../../manager/add-manager/add-manager.component';
import { StoreService } from '../../../../services/store.service';

@Component( {
              selector: 'app-manager-edit',
              templateUrl: './manager-edit.component.html',
              styleUrls: [ './manager-edit.component.css' ]
            } )
export class ManagerEditComponent implements OnInit, OnDestroy {

  users: UserModel[] = [];
  userSub: Subscription;

  storeSub: Subscription;
  stores: StoreModel[] = [];

  constructor( private route: ActivatedRoute,
               private userService: UserService,
               private storeService: StoreService,
               public dialog: MatDialog ) {
  }

  ngOnInit(): void {

    this.userSub = this.userService.fetchUser( 'uType', '==', 'manager' )
                       .valueChanges()
                       .subscribe( value => {
                         if ( value?.length > 0 ) {
                           this.users = value.filter( value1 => !value1.disabled );
                         }
                       } );

    this.storeSub = this.storeService.fetchStore()
                        .valueChanges()
                        .subscribe( value => {
                          if ( value?.length > 0 ) {
                            this.stores = value;
                          }
                        } );

  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.storeSub.unsubscribe();
  }

  save( user: UserModel ) {
    this.userService.updateUser( user );
  }

  removeManager( user: UserModel ) {

    for ( let store of this.stores.filter( value => value.sManagerIds.some( value1 => value1 === user.uId ) ) ) {
      store.sManagerIds.splice( store.sManagerIds.indexOf( user.uId ), 1 );
      store.sManagerIds.length === 0 ? store.status = false : '';
      this.storeService.updateStore( store );
    }

    this.userService.deleteAccount( user );
  }

  addManager() {
    const dialogRef = this.dialog.open( AddManagerComponent, {} );
  }

}
