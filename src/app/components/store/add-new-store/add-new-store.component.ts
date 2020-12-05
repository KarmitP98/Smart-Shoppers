import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StoreService } from '../../../services/store.service';
import { UserService } from '../../../services/user.service';
import { StoreModel } from '../../../model/models';

@Component( {
              selector: 'app-add-new-store',
              templateUrl: './add-new-store.component.html',
              styleUrls: [ './add-new-store.component.css' ]
            } )
export class AddNewStoreComponent implements OnInit {

  sName: string = '';
  postal: string = '';
  city: string = '';
  country: string = '';
  province: string = '';
  street: string = '';
  status: boolean = false;
  priceMult: number = 1;

  constructor( public matDialog: MatDialog,
               public storeService: StoreService,
               public userService: UserService ) {
  }

  ngOnInit(): void {
  }

  addNewStore() {
    const store: StoreModel = {
      sName: this.sName,
      sItems: [],
      sAreaCode: this.postal.slice( 0, 4 ),
      sCity: this.city,
      sCountry: this.country,
      sId: '',
      sManagerIds: [],
      sPostalCode: this.postal,
      sPriceMult: this.priceMult,
      sProvince: this.province,
      sStreet: this.street,
      status: this.status
    };
    this.storeService.addStore( store );
    this.userService.showToast( 'Successfully added a new Store!!!' );
    this.matDialog.closeAll();
  }


}
