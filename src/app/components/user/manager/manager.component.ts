import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserModel } from '../../../model/models';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../../services/store.service';

@Component( {
              selector: 'app-manager',
              templateUrl: './manager.component.html',
              styleUrls: [ './manager.component.css' ]
            } )
export class ManagerComponent implements OnInit {

  user: UserModel;

  constructor( public userService: UserService,
               public storeService: StoreService,
               public route: ActivatedRoute,
               public router: Router ) {
  }

  ngOnInit(): void {

    const uId = this.route.snapshot.parent.params.uId;

    const sub = this.userService.fetchUser( 'uId', '==', uId )
                    .valueChanges()
                    .subscribe( value => {
                      if ( value?.length > 0 ) {
                        this.user = value[0];
                      }
                      if ( !this.user.disabled ) {
                        this.router.navigate( [ 'stores' ], { relativeTo: this.route } );
                      }
                      sub.unsubscribe();
                    } );

  }

  getStores() {
    return this.storeService.fetchStore( 'sManagerIds', 'array-contains', this.user.uId )
               .valueChanges()
               .toPromise()
               .then( ( value ) => {
                 return value;
               } )

  }


  removeAccount() {
    this.userService.deleteAccount( this.user )
  }
}
