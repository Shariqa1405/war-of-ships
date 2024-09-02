import { Routes } from '@angular/router';
import { canActivateMemberGuard } from './guards/can-activate-member.guard';

export const routes: Routes = [
    /**
     * Guest Routes
     */
    {
        path: 'guest',
        pathMatch: 'prefix',
        loadComponent: () => import('./pages/guest/guest.component').then((mod) => mod.GuestComponent),
        children: [
            {
                path: 'sign-in',
                pathMatch: 'full',
                loadComponent: () => import('./pages/guest/sign-in/sign-in.component').then((mod) => mod.SignInComponent),
            },
        ],
    },

    /**
     * Member
     */
    { path: '', pathMatch: 'full', redirectTo: 'member' },
    {
        path: 'member',
        pathMatch: 'prefix',
        canActivate: [canActivateMemberGuard],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            {
                path: 'dashboard',
                pathMatch: 'full',
                loadComponent: () => import('./pages/member/dashboard/dashboard.component').then((mod) => mod.DashboardComponent),
            },
            {
                path: 'match',
                pathMatch: 'full',
                loadComponent: () => import('./pages/member/match/match.component').then((mod) => mod.MatchComponent),
            },
        ],
    },
];
