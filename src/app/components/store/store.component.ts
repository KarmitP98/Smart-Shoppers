import { Component, Input, OnInit } from '@angular/core';
import { ItemModel, StoreModel } from '../../model/models';
import { StoreService } from '../../services/store.service';
import { Subscription } from 'rxjs';
import { CATEGORIES } from '../../shared/constants';

@Component( {
              selector: 'app-store',
              templateUrl: './store.component.html',
              styleUrls: [ './store.component.css' ]
            } )
export class StoreComponent implements OnInit {

  @Input( 'store' ) store: StoreModel;
  itemName: string;
  category: string;
  allItems: ItemModel[] = [];
  items: ItemModel[] = [];
  itemSub: Subscription;
  categories = CATEGORIES;

  constructor( private storeService: StoreService ) {
  }

  ngOnInit(): void {
    this.items = this.store.sItems;
  }

  search() {
    if ( this.category ) {
      this.items = this.store.sItems.filter(
        item => item.itemDetail.iCategory === this.category &&
          item.itemDetail.iName.toLowerCase().includes( this.itemName.toLowerCase() ) );
    } else {
      this.items = this.store.sItems.filter(
        item => item.itemDetail.iName.toLowerCase().includes( this.itemName.toLowerCase() ) );
    }
  }


}
