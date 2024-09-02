import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const canActivateMemberGuard: CanActivateFn = async (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    try {
        let user = authService.userData;
        if (!user) {
            const $user = authService.retrieveUsedData();
            if ($user) {
                user = await lastValueFrom($user);
            }
        }

        if (!user) {
            router.navigate(['guest', 'sign-in']);
            return false;
        }

        return true;
    } catch (e) {
        console.log('...', e);
        router.navigate(['guest', 'sign-in']);
        return false;
    }
};
