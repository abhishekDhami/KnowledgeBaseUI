import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import User from '../model/userModel';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserauthService {
  isUserLoggedin = new BehaviorSubject(false); // if user is logged in
  currentUser = new User();
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('userToken')) {
      this.isUserLoggedin.next(true);
    }
  }

  //Validating user with Username and password
  validateUser(user: User) {
    let option = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http
      .post(
        `${this.apiUrl}/login`,
        { username: user.username, password: user.password },
        { headers: option }
      )
      .toPromise();
  }

  //for Registering new User
  registerUser(user: User) {
    let option = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http
      .post(`${this.apiUrl}/register`, user, { headers: option })
      .toPromise();
  }

  //Signin/ Signup wih Google
  authGoogleUser(token: string) {
    let option = new HttpHeaders({ 'Content-type': 'application/json' });
    return this.http
      .post(
        `${this.apiUrl}/authSocialUser`,
        { idToken: token },
        { headers: option }
      )
      .toPromise();
  }

  //To set JWT token in user's session
  setSession(token: 'string', user: User) {
    sessionStorage.setItem('userToken', token);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.isUserLoggedin.next(true);
  }

  //To remove token session, for Logout
  removeSession() {
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('currentUser');
    this.isUserLoggedin.next(false);
  }
}
