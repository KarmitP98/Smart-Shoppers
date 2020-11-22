import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable( {
               providedIn: 'root'
             } )
export class AuthGuard implements CanActivate, CanDeactivate<any>, CanActivateChild {

  constructor( private afa: AngularFireAuth,
               private router: Router ) {}


  canActivate( route: ActivatedRouteSnapshot,
               state: RouterStateSnapshot ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise( resolve => {
      const sub = this.afa.authState
                      .subscribe( ( value ) => {
                        if ( value ) {
                          resolve( true );
                        } else {
                          resolve( this.router.navigate( [ '/login' ] ) );
                        }
                      } );
    } );

  }

  canDeactivate( component: any, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot ):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Promise( resolve => {
      const sub = this.afa.authState
                      .subscribe( ( value ) => {
                        if ( value ) {
                          // resolve( this.router.navigate( [ '/', value.uid ] ) );
                          resolve( false );
                        } else {
                          resolve( true );
                        }

                      } );
    } );

  }

  canActivateChild( childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot ):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise( resolve => {
      const sub = this.afa.authState
                      .subscribe( ( value ) => {
                        if ( value ) {
                          resolve( true );
                        } else {
                          resolve( this.router.navigate( [ '/login' ] ) );
                        }
                      } );
    } );
  }

}
