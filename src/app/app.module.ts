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
import { PlayerComponent } from './single-player/player/player.component';

const routes: Routes = [
    { path: '', component: GameInfoComponent },
    { path: 'SinglePlayer', component: SinglePlayerComponent },
    { path: 'MultiPlayer', component: MultiplayerComponent },
    { path: 'How To Play', component: HowToPlayComponent },
    { path: 'Auth', component: AuthComponent },
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
        PlayerComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes),
        HttpClientModule,
        DragDropModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
