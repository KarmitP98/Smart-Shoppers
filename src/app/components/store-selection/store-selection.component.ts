import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { StoreModel } from '../../model/models';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { StoreService } from '../../services/store.service';

@Component( {
              selector: 'app-store-selection',
              templateUrl: './store-selection.component.html',
              styleUrls: [ './store-selection.component.css' ]
            } )
export class StoreSelectionComponent implements OnInit, OnDestroy {

  allStores: StoreModel[] = [];
  stores: StoreModel[] = this.allStores;
  multi = false;
  storeSub: Subscription;
  postalCode: string;
  city: string;
  province: string;
  country: string;
  selected: string[] = [];
  chosen: string;


  constructor( @Inject( MAT_DIALOG_DATA ) public data: string,
               private storeService: StoreService ) {

    this.storeSub = this.storeService.fetchStore()
                        .valueChanges()
                        .subscribe( value => {
                          if ( value?.length > 0 ) {
                            this.allStores = value;
                          }
                        } );


  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

  filter( type: number ) {
    // this.stores = this.allStores;
    // this.stores = this.stores.filter(store => store)
    switch ( type ) {
      case 1:
        this.stores = this.allStores.filter( store => store.sCountry.toUpperCase() === this.country.toUpperCase() );
        break;
      case 2:
        this.stores = this.allStores.filter( store => store.sProvince.toUpperCase() === this.province.toUpperCase() );
        break;
      case 3:
        this.stores = this.allStores.filter( store => store.sCity.toUpperCase() === this.city.toUpperCase() );
        break;
      case 4:
        this.stores = this.allStores.filter( store => store.sAreaCode.toUpperCase() === this.postalCode.slice( 0, 3 ).toUpperCase() );
        break;
    }

  }

  addStore( store: StoreModel ): void {
    if ( this.multi ) {
      let found = false;
      for ( let i = 0; i < this.selected.length; i++ ) {
        if ( this.selected[i] === store.sId ) {
          this.selected.splice( i, 1 );
          found = true;
        }
      }
      if ( !found ) {
        this.selected.push( store.sId );
      }
    } else {
      if ( this.chosen === store.sId ) {
        this.chosen = null;
      } else {
        this.chosen = store.sId;
      }
    }
  }
}
