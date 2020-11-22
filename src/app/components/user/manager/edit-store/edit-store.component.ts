import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemModel, StoreModel, UserModel } from '../../../../model/models';
import { CATEGORIES } from '../../../../shared/constants';
import { Subscription } from 'rxjs';
import { StoreService } from '../../../../services/store.service';
import { UserService } from '../../../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ItemCardDetailComponent } from '../../../item-card/item-card-detail/item-card-detail.component';
import { opacityLoadTrigger } from '../../../../shared/animations';

@Component( {
              selector: 'app-edit-store',
              templateUrl: './edit-store.component.html',
              styleUrls: [ './edit-store.component.css' ],
              animations: [ opacityLoadTrigger ]
            } )
export class EditStoreComponent implements OnInit, OnDestroy {

  store: StoreModel;
  user: UserModel;
  itemName: string = '';
  category: string = '';
  categories = CATEGORIES;
  items: ItemModel[] = [];
  storeSub: Subscription;
  userSub: Subscription;

  constructor( private storeService: StoreService,
               private userService: UserService,
               private dialog: MatDialog,
               private route: ActivatedRoute ) {
  }

  ngOnInit(): void {
    const uId = this.route.snapshot.parent.parent.params.uId;
    const sId = this.route.snapshot.params.sId;

    this.userSub = this.userService.fetchUser( 'uId', '==', uId )
                       .valueChanges()
                       .subscribe( value => {
                         if ( value?.length > 0 ) {
                           this.user = value[0];
                         }
                       } );

    this.storeSub = this.storeService.fetchStore( 'sId', '==',
                                                  sId )
                        .valueChanges()
                        .subscribe( value => {
                          if ( value?.length > 0 ) {
                            this.store = value[0];
                            this.store.sItems = this.store.sItems.sort(
                              ( a, b ) => a.isle < b.isle ? -1 : 1 );
                          }
                        } );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.storeSub.unsubscribe();
  }

  search( sale: boolean ) {
    if ( sale ) {
      return this.store.sItems.filter( value => !value.onSale );
    } else if ( this.category ) {
      return this.store.sItems.filter(
        item => item.itemDetail.iCategory === this.category &&
          item.itemDetail.iName.toLowerCase().includes(
            this.itemName.toLowerCase() ) );
    } else {
      return this.store.sItems.filter(
        item => item.itemDetail.iName.toLowerCase().includes(
          this.itemName.toLowerCase() ) );
    }
  }

  getNonSaleItems(): any {
    return this.store.sItems.filter( value => !value.onSale );
  }

  getSaleItems(): any {
    return this.store.sItems.filter( value => value.onSale );
  }

  showItemDetail( item: any ): void {
    const dialogRef = this.dialog.open( ItemCardDetailComponent, {
      data: { item, user: this.user, store: this.store },
      width: '90vw',
      height: '90vh'
    } );

    dialogRef.afterClosed().subscribe( result => {
      if ( result ) {
        console.log( result );
      }
    } );
  }

}
