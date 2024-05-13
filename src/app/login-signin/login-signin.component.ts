import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../sharedServices/auth.service';
import { Observable, map, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-signin',
  templateUrl: './login-signin.component.html',
  styleUrl: './login-signin.component.css',
})
export class LoginSigninComponent implements OnInit, OnDestroy {
  showLogin: Observable<boolean>;
  showLogout: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {
    this.showLogin = of(true);
    this.showLogout = of(true);
    this.test();
  }

  ngOnInit() {
    // console.log(1111);
    // this.userSub.add(
    //   this.authService.user.subscribe((user) => {
    //     // console.log(user);
    //     this.isAuthenticated = true;
    //     console.log(this.isAuthenticated);
    //   })
    // );
    // console.log(this.isAuthenticated);
  }

  private test() {
    // this.userSub.add(
    //   this.authService.user.subscribe((user) => {
    //     // console.log(user);
    //     this.isAuthenticated = !!user;
    //     console.log(this.isAuthenticated);
    //   })
    // );
    // const a = this.authService.user.pipe(
    //   map((user) => {
    //     this.isAuthenticated = !!user;
    //   })
    // );
    // a.subscribe();
    this.showLogout = this.authService.user.pipe(map((user) => !!user));
    this.showLogin = this.showLogout.pipe(map((result) => !result));
  }

  profile() {}

  logout() {
    this.authService.user.next(null);
    this.router.navigate(['/Auth']);
    // this.isAuthenticated = of(false);
    // this.isAuthenticated.subscribe();
  }

  ngOnDestroy() {
    // this.userSub.unsubscribe();
  }
}
