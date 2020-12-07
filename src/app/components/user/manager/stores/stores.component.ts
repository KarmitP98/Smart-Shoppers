import { Component, OnDestroy, OnInit } from '@angular/core';
import { StoreModel, UserModel } from '../../../../model/models';
import { UserService } from '../../../../services/user.service';
import { StoreService } from '../../../../services/store.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component( {
              selector: 'app-stores',
              templateUrl: './stores.component.html',
              styleUrls: [ './stores.component.css' ]
            } )
export class StoresComponent implements OnInit, OnDestroy {

  user: UserModel;
  stores: StoreModel[] = [];

  userSub: Subscription;
  storeSub: Subscription;

  constructor( private userService: UserService,
               private storeService: StoreService,
               private route: ActivatedRoute ) {
  }

  ngOnInit(): void {

    const uId = this.route.snapshot.parent.parent.params.uId;

    this.fetchStore( uId );

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
    // tslint:disable-next-line:no-unused-expression
    this.storeSub ? this.storeSub.unsubscribe() : null;
  }

  public fetchStore( uId ) {
    this.storeSub = this.storeService
                        .fetchStore( 'sManagerIds', 'array-contains', uId )
                        .valueChanges()
                        .subscribe( value => {
                          if ( value?.length > 0 ) {
                            this.stores = value;
                          }
                        } );
  }

}
