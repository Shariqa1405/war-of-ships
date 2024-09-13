import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IFirebaseUser } from '../models/interfaces/firebase-user.interface';
import { IUser } from '../models/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private localStorageUserDataKey: string = environment.localStorageUserDataKey;
    private firebaseUrl: string = environment.firebaseBaseUrl;
    private firebaseAPIKey: string = environment.firebaseAuthKey;

    public user = new BehaviorSubject<IUser>(null);

    public get userData() {
        return lastValueFrom(this.user);
    }

    constructor(private http: HttpClient) {}

    public singup(email: string, password: string) {
        const apiEndpoint = `${this.firebaseUrl}/v1/accounts:signUp?key=${this.firebaseAPIKey}`;
        const body = { email: email, password: password, returnSecureToken: true };
        return this.http.post<IFirebaseUser>(apiEndpoint, body).pipe(
            map((res: IFirebaseUser) => {
                this.handleAuthentication(res);

                console.log(res);

                const expires = +Number(res.expiresIn);
                res.expiresIn = expires.toString();
                return res;
            }),
            catchError((error) => {
                throw this.handleError(error);
            })
        );
    }

    public login(email: string, password: string): Observable<IFirebaseUser> {
        return this.http
            .post<IFirebaseUser>(this.firebaseUrl + '/v1/accounts:signInWithPassword?key=' + this.firebaseAPIKey, {
                email: email,
                password: password,
                returnSecureToken: true,
            })
            .pipe(
                map((res: IFirebaseUser) => {
                    this.handleAuthentication(res);

                    const expires = +Number(res.expiresIn);
                    res.expiresIn = expires.toString();
                    return res;
                }),
                catchError((error) => {
                    throw this.handleError(error);
                })
            );
    }

    public retrieveUsedData() {
        const apiEndpoint = `${this.firebaseUrl}/v1/accounts:lookup?key=${this.firebaseAPIKey}`;
        const firebaseUser: IFirebaseUser = this.getUserDataFromLocalStore();

        if (!firebaseUser) {
            return null;
        }

        const body = { idToken: firebaseUser.idToken };
        return this.http.post<IFirebaseUser>(apiEndpoint, body).pipe(
            map((res: IFirebaseUser) => {
                console.log('retrieveUsedData', res);
                return res;
            }),
            catchError((error) => {
                throw this.handleError(error);
            })
        );
    }

    private handleAuthentication(firebaseUser: IFirebaseUser) {
        //const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user: IUser = {
            id: firebaseUser.localId,
            email: firebaseUser.email,
        };

        this.setUserDataIntoLocalStore(firebaseUser);

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

    private getUserDataFromLocalStore() {
        const raw = localStorage.getItem(this.localStorageUserDataKey);
        if (!raw) {
            return null;
        }
        return JSON.parse(raw) as IFirebaseUser;
    }

    private setUserDataIntoLocalStore(userData: IFirebaseUser) {
        localStorage.setItem(this.localStorageUserDataKey, JSON.stringify(userData));
    }
}
