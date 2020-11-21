import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ItemDetailModel } from '../model/models';

@Injectable( {
               providedIn: 'root'
             } )
export class ItemService {

  constructor( private afs: AngularFirestore ) { }

  public fetchItems( child?, condition?, value? ): any {
    if ( child ) {
      return this.afs.collection<ItemDetailModel>( 'items', ref => ref.where( child, condition, value ) );
    }
    return this.afs.collection<ItemDetailModel>( 'items' );
  }

  public addItem( item: ItemDetailModel ): any {
    item.iId = this.afs.createId();
    this.afs.collection<ItemDetailModel>( 'items' )
        .doc( item.iId )
        .set( item );
  }

  public updateItem( item: ItemDetailModel ): any {
    this.afs.collection<ItemDetailModel>( 'items' )
        .doc( item.iId )
        .update( item );
  }

  public deleteItem( item: ItemDetailModel ): any {
    this.afs.collection<ItemDetailModel>( 'items' )
        .doc( item.iId )
        .delete();
  }

}
