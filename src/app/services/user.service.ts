/* tslint:disable:typedef */
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserModel } from '../model/models';

@Injectable( {
               providedIn: 'root'
             } )
export class UserService {

  private loadingSubject = new BehaviorSubject<boolean>( false );

  constructor( private afs: AngularFirestore,
               private afa: AngularFireAuth,
               private router: Router,
               private snackBar: MatSnackBar ) {

  }

  public loginWithEmailandPassword( email, password, uType: string ): any {
    this.loadingSubject.next( true );

    this.afa.signInWithEmailAndPassword( email, password )
        .then( ( value ) => {
          this.router.navigate( [ '/', value.user.uid ] );
          this.loadingSubject.next( false );
        } )
        .catch( ( err ) => {
          this.showToast( err.message, 3000 );
        } );

  }

  public signUpWithEmail( user: UserModel, password: string ) {

    this.loadingSubject.next( true );

    this.afa.createUserWithEmailAndPassword( user.uEmail, password )
        .then( ( value ) => {
          user.uId = value.user.uid;
          this.addNewUser( user );

          this.router.navigate( [ '/', value.user.uid ] );
          this.loadingSubject.next( false );
        } )
        .catch( ( err ) => {
          this.showToast( err.message, 3000 );
          this.loadingSubject.next( false );
        } );

  }

  public logOut() {
    this.afa.signOut()
        .then( () => {
          this.router.navigate( [ '' ] );
        } )
        .catch( err => {
          console.log( err.message );
          console.log( err.errorCode );
        } );
  }

  public showToast( message, time? ) {
    this.snackBar.open( message,
                        'Close',
                        {
                          duration: time || 2000,
                          horizontalPosition: 'center',
                          verticalPosition: 'bottom',
                          politeness: 'assertive'
                        } );
  }

  public addNewUser( user: UserModel ): void {
    this.afs.collection( 'users' )
        .doc( user.uId )
        .set( user )
        .then( () => this.showToast( 'New User Added!' ) )
        .catch( ( err ) => this.showToast( err.message ) );
  }

  public fetchUser( child?, condition?, value? ) {
    if ( child ) {
      return this.afs.collection<UserModel>( 'users', ref => ref.where( child, condition, value ) );
    }
    return this.afs.collection<UserModel>( 'users' );
  }

  public updateUser( newUser: UserModel ): void {
    this.afs.collection<UserModel>( 'users' )
        .doc( newUser.uId )
        .update( newUser );
  }

  public removeUser( user: UserModel ): void {
    this.afs.collection<UserModel>( 'users' )
        .doc( user.uId )
        .delete();
  }

}
