import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserModel } from '../../../../model/models';

@Component( {
              selector: 'app-add-manager',
              templateUrl: './add-manager.component.html',
              styleUrls: [ './add-manager.component.css' ]
            } )
export class AddManagerComponent implements OnInit {

  uName: string;
  uEmail: string;
  uPassword: string;

  constructor( public userService: UserService,
               public matDialog: MatDialog ) {
  }

  ngOnInit(): void {
  }

  addNewManager() {
    const user: UserModel = {
      uName: this.uName,
      uEmail: this.uEmail,
      disabled: false,
      uType: 'manager',
      uId: 'temp',
      uProPic: 'assets/images/manager-pro.png',
      mStoreIds: [],
      uLevel: 2,
      uPassword: this.uPassword
    };

    this.userService.addManager( user, this.uPassword );
    this.cancel();
  }

  cancel() {
    this.matDialog.closeAll();
  }

}
