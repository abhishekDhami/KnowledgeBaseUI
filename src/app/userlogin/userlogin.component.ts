import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import User from '../model/userModel';
import { UserauthService } from '../services/userauth.service';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css'],
})
export class UserloginComponent implements OnInit {
  userHasAccount: boolean = true;
  showGoogleButton: boolean = true;
  signinForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Za-z0-9_-]{8,15}$'),
    ]),
    emailid: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^[A-Za-z0-9_-]{8,15}$'),
    ]),
  });
  socialUser: SocialUser | undefined;
  errorMessage = '';

  constructor(
    private userAuthService: UserauthService,
    private route: Router,
    private socialAuthService: SocialAuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    //If user is already loggedin, then redirect to Knowledge Home page
    if (this.userAuthService.isUserLoggedin.value) {
      this.route.navigateByUrl('/knowledgehome');
      return;
    }
  }

  //Toggeling between Sign in and Sign up
  toggleSignInForm() {
    this.userHasAccount = !this.userHasAccount;
    this.showGoogleButton = true;
    this.signinForm.reset();
    this.errorMessage = '';
  }

  //Handle Login and Registration functionalities
  handleContinueButton() {
    //Cleaning errors
    this.errorMessage = '';
    this.spinner.show();
    //Creating users from form values
    let user = new User(
      this.signinForm.get('username')?.value,
      this.signinForm.get('password')?.value,
      this.signinForm.get('emailid')?.value
    );

    //Handling Registration for new User
    if (
      !this.userHasAccount &&
      this.validateInput(
        this.signinForm.get('username'),
        this.signinForm.get('password'),
        this.signinForm.get('emailid')
      )
    ) {
      this.userAuthService.registerUser(user).subscribe(
        (res: any) => {
          this.userAuthService.setSession(res.token, res.user);
          this.route.navigateByUrl('/knowledgehome');
        },
        (err: any) => {
          this.errorMessage = this.handleError(err);
        },
        () => {
          this.spinner.hide();
        }
      );
    }
    //Handling Login for Existing Users
    else if (
      this.userHasAccount &&
      this.validateInput(
        this.signinForm.get('username'),
        this.signinForm.get('password')
      )
    ) {
      this.userAuthService.validateUser(user).subscribe(
        (res: any) => {
          this.userAuthService.setSession(res.token, res.user);
          this.route.navigateByUrl('/knowledgehome');
        },
        (err: any) => {
          this.errorMessage = this.handleError(err);
        },
        () => {
          this.spinner.hide();
        }
      );
    } else {
      this.spinner.hide();
    }
    return;
  }

  //Handling Google Sign in for Google users
  continueWithGoogle() {
    this.errorMessage = '';
    //Authenticating User with help of Google Social Auth Service
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data: SocialUser) => {
        this.spinner.show();
        this.userAuthService
          .authGoogleUser(data.idToken)
          .then((res: any) => {
            this.userAuthService.setSession(res.token, res.user);
            this.route.navigateByUrl('/knowledgehome');
          })
          .catch((err) => {
            //If user is not stored in database
            //Asking User to Select Username and Password, which will be stored in database
            //Disabling email field
            this.errorMessage = 'Please choose Username and Password!';
            this.userHasAccount = false;
            this.showGoogleButton = false;
            this.signinForm.get('username')?.setValue(data.firstName);
            this.signinForm.get('emailid')?.setValue(data.email);
            this.signinForm.get('emailid')?.disable();
          })
          .finally(() => {
            this.spinner.hide();
          });
      })
      .catch((err) => {
        this.errorMessage = this.handleError(err);
      });
  }

  //Validating User's input and displaying appropriate message
  validateInput(username: any, password: any, email?: any) {
    let errmsg = '';
    if (username.errors?.pattern || username.errors?.required) {
      errmsg =
        'Please Provide Username of 8-15 Characters with Alphanumeric values';
    } else if (email?.errors?.required || email?.errors?.pattern) {
      errmsg = 'Please provide proper Emailid';
    } else if (password.errors?.pattern || password.errors?.required) {
      errmsg =
        'Please Provide Password of 8-15 Characters with Alphanumeric values';
    }
    if (errmsg) {
      this.errorMessage = errmsg;
      return false;
    }
    {
      return true;
    }
  }

  //Handling error object and returning error message
  handleError(err: any) {
    if (err.error?.msg) return err.error.msg;
    if (err.statusText) return `${err.statusText}. Try After some Time`;
    if (err.message) return err.message;
    return 'Some Error Occured';
  }
}
