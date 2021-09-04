import { Component, OnInit } from '@angular/core';
import { UserauthService } from './services/userauth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  showNavBar = false;
  constructor(private userAuthService: UserauthService) {}
  ngOnInit() {
    //If user is logged in Show Navigation bar
    this.userAuthService.isUserLoggedin.subscribe((status) => {
      this.showNavBar = status;
    });
  }

  //Handle Logout functionality, Removing Session Data and making isUserLoggedIn to false
  userLogOut() {
    this.userAuthService.removeSession();
    this.userAuthService.isUserLoggedin.next(false);
  }
}
