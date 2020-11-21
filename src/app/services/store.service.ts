import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreModel } from '../model/models';

@Injectable( {
               providedIn: 'root'
             } )
export class StoreService {

  constructor( private afs: AngularFirestore ) { }

  public fetchStore( child?, condition?, value? ) {
    if ( child ) {
      return this.afs.collection<StoreModel>( 'stores', ref => ref.where( child, condition, value ) );
    }
    return this.afs.collection<StoreModel>( 'stores' );
  }

  public addStore( store: StoreModel ) {
    store.sId = this.afs.createId();
    this.afs.collection<StoreModel>( 'stores' )
        .doc( store.sId )
        .set( store );
  }

  public updateStore( store: StoreModel ) {
    this.afs.collection<StoreModel>( 'stores' )
        .doc( store.sId )
        .update( store );
  }

  public deleteStore( store: StoreModel ) {
    this.afs.collection<StoreModel>( 'stores' )
        .doc( store.sId )
        .delete();
  }
}
