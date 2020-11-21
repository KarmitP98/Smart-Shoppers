import { Component, Input, OnInit } from '@angular/core';
import { UserModel } from '../../../model/models';
import { UserService } from '../../../services/user.service';
import { StoreService } from '../../../services/store.service';
import { MatDialog } from '@angular/material/dialog';
import { StoreSelectionComponent } from '../../store-selection/store-selection.component';

@Component( {
              selector: 'app-manager',
              templateUrl: './manager.component.html',
              styleUrls: [ './manager.component.css' ]
            } )
export class ManagerComponent implements OnInit {

  @Input( 'user' ) user: UserModel;

  constructor( public userService: UserService,
               public storeService: StoreService,
               public dialog: MatDialog ) { }

  ngOnInit(): void {
  }

  selectStore(): any {
    const dialogRef = this.dialog.open( StoreSelectionComponent, {
      data: 'manager',
      width: '75vw',
      height: '75vh'
    } );

    dialogRef.afterClosed().subscribe( result => {
      console.log( `Dialog result: ${ result }` );
    } );
  }
}
