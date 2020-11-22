import { Component, Input, OnInit } from '@angular/core';
import { ItemDetailModel, ItemModel, StoreModel, UserModel } from '../../../model/models';
import { UserService } from '../../../services/user.service';
import { StoreService } from '../../../services/store.service';
import { MatDialog } from '@angular/material/dialog';
import { CATEGORIES } from '../../../shared/constants';
import { ItemService } from '../../../services/item.service';

@Component( {
              selector: 'app-admin',
              templateUrl: './admin.component.html',
              styleUrls: [ './admin.component.css' ]
            } )
export class AdminComponent implements OnInit {


  categories = CATEGORIES;
  // tslint:disable-next-line:no-input-rename
  @Input( 'user' ) user: UserModel;

  constructor( public userService: UserService,
               public storeService: StoreService,
               public dialog: MatDialog,
               public itemService: ItemService ) { }

  ngOnInit(): void {
  }

  selectStore(): void {

  }

  setup(): void {

    // const store1: StoreModel = {
    //   sId: '',
    //   sCountry: 'Canada',
    //   sProvince: 'ON',
    //   sCity: 'Toronto',
    //   sStreet: '453 Parliament St.',
    //   sName: 'ShoppersLand Parliament',
    //   sAreaCode: 'M5A',
    //   sPostalCode: 'M5A3A3',
    //   sPriceMult: 1.12,
    //   sItems: [],
    //   sManagerId: ''
    // };
    // const store2: StoreModel = {
    //   sId: '',
    //   sCountry: 'Canada',
    //   sProvince: 'ON',
    //   sCity: 'Toronto',
    //   sStreet: '609 Church St.',
    //   sName: 'ShoppersLand Penguin',
    //   sAreaCode: 'M4Y',
    //   sPostalCode: 'M4Y2E6',
    //   sPriceMult: 0.89,
    //   sItems: [],
    //   sManagerId: ''
    // };
    // const store3: StoreModel = {
    //   sId: '',
    //   sCountry: 'Canada',
    //   sProvince: 'ON',
    //   sCity: 'Toronto',
    //   sStreet: '25 Carlton St #21',
    //   sName: 'ShoppersLand Carlton',
    //   sAreaCode: 'M5A',
    //   sPostalCode: 'M5A1L3',
    //   sPriceMult: 1.25,
    //   sItems: [],
    //   sManagerId: ''
    // };
    // const store4: StoreModel = {
    //   sId: '',
    //   sCountry: 'Canada',
    //   sProvince: 'ON',
    //   sCity: 'Brampton',
    //   sStreet: '50 Quarry Edge Dr. ',
    //   sName: 'ShoppersLand Quarry',
    //   sAreaCode: 'L6V',
    //   sPostalCode: 'L6V4K2',
    //   sPriceMult: 0.9,
    //   sItems: [],
    //   sManagerId: ''
    // };
    // const store5: StoreModel = {
    //   sId: '',
    //   sCountry: 'Canada',
    //   sProvince: 'ON',
    //   sCity: 'Mississauga',
    //   sStreet: '800 Matheson Blvd W',
    //   sName: 'ShoppersLand Carlton',
    //   sAreaCode: 'L5V',
    //   sPostalCode: 'L5V2N6',
    //   sPriceMult: 0.7,
    //   sItems: [],
    //   sManagerId: ''
    // };
    // const store6: StoreModel = {
    //   sId: '',
    //   sCountry: 'Canada',
    //   sProvince: 'ON',
    //   sCity: 'Mississauga',
    //   sStreet: '2480 Carlton Blvd.',
    //   sName: 'ShoppersLand Carlton',
    //   sAreaCode: 'L5N',
    //   sPostalCode: 'L5N7Y1',
    //   sPriceMult: 1.30,
    //   sItems: [],
    //   sManagerId: ''
    // };
    // const store7: StoreModel = {
    //   sId: '',
    //   sCountry: 'Canada',
    //   sProvince: 'ON',
    //   sCity: 'Mississauga',
    //   sStreet: '100 City Centre Dr.',
    //   sName: 'ShoppersLand City Center',
    //   sAreaCode: 'L5B',
    //   sPostalCode: 'L5B2C9',
    //   sPriceMult: 1.45,
    //   sItems: [],
    //   sManagerId: ''
    // };
    // const store8: StoreModel = {
    //   sId: '',
    //   sCountry: 'Canada',
    //   sProvince: 'AB',
    //   sCity: 'Calgary',
    //   sStreet: '5005 Northland Dr NW',
    //   sName: 'ShoppersLand Northland',
    //   sAreaCode: 'T2L',
    //   sPostalCode: 'T2L2K1',
    //   sPriceMult: 0.67,
    //   sItems: [],
    //   sManagerId: ''
    // };

    const store1 = this.createStore( '50 Quarry Edge Dr,Brampton,ON,L6V 4K2'.split( ',' ), 'Qarry' );
    const store2 = this.createStore( '800 Matheson Blvd W,Mississauga,ON,L5V 2N6'.split( ',' ), 'Matheson' );
    const store3 = this.createStore( '100 City Centre Dr,Mississauga,ON,L5B 2C9'.split( ',' ), 'City Centre' );
    const store4 = this.createStore( '4515 Dundas St,Burlington,ON,L7M 5B4'.split( ',' ), 'Dundas' );
    const store5 = this.createStore( '900 Dufferin St,Toronto,ON,M6H 4A9'.split( ',' ), 'Dufferin' );
    const store6 = this.createStore( '2525 St Clair Ave W,Toronto,ON,M6N 4Z5'.split( ',' ), 'St Clair' );
    const store7 = this.createStore( '5005 Northland Dr NW,Calgary,AB,T2L 2K1'.split( ',' ), 'NorthLand' );
    const store8 = this.createStore( '9650 Macleod Trail,Calgary,AB,T2J 0P5'.split( ',' ), 'Macleod' );

    const stores: StoreModel[] = [ store1, store2, store3, store4, store5, store6, store7, store8 ];

    for ( let i = 0; i < 50; i++ ) {
      const itemDetail = this.createItemDetail( i );
      this.itemService.addItem( itemDetail );
      // tslint:disable-next-line:prefer-const

      for ( const store of stores ) {
        if ( Math.random() > 0.4 ) {
          store.sItems.push( this.createItemModel( itemDetail, store.sPriceMult ) );
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
      sManagerId: ''
    };
  }

  createItemDetail( i ): ItemDetailModel {
    const cat = this.categories[Math.floor( Math.random() * 8 )];
    return {
      iId: 't',
      iName: 'Item' + i,
      iCategory: cat,
      iIcon: 'assets/images/product-' + cat + '.png',
      iDesc: 'Item ' + i + ' is an item',
      iPrice: Math.floor( (Math.random() * 50) + 1 )
    };
  }

  createItemModel( itemDetail, sPriceMult: number ): ItemModel {
    return {
      itemDetail,
      isle: Math.floor( (Math.random() * 100) + 1 ),
      iStatus: 'stock',
      iStoreQuantity: 10,
      oldPrice: 0,
      onSale: false,
      price: itemDetail.iPrice * sPriceMult
    };
  }
}
