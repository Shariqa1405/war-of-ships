import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService, AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  isLoginMode = true;
  error: string = null;

  ngOnInit() {}

  onSwithcMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.singup(email, password);
    }

    authObs.subscribe(
      (resData) => {
        console.log(resData);
        this.authService.user.next(resData as any);
        this.router.navigate(['']);
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
      }
    );

    form.reset();
  }
}
