import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../shared-models/auth.model';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  router: any;
  // private baseUrl: string = 'https://identitytoolkit.googleapis.com';
  // private apiKey: string = 'AIzaSyDQWLuunIH5qc8P8iM6_j9juacJh-hHgWA';
  constructor(private http: HttpClient) {}

  singup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        environment.firebaseBaseUrl +
          '/v1/accounts:signUp?key=' +
          environment.firebaseAuthKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        map((resData) => {
          this.handleAuthentication;
          const expires = +Number(resData.expiresIn);
          resData.expiresIn = expires.toString();
          return resData;
        }),
        catchError((error) => {
          throw this.handleError(error);
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        environment.firebaseBaseUrl +
          '/v1/accounts:signInWithPassword?key=' +
          environment.firebaseAuthKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        map((resData) => {
          this.handleAuthentication;
          const expires = +Number(resData.expiresIn);
          resData.expiresIn = expires.toString();
          return resData;
        }),
        catchError((error) => {
          throw this.handleError(error);
        })
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured';
    if (!errorRes.error || !errorRes.error.error) {
      throw errorMessage;
    }
    console.log(errorMessage);
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Password is invalid';
        break;
    }
    throw errorMessage;
  }
}
