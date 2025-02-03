import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment'; // Adjusted path
import { LoginRequest, LoginResponse } from './auth.model'; // Ensure auth.model.ts is created

/**
 * Authentication Service to handle user login, logout, and token management.
 * Uses JWT for authentication and stores the token in local storage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Observable for login status

  constructor(private http: HttpClient) { }

  /**
   * Logs in a user with provided credentials.
   * On successful login, sets the JWT token and updates login status.
   * @param credentials LoginRequest containing username and password.
   * @returns Observable of LoginResponse, including the JWT token.
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token); // Store token in local storage
          this.isLoggedInSubject.next(true); // Update login status to logged in
        })
      );
  }

  /**
   * Logs out the current user.
   * Removes the JWT token from local storage and updates login status.
   */
  logout(): void {
    this.removeToken(); // Remove token from local storage
    this.isLoggedInSubject.next(false); // Update login status to logged out
    // No need to redirect here, components or guards can handle navigation on logout.
  }

  /**
   * Retrieves the JWT token from local storage.
   * @returns JWT token string or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem('authToken'); // Store token in localStorage
  }

  /**
   * Sets the JWT token in local storage.
   * @param token JWT token string.
   * @private
   */
  private setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Removes the JWT token from local storage.
   * @private
   */
  private removeToken(): void {
    localStorage.removeItem('authToken');
  }

  /**
   * Checks if a JWT token exists in local storage.
   * @returns boolean, true if token exists, false otherwise.
   * @private
   */
  private hasToken(): boolean {
    return !!this.getToken(); // Check if getToken() returns a truthy value (non-empty token)
  }

  /**
   * Checks if the user is currently authenticated (has a token).
   * @returns boolean, true if authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    return this.hasToken(); // Simple authentication check - for real apps, validate token on server regularly
  }
}
