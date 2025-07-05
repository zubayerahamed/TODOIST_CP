import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements AfterViewInit{

@ViewChild('container') container!: ElementRef;
  // Registration fields
  firstName: string = '';
  lastName: string = '';
  signupEmail: string = '';
  signupPassword: string = '';

  // Login fields
  loginEmail: string = '';
  loginPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  

  ngAfterViewInit(): void {
  }

showRegister(): void {
  this.container.nativeElement.classList.add('active');
}

showLogin(): void {
  this.container.nativeElement.classList.remove('active');
}

  signup() {
    const signupData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.signupEmail,
      password: this.signupPassword
    };

    this.authService.signup(signupData).subscribe({
      next: (res) => {
        alert('Registration successful! Please login.');
        this.showLogin();
      },
      error: (err) => {
        alert('Registration failed.');
      }
    });
  }

  login() {
    const loginData = {
      email: this.loginEmail,
      password: this.loginPassword
    };

    this.authService.login(loginData).subscribe({
      next: (res) => {
        alert('Login successful!');
         this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        alert('Invalid credentials.');
      }
    });
  }

}
