class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'user-theme-preference';
    this.THEME_ATTRIBUTE = 'data-theme';
    this.currentTheme = null;

    this.init();
  }

  init() {
    this.currentTheme = this.getInitialTheme();
    this.applyTheme(this.currentTheme, false);
    this.setupToggleButton();
  }

  getInitialTheme() {
    const storedTheme = this.getStoredTheme();

    if (storedTheme) {
      return storedTheme;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  getStoredTheme() {
    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Unable to access localStorage:', error);
      return null;
    }
  }

  storeTheme(theme) {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Unable to store theme preference:', error);
    }
  }

  applyTheme(theme, shouldTransition = true) {
    const root = document.documentElement;

    if (!shouldTransition) {
      root.style.transition = 'none';
    }

    if (theme === 'dark') {
      root.setAttribute(this.THEME_ATTRIBUTE, 'dark');
    } else {
      root.removeAttribute(this.THEME_ATTRIBUTE);
    }

    this.currentTheme = theme;
    this.storeTheme(theme);

    this.updateToggleButton(theme);

    if (!shouldTransition) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          root.style.transition = '';
        });
      });
    }

    this.announceThemeChange(theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme, true);
  }

  setupToggleButton() {
    const button = document.getElementById('theme-toggle');

    if (!button) {
      console.warn('Theme toggle button not found');
      return;
    }

    button.addEventListener('click', () => {
      this.toggleTheme();
    });

    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleTheme();
      }
    });

    this.updateToggleButton(this.currentTheme);

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handler = (e) => {
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? 'dark' : 'light', true);
        }
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handler);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handler);
      }
    }
  }

  updateToggleButton(theme) {
    const button = document.getElementById('theme-toggle');

    if (!button) return;

    const isDark = theme === 'dark';

    button.setAttribute('aria-pressed', isDark.toString());
    button.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    button.title = `Switch to ${isDark ? 'light' : 'dark'} theme`;
  }

  announceThemeChange(theme) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Theme changed to ${theme} mode`;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.applyTheme(theme, true);
    }
  }
}

const themeManager = new ThemeManager();

if (typeof window !== 'undefined') {
  window.themeManager = themeManager;
}