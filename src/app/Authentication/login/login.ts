import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthHelper } from '../../core/helpers/auth.helper';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  public loginErrorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
    if (AuthHelper.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onLogin(email: string, password: string): void {
    // console.log('Entered Email:', email);
    // console.log('Entered Password:', password);
    // Here you would typically handle the login logic, such as calling an authentication service.
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        // Store tokens or user info (you can store just token or a user object)
        AuthHelper.setAuthData(accessToken, refreshToken);

        // Redirect to dashboard or your default route
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login failed:', err);

        // You can access backend error message like this
        const errorMessage = err?.error?.message || 'Something went wrong';

        // Show it in UI (e.g., using a toast or an error field)
        this.loginErrorMessage = errorMessage;

        setTimeout(() => {
          this.loginErrorMessage = ''; // Clear the error message after a while
        }, 2000); // Clear after 5 seconds
      },
    });
  }
}
