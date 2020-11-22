import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component( {
              selector: 'app-manager',
              templateUrl: './manager.component.html',
              styleUrls: [ './manager.component.css' ]
            } )
export class ManagerComponent implements OnInit {

  constructor( public userService: UserService ) { }

  ngOnInit(): void {
  }

  // selectStore(): any {
  //   const dialogRef = this.dialog.open( StoreSelectionComponent, {
  //     data: 'manager',
  //     width: '75vw',
  //     height: '75vh'
  //   } );
  //
  //   dialogRef.afterClosed().subscribe( result => {
  //     console.log( `Dialog result: ${ result }` );
  //   } );
  // }
}
