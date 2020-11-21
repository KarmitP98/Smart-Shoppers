import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from '../../../model/models';
import { UserService } from '../../../services/user.service';
import { StoreService } from '../../../services/store.service';
import { MatDialog } from '@angular/material/dialog';

@Component( {
              selector: 'app-admin',
              templateUrl: './admin.component.html',
              styleUrls: [ './admin.component.css' ]
            } )
export class AdminComponent implements OnInit {


  @Input( 'user' ) user: UserModel;

  constructor( public userService: UserService,
               public storeService: StoreService,
               public dialog: MatDialog ) { }

  ngOnInit(): void {
  }

  selectStore(): void {

  }

}
