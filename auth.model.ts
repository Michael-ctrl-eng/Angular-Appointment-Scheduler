/**
 * Interface for the login request payload.
 * Defines the structure for sending username and password to the login API.
 */
export interface LoginRequest {
  username?: string;
  password?: string;
}

/**
 * Interface for the login response payload.
 * Defines the structure for receiving the JWT token after successful login.
 */
export interface LoginResponse {
  token: string;
}
