import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service'; // Adjusted path
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Login Component for user authentication.
 * Handles login form, submission, and redirection on successful login.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  returnUrl!: string; // URL to redirect to after login

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({ // Initialize login form with FormBuilder
      username: ['', Validators.required], // Username field, required validator
      password: ['', Validators.required]  // Password field, required validator
    });
    // Get the return URL from query parameters or default to scheduler page.
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/scheduler'; // Default redirect after login
  }

  /**
   * Handles form submission for login.
   * Validates form, calls AuthService to login, and navigates on success/failure.
   */
  onSubmit(): void {
    if (this.loginForm.valid) { // Check if the form is valid
      this.errorMessage = null; // Reset error message
      this.authService.login(this.loginForm.value).subscribe({ // Call AuthService login method
        next: () => {
          this.router.navigateByUrl(this.returnUrl); // Redirect to return URL on successful login
        },
        error: (error) => {
          this.errorMessage = 'Invalid username or password.'; // Display error message to user
          console.error('Login error:', error); // Log detailed error to console for debugging
        }
      });
    }
  }
}
