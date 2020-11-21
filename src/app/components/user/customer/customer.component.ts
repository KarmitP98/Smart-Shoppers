import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { ItemDetailModel, ItemModel, StoreModel, UserModel } from '../../../model/models';
import { MatDialog } from '@angular/material/dialog';
import { StoreSelectionComponent } from '../../store-selection/store-selection.component';
import { StoreService } from '../../../services/store.service';
import { Subscription } from 'rxjs';
import { CATEGORIES } from '../../../shared/constants';
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
  categories = CATEGORIES;

  constructor( public userService: UserService,
               public storeService: StoreService,
               public dialog: MatDialog,
               private itemService: ItemService ) { }

  ngOnInit(): void {

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

  ngOnDestroy(): void {
    if ( this.storeSub ) {
      this.storeSub.unsubscribe();
    }
  }

  logOut(): void {
    this.userService.logOut();
  }

  search(): string {
    return '';
  }

  selectStore(): any {
    const dialogRef = this.dialog.open( StoreSelectionComponent, {
      data: 'customer',
      width: '75vw',
      height: '75vh'
    } );

    dialogRef.afterClosed().subscribe( result => {
      console.log( `Dialog result: ${ result }` );
    } );
  }

  setup(): void {

    const store1: StoreModel = {
      sId: '',
      sCountry: 'Canada',
      sProvince: 'ON',
      sCity: 'Toronto',
      sStreet: '453 Parliament St.',
      sName: 'ShoppersLand Parliament',
      sAreaCode: 'M5A',
      sPostalCode: 'M5A3A3',
      sPriceMult: 1.12,
      sItems: []
    };
    const store2: StoreModel = {
      sId: '',
      sCountry: 'Canada',
      sProvince: 'ON',
      sCity: 'Toronto',
      sStreet: '609 Church St.',
      sName: 'ShoppersLand Penguin',
      sAreaCode: 'M4Y',
      sPostalCode: 'M4Y2E6',
      sPriceMult: 0.89,
      sItems: []
    };
    const store3: StoreModel = {
      sId: '',
      sCountry: 'Canada',
      sProvince: 'ON',
      sCity: 'Toronto',
      sStreet: ' 25 Carlton St #21',
      sName: 'ShoppersLand Carlton',
      sAreaCode: 'M5B',
      sPostalCode: 'M5B1L3',
      sPriceMult: 1.25,
      sItems: []
    };

    for ( let i = 0; i < 50; i++ ) {
      const itemDetail: ItemDetailModel = {
        iId: 't',
        iName: 'Item' + i,
        iCategory: this.categories[Math.floor( Math.random() * 8 )],
        iIcon: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Flallahoriye.com.tirzee.com%2F%3Fproduct%3Dproduct-6&psig=AOvVaw3BYFznc8cZ7UnWiTtMY65j&ust=1606020866290000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLjny47sku0CFQAAAAAdAAAAABAD',
        iDesc: 'Item ' + i + ' is an item',
        iPrice: Math.floor( Math.random() * 50 )
      };
      this.itemService.addItem( itemDetail );

      const item: ItemModel = {
        itemDetail,
        iBought: false,
        isle: Math.floor( (Math.random() * 100) + 1 ),
        iStatus: 'stock',
        iStoreQuantity: 10,
        iQ: 0,
        oldPrice: 0,
        onSale: false,
        price: itemDetail.iPrice
      };

      if ( Math.random() > 0.5 ) {
        item.price = itemDetail.iPrice * store1.sPriceMult;
        store1.sItems.push( item );
      }
      if ( Math.random() > 0.5 ) {
        item.price = itemDetail.iPrice * store2.sPriceMult;
        store2.sItems.push( item );
      }
      if ( Math.random() > 0.5 ) {
        item.price = itemDetail.iPrice * store3.sPriceMult;
        store3.sItems.push( item );
      }

    }

    this.storeService.addStore( store1 );
    this.storeService.addStore( store2 );
    this.storeService.addStore( store3 );
  }
}
