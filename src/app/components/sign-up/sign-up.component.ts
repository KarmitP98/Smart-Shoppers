import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../model/models';

@Component( {
              selector: 'app-sign-up',
              templateUrl: './sign-up.component.html',
              styleUrls: [ './sign-up.component.css' ]
            } )
export class SignUpComponent implements OnInit {

  uType = 'customer';
  uEmail: string;
  uPassword: string;
  uName: string;

  constructor( private userService: UserService ) { }

  ngOnInit(): void {
  }

  public signUpWithEmail(): void {
    const user: UserModel = {
      uId: 'temp',
      uEmail: this.uEmail,
      uName: this.uName,
      uProPic: this.uType === 'customer' ? 'assets/images/customer-pro.png' : this.uType === 'manager' ? 'assets/images/manager-pro.png' : 'assets/images/admin-pro.png',
      uType: this.uType
    };

    this.userService.signUpWithEmail( user, this.uPassword );

  }

}
