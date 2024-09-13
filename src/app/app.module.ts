import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { GameInfoComponent } from './game-info/game-info.component';
import { LoginSigninComponent } from './login-signin/login-signin.component';
import { SinglePlayerComponent } from './single-player/single-player.component';
import { MultiplayerComponent } from './multiplayer/multiplayer.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { CleanComponent } from './clean/clean.component';
import { ComputerComponent } from './single-player/computer/computer.component';
import { ComputerBoardService } from './sharedServices/computerBoard.service';
import { MemberComponent } from './pages/member/member.component';
import { SignInComponent } from './pages/guest/sign-in/sign-in.component';
import { SignUpComponent } from './pages/guest/sign-up/sign-up.component';
import { DashboardComponent } from './pages/member/dashboard/dashboard.component';
import { MatchComponent } from './pages/member/match/match.component';
import { canActivateMemberGuard } from './guards/can-activate-member.guard';

const routes: Routes = [
    //{ path: '', component: GameInfoComponent },
    //{ path: 'SinglePlayer', component: SinglePlayerComponent },
    //{ path: 'MultiPlayer', component: MultiplayerComponent },
    //{ path: 'How To Play', component: HowToPlayComponent },
    //{ path: 'Auth', component: AuthComponent },

    { path: '', pathMatch: 'full', redirectTo: 'member' },

    {
        path: 'member',
        pathMatch: 'prefix',
        canActivate: [canActivateMemberGuard],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
            { path: 'dashboard', pathMatch: 'full', component: DashboardComponent },
            { path: 'match', pathMatch: 'full', component: MatchComponent },
        ],
    },
];

@NgModule({
    declarations: [
        AppComponent,
        GameInfoComponent,
        LoginSigninComponent,
        SinglePlayerComponent,
        MultiplayerComponent,
        HowToPlayComponent,
        CleanComponent,
        AuthComponent,
        ComputerComponent,
        MemberComponent,
        SignInComponent,
        SignUpComponent,
        DashboardComponent,
        MatchComponent,
    ],
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, RouterModule.forRoot(routes), HttpClientModule, DragDropModule],
    providers: [ComputerBoardService],
    bootstrap: [AppComponent],
})
export class AppModule {}
