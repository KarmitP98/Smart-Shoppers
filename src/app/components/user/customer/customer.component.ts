import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserModel } from '../../../model/models';
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
  user: UserModel;
  userSub: Subscription;
  loading: boolean = false;

  constructor( public userService: UserService,
               public storeService: StoreService,
               public dialog: MatDialog,
               private itemService: ItemService,
               private route: ActivatedRoute,
               private router: Router ) {
  }

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
                  if ( this.user?.preferedStore ) {
                    this.loading = false;
                    this.router.navigate( [ this.user.preferedStore ],
                                          { relativeTo: this.route } );
                  } else if ( this.user?.savedStore ) {
                    this.loading = false;
                    this.router.navigate( [ this.user.savedStore ],
                                          { relativeTo: this.route } );
                  }
                  this.loading = false;
                },
                1000 );

  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  selectStore(): any {
    const dialogRef = this.dialog.open( StoreSelectionComponent, {
      data: this.user
    } );

    dialogRef.afterClosed().subscribe( ( result ) => {
      if ( result ) {
        this.loading = true;
        if ( result.save ) {
          this.user.savedStore = result.store;
        }
        this.user.preferedStore = result.store;
        this.userService.updateUser( this.user );

        setTimeout( () => {
                      this.loading = false;
                      this.router.navigate( [ result.store ],
                                            { relativeTo: this.route } );
                    },
                    500 );
      }
    } );
  }

  routeTo() {
    if ( this.user.preferedStore ) {
      this.router.navigate( [ this.user.preferedStore ], { relativeTo: this.route } );
    } else if ( this.user.savedStore ) {
      this.router.navigate( [ this.user.savedStore ], { relativeTo: this.route } );
    }
  }


  logOut(): void {
    this.user.preferedStore = '';
    this.userService.updateUser( this.user );
    this.userService.logOut();
  }

}
