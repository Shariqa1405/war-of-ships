import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-member',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './member.component.html',
    styleUrl: './member.component.css',
})
export class MemberComponent {}
