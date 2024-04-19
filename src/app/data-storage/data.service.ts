import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private authService: AuthService) {}

  fetchData() {
    this.authService.user.pipe(take(1)).subscribe((user) => {
      if (user) {
        // if user is authenticated
      } else {
        // if user is not
      }
    });
  }
}
