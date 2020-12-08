/* tslint:disable:typedef */
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserModel } from '../model/models';
import { environment } from '../../environments/environment.prod';
import firebase from 'firebase';

@Injectable( {
               providedIn: 'root'
             } )
export class UserService {

  public loginTries = new BehaviorSubject<number>( 5 );
  secondaryApp = firebase.initializeApp( environment.firebaseConfig, 'Secondary' );
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
          console.log( err.code );
          switch ( err.code ) {
            case 'auth/wrong-password':
              const st: string = '\nLogin Attempts Remaining: ' + (this.loginTries.value - 1);
              this.showToast( err.message + st, 4000 );
              this.loginTries.next( this.loginTries.value - 1 );
              break;
            case 'auth/too-many-requests':
              this.showToast( 'Your account has been temporarily suspended! Please try again later!', 4000 );
              this.loginTries.next( this.loginTries.value - 1 );
              break;
            default:
              this.showToast( err.message, 3000 );
          }
        } );


  }

  public signUpWithEmail( user: UserModel, password: string ) {


    this.afa.createUserWithEmailAndPassword( user.uEmail, password )
        .then( ( value ) => {

          user.uId = value.user.uid;
          this.addNewUser( user );

          this.router.navigate( [ '/', value.user.uid ] );
        } )
        .catch( ( err ) => {
          this.showToast( err.message, 3000 );
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
      return this.afs.collection<UserModel>( 'users',
                                             ref => ref.where( child, condition,
                                                               value ) );
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

  addManager( user: UserModel, uPassword: string ) {
    this.secondaryApp.auth().createUserWithEmailAndPassword( user.uEmail, uPassword )
        .then( ( value ) => {
          user.uId = value.user.uid;
          this.addNewUser( user );
          this.showToast( 'New Manger has been added to the system!' );
          this.secondaryApp.auth().signOut();
        } )
        .catch( ( err ) => {
          this.showToast( err.message, 3000 );
          this.loadingSubject.next( false );
        } );
  }

  deleteAccount( user: UserModel ) {
    this.removeUser( user );
    this.secondaryApp.auth().signInWithEmailAndPassword( user.uEmail, user.uPassword )
        .then( value => {
          this.secondaryApp.auth().currentUser.delete()
              .then( () => {
                this.showToast( 'User has been removed from the system!!!', 3000 );
              } );
          this.secondaryApp.auth().signOut();
        } );
  }
}
