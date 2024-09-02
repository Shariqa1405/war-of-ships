import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { IFirebaseUser } from '../../../models/interfaces/firebase-user.interface';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.css',
})
export class SignInComponent {
    public form: FormGroup;

    public isLoginMode = true;
    public error: string | null = null;

    constructor(private authService: AuthService, private router: Router, private readonly fb: FormBuilder) {
        this.form = this.fb.group({
            email: ['gmaisuradze88@gmail.com', [Validators.required, Validators.minLength(3)]],
            password: ['asdASD123!', [Validators.required]],
        });
    }

    public onSwithcMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit() {
        if (!this.form.valid) {
            return;
        }
        const email = this.form.value.email;
        const password = this.form.value.password;

        let authObs: Observable<IFirebaseUser>;

        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.singup(email, password);
        }

        authObs.subscribe({
            next: () => {
                this.router.navigate(['member']);
            },
            error: (e) => {
                this.error = 'failed';
            },
        });
        this.form.reset();
    }
}
