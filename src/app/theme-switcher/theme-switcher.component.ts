import { Component } from '@angular/core';
import { ThemeService } from '../core/theme.service';

/**
 * Component for switching between light and dark themes.
 * Uses a toggle switch to allow users to dynamically change the application theme.
 */
@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent {
  isDarkMode = false; // Initial state, can be based on ThemeService's current theme

  constructor(private themeService: ThemeService) {
    this.isDarkMode = this.themeService.getCurrentTheme() === 'dark-theme'; // Initialize from ThemeService
  }

  /**
   * Toggles between light and dark themes when the switch is changed.
   * Updates the application theme via the ThemeService.
   */
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setTheme(this.isDarkMode ? 'dark-theme' : 'light-theme'); // Switch theme using ThemeService
  }
}
