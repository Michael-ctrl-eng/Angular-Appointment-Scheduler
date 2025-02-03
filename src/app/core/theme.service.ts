import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Theme Service for managing application themes dynamically.
 * Provides methods to switch between predefined themes (light/dark) and apply theme styles using CSS variables.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: 'light-theme' | 'dark-theme' = 'light-theme'; // Default theme
  private localStorageKey = 'scheduler-theme';

  /**
   * Predefined CSS variable sets for light and dark themes.
   * Extend or modify these to customize theme styles.
   */
  private themes = {
    'light-theme': {
      'primary-color': '#3f51b5',
      'primary-color-light': '#757de8',
      'primary-color-dark': '#002984',
      'accent-color': '#e91e63',
      'accent-color-light': '#ff6090',
      'accent-color-dark': '#b0003a',
      'warn-color': '#f44336',
      'background-color': '#fafafa',
      'surface-color': '#ffffff',
      'text-color-primary': 'rgba(0, 0, 0, 0.87)',
      'text-color-secondary': 'rgba(0, 0, 0, 0.6)',
      'divider-color': 'rgba(0, 0, 0, 0.12)',
      'scheduler-header-background': '#757de8', // Light primary color
      'event-list-background': '#ffffff',
      'event-item-background': '#e0f7fa',
      'event-item-border-color': '#00bcd4',
      'scheduler-toolbar-background': '#ffffff',
      'scheduler-toolbar-button-color': 'rgba(0, 0, 0, 0.87)',
    },
    'dark-theme': {
      'primary-color': '#212121',
      'primary-color-light': '#484848',
      'primary-color-dark': '#000000',
      'accent-color': '#ff4081',
      'accent-color-light': '#ff79b0',
      'accent-color-dark': '#c60055',
      'warn-color': '#d32f2f',
      'background-color': '#303030', // Dark background
      'surface-color': '#424242',    // Darker surfaces
      'text-color-primary': 'rgba(255, 255, 255, 0.87)', // Light text
      'text-color-secondary': 'rgba(255, 255, 255, 0.6)', // Lighter secondary text
      'divider-color': 'rgba(255, 255, 255, 0.12)', // Light divider
      'scheduler-header-background': '#484848', // Darker header background
      'event-list-background': '#424242',
      'event-item-background': '#546e7a', // Darker event item background
      'event-item-border-color': '#b2ebf2', // Light accent for dark theme
      'scheduler-toolbar-background': '#424242',
      'scheduler-toolbar-button-color': 'rgba(255, 255, 255, 0.87)',
    }
  };

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadThemeFromLocalStorage(); // Load theme preference from local storage on service init
    this.applyTheme(this.currentTheme); // Apply initial theme
  }

  /**
   * Switches to the specified theme and updates CSS variables.
   * @param themeName The name of the theme to switch to ('light-theme' or 'dark-theme').
   */
  setTheme(themeName: 'light-theme' | 'dark-theme'): void {
    if (this.themes[themeName]) {
      this.currentTheme = themeName;
      this.applyTheme(themeName);
      this.saveThemeToLocalStorage(themeName); // Save theme preference to local storage
    } else {
      console.warn(`Theme "${themeName}" not found.`);
    }
  }

  /**
   * Gets the currently active theme name.
   * @returns The current theme name ('light-theme' or 'dark-theme').
   */
  getCurrentTheme(): 'light-theme' | 'dark-theme' {
    return this.currentTheme;
  }

  /**
   * Applies the CSS variables for the given theme to the document root.
   * @param themeName The name of the theme to apply.
   * @private
   */
  private applyTheme(themeName: 'light-theme'): void {
    const theme = this.themes[themeName];
    if (theme) {
      Object.keys(theme).forEach(key => {
        this.renderer.setStyle(this.document.documentElement, `--${key}`, theme[key]);
      });
      this.document.body.classList.remove('light-theme', 'dark-theme'); // Remove previous theme classes
      this.document.body.classList.add(themeName); // Add current theme class to body
    }
  }

  /**
   * Loads the preferred theme name from local storage on application initialization.
   * @private
   */
  private loadThemeFromLocalStorage(): void {
    const storedTheme = localStorage.getItem(this.localStorageKey) as 'light-theme' | 'dark-theme';
    if (storedTheme && this.themes[storedTheme]) {
      this.currentTheme = storedTheme;
    }
  }

  /**
   * Saves the currently selected theme name to local storage.
   * @param themeName The name of the theme to save.
   * @private
   */
  private saveThemeToLocalStorage(themeName: string): void {
    localStorage.setItem(this.localStorageKey, themeName);
  }
}
