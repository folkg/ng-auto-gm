import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  //TODO: Implement the basic profile screen where a user can edit only their email address
  //TODO: Implement a dialog form asking the user to enter their email address if it is not verified
  email = new FormControl('');
  user: Observable<any> = this.auth.user$;

  constructor(private auth: AuthService) {
    console.log('ProfileModule constructor');
    auth.user$.subscribe((user) => {
      if (user) {
        // this.email.setValue = user.email;
      }
    });
  }

  async updateEmail() {}
}
