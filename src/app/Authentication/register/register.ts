import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../../core/models/register-request.model';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { AuthHelper } from '../../core/helpers/auth.helper';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private authService = inject(AuthService);
  private alterService = inject(AlertService);
  private router = inject(Router);

  enteredFirstName: string = "";
  enteredLastName: string = "";
  enteredEmailAddress: string = "";
  enteredPassword: string = "";
  enteredConfirmPassword: string = "";

  firstNameError: string = "";
  emailAddressError: string = "";
  passwordError: string = "";
  confirmPasswordError: string = "";
  hasFormError: boolean = false;

  constructor(){
    if (AuthHelper.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  resetForm(){
    this.enteredFirstName = "";
    this.enteredLastName = "";
    this.enteredEmailAddress = "";
    this.enteredPassword = "";
    this.enteredConfirmPassword = "";
    this.firstNameError = "";
    this.emailAddressError = "";
    this.passwordError = "";
    this.confirmPasswordError = "";
    this.hasFormError = false;
  }

  validateForm(){
    this.firstNameError = "";
    this.emailAddressError = "";
    this.passwordError = "";
    this.confirmPasswordError = "";
    this.hasFormError = false;


    if(this.enteredFirstName == ''){
      this.firstNameError = 'Please enter your first name';
      this.hasFormError = true;
    }

    if(this.enteredEmailAddress == ''){
      this.emailAddressError = 'Please enter your email address';
      this.hasFormError = true;
    }

    if(this.enteredPassword == ''){
      this.passwordError = 'Please enter password';
      this.hasFormError = true;
    }

    if(this.enteredConfirmPassword == ''){
      this.confirmPasswordError = 'Please enter password';
      this.hasFormError = true;
    }

    if(this.enteredPassword !== this.enteredConfirmPassword){
      this.confirmPasswordError = 'Passwords do not match';
      this.hasFormError = true;
    }

  }

  onRegister(){

    this.validateForm();
    if(this.hasFormError){
      return;
    }

    const registerRequest: RegisterRequest = {
      firstName: this.enteredFirstName,
      lastName: this.enteredLastName,
      email: this.enteredEmailAddress,
      password: this.enteredPassword,
    }

    this.authService.signup(registerRequest).subscribe({
      next: (response: any) => {
        this.resetForm();
        this.alterService.success('Success!', 'Registered successfully');
        
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        // Store tokens or user info (you can store just token or a user object)
        AuthHelper.setAuthData(accessToken, refreshToken);
        AuthHelper.loadWorkspace();

        // Redirect to dashboard or your default route
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error(error);
        this.alterService.error('Error!', 'Registration failed');
      }
    });

  }
}
