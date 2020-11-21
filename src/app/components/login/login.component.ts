import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component( {
              selector: 'app-login',
              templateUrl: './login.component.html',
              styleUrls: [ './login.component.css' ]
            } )
export class LoginComponent implements OnInit {

  userLevel = 'customer';
  uEmail: string;
  uPassword: string;

  constructor( private userService: UserService ) { }

  ngOnInit(): void {
  }

  loginWithEmail(): void {
    this.userService.loginWithEmailandPassword( this.uEmail, this.uPassword, this.userLevel );
  }
}
