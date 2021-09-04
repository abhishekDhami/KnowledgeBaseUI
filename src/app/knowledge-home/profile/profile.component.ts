import { Component, OnInit } from '@angular/core';
import User from 'src/app/model/userModel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  constructor() {}
  currentUser = new User();
  ngOnInit(): void {
    let currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUser = JSON.parse(currentUser);
    }
  }
}
