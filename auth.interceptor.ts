import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service'; // Adjusted path

/**
 * HTTP Interceptor to automatically add JWT token to outgoing requests.
 * Excludes requests to the authentication endpoint itself to prevent infinite loops.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  /**
   * Intercepts outgoing HTTP requests and adds the JWT token to the Authorization header if available.
   * @param request The outgoing HttpRequest.
   * @param next HttpHandler to pass the request to the next interceptor or the backend.
   * @returns Observable of HttpEvent.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken(); // Get token from AuthService

    // Exclude auth requests (like login) to avoid interceptor loops if auth itself needs to call backend. Adjust path if needed.
    const isAuthRequest = request.url.includes('/auth/');

    if (token && !isAuthRequest) { // Only add token if it exists and not an auth request
      const authRequest = request.clone({ // Clone the request to avoid mutation
        setHeaders: {
          Authorization: `Bearer ${token}` // Add Authorization header with Bearer token
        }
      });
      return next.handle(authRequest); // Pass modified request to the next handler
    }
    return next.handle(request); // If no token or auth request, pass original request
  }
}
