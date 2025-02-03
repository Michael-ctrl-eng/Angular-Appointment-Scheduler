import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service'; // Adjusted path
import { Observable } from 'rxjs';

/**
 * Route Guard to protect routes that require authentication.
 * Checks if the user is authenticated before allowing access to a route.
 */
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Checks if the user is authenticated before activating a route.
   * If authenticated, allows access; otherwise, redirects to the login page.
   * @param route ActivatedRouteSnapshot - the route being activated.
   * @param state RouterStateSnapshot - the state of the router.
   * @returns boolean or UrlTree or Observable or Promise indicating if route can be activated.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true; // Allow access to the route
    } else {
      // Redirect to login page with the requested URL as returnUrl query parameter.
      return this.router.parseUrl(`/login?returnUrl=${state.url}`); // Redirect to login, preserving intended URL
    }
  }
}
