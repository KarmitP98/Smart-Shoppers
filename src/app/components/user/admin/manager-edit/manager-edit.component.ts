import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { UserModel } from '../../../../model/models';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component( {
              selector: 'app-manager-edit',
              templateUrl: './manager-edit.component.html',
              styleUrls: [ './manager-edit.component.css' ]
            } )
export class ManagerEditComponent implements OnInit, OnDestroy {

  users: UserModel[] = [];
  userSub: Subscription;

  constructor( private route: ActivatedRoute,
               private userService: UserService,
               public dialog: MatDialog ) { }

  ngOnInit(): void {

    this.userSub = this.userService.fetchUser( 'uType', '==', 'manager' )
                       .valueChanges()
                       .subscribe( value => {
                         if ( value?.length > 0 ) {
                           this.users = value;
                         }
                       } );

  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
