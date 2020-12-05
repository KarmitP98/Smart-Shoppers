import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemDetailModel, ItemModel, StoreModel } from '../../../model/models';
import { UserService } from '../../../services/user.service';
import { StoreService } from '../../../services/store.service';
import { MatDialog } from '@angular/material/dialog';
import { CATEGORIES } from '../../../shared/constants';
import { ItemService } from '../../../services/item.service';
import { Subscription } from 'rxjs';

@Component( {
              selector: 'app-admin',
              templateUrl: './admin.component.html',
              styleUrls: [ './admin.component.css' ]
            } )
export class AdminComponent implements OnInit, OnDestroy {


  categories = CATEGORIES;
  // tslint:disable-next-line:no-input-rename
  storeSub: Subscription;
  stores: StoreModel[] = [];

  constructor( public userService: UserService,
               public storeService: StoreService,
               public dialog: MatDialog,
               public itemService: ItemService ) {
  }

  ngOnInit(): void {
    this.storeSub = this.storeService.fetchStore()
                        .valueChanges()
                        .subscribe( value => {
                          if ( value?.length > 0 ) {
                            this.stores = value;
                          }
                        } );
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

  selectStore(): void {

  }

  setup(): void {

    const store1 = this.createStore(
      '50 Quarry Edge Dr,Brampton,ON,L6V 4K2'.split( ',' ), 'Qarry' );
    const store2 = this.createStore(
      '800 Matheson Blvd W,Mississauga,ON,L5V 2N6'.split( ',' ), 'Matheson' );
    const store3 = this.createStore(
      '100 City Centre Dr,Mississauga,ON,L5B 2C9'.split( ',' ), 'City Centre' );
    const store4 = this.createStore(
      '4515 Dundas St,Burlington,ON,L7M 5B4'.split( ',' ), 'Dundas' );
    const store5 = this.createStore(
      '900 Dufferin St,Toronto,ON,M6H 4A9'.split( ',' ), 'Dufferin' );
    const store6 = this.createStore(
      '2525 St Clair Ave W,Toronto,ON,M6N 4Z5'.split( ',' ), 'St Clair' );
    const store7 = this.createStore(
      '5005 Northland Dr NW,Calgary,AB,T2L 2K1'.split( ',' ), 'NorthLand' );
    const store8 = this.createStore(
      '9650 Macleod Trail,Calgary,AB,T2J 0P5'.split( ',' ), 'Macleod' );

    const stores: StoreModel[] = [ store1,
                                   store2,
                                   store3,
                                   store4,
                                   store5,
                                   store6,
                                   store7,
                                   store8 ];

    for ( let i = 0; i < 50; i++ ) {
      const itemDetail = this.createItemDetail( i );
      this.itemService.addItem( itemDetail );

      for ( const store of stores ) {
        if ( Math.random() > 0.4 ) {
          store.sItems.push(
            this.createItemModel( itemDetail, store.sPriceMult ) );
        }
      }
    }

    for ( const store of stores ) {
      this.storeService.addStore( store );
    }
  }

  createStore( address: string[], name ): StoreModel {
    return {
      sId: '',
      sCountry: 'Canada',
      sProvince: address[2],
      sCity: address[1],
      sStreet: address[0],
      sName: 'ShoppersLand ' + name,
      sAreaCode: address[3].slice( 0, 3 ),
      sPostalCode: address[3].trim(),
      sPriceMult: Math.random() + 0.5,
      sItems: [],
      sManagerIds: [],
      status: false
    };
  }

  createItemDetail( i ): ItemDetailModel {
    const isle = Math.round( Math.random() * 8 );
    const cat = this.categories[isle];
    return {
      iId: 't',
      iName: 'Item' + i,
      iCategory: cat,
      iIcon: 'assets/images/product-' + cat + '.png',
      iDesc: 'Item ' + i + ' is an item',
      iPrice: Math.floor( (Math.random() * 50) + 1 )
    };
  }

  createItemModel( itemDetail: ItemDetailModel, sPriceMult: number ): ItemModel {
    return {
      itemDetail,
      isle: this.getIsle( itemDetail.iCategory ),
      iStatus: 'stock',
      iStoreQuantity: 10,
      oldPrice: 0,
      onSale: false,
      price: itemDetail.iPrice * sPriceMult,
      iBought: Math.round( Math.random() * 50 )
    };
  }

  getIsle( cat: string ): number {
    for ( let i = 0; i < this.categories.length; i++ ) {
      if ( this.categories[i] === cat ) {
        return (i + 1);
      }
    }
  }
}
