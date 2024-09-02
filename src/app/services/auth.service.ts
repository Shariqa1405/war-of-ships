import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, lastValueFrom, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { IFirebaseUser } from '../models/interfaces/firebase-user.interface';
import { IUser } from '../models/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private localStorageUserDataKey: string = environment.localStorageUserDataKey;
    private firebaseUrl: string = environment.firebaseBaseUrl;
    private firebaseAPIKey: string = environment.firebaseAuthKey;

    public user = new BehaviorSubject<IUser | null>(null);

    public get userData() {
        return this.user.value;
    }

    constructor(private http: HttpClient) {}

    public singup(email: string, password: string) {
        const apiEndpoint = `${this.firebaseUrl}/v1/accounts:signUp?key=${this.firebaseAPIKey}`;
        const body = { email: email, password: password, returnSecureToken: true };
        return this.http.post<IFirebaseUser>(apiEndpoint, body).pipe(
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
        const firebaseUser: IFirebaseUser | null = this.getUserDataFromLocalStore();

        if (!firebaseUser) {
            return of(null);
        }

        const body = { idToken: firebaseUser.idToken };
        return this.http.post<IFirebaseUser>(apiEndpoint, body).pipe(
            map((res: any) => {
                let user: IUser | null = null;

                if (res.users && res.users.length) {
                    user = {
                        id: res.users[0].localId,
                        email: res.users[0].email,
                    };
                    this.user.next(user);
                }

                return user;
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

        return user;
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
