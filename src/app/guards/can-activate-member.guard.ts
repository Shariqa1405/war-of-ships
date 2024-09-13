import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const canActivateMemberGuard: CanActivateFn = async (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    try {
        const session = await authService.userData;
        console.log(session)
        if (!session) {
            await lastValueFrom(authService.retrieveUsedData());
        }
        return true;
    } catch (e) {
        router.navigate(['guest', 'sign-in']);
        return false;
    }
};


