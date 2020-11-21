import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../model/models';
import { Subscription } from 'rxjs';

@Component( {
              selector: 'app-user',
              templateUrl: './user.component.html',
              styleUrls: [ './user.component.css' ]
            } )
export class UserComponent implements OnInit, OnDestroy {

  user: UserModel;
  uId: string;
  userSub: Subscription;
  showFiller = false;

  constructor( private router: Router,
               private route: ActivatedRoute,
               private userService: UserService ) { }

  ngOnInit(): void {
    this.uId = this.route.snapshot.params.uId;
    this.userSub = this.userService.fetchUser( 'uId', '==', this.uId )
                       .valueChanges()
                       .subscribe( value => {
                         if ( value?.length > 0 ) {
                           this.user = value[0];
                         }
                       } );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
