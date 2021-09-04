import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserauthService } from './services/userauth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private userAuthService: UserauthService,
    private route: Router
  ) {}
  //Allowing navigation, if user is loggedin Successfully
  canActivate() {
    if (this.userAuthService.isUserLoggedin.value) {
      return true;
    } else {
      this.route.navigateByUrl('/login');
      return false;
    }
  }
}
