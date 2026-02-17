/**
 * Theme Management - Dark/Light Mode Toggle
 * Handles theme switching with localStorage persistence
 */

class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || this.getPreferredTheme();
        this.init();
    }

    /**
     * Initialize theme manager
     */
    init() {
        this.applyTheme(this.theme);
        this.attachEventListeners();
        this.watchSystemTheme();
    }

    /**
     * Get stored theme from localStorage
     */
    getStoredTheme() {
        return localStorage.getItem('vloracode-theme');
    }

    /**
     * Get user's preferred theme from system
     */
    getPreferredTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Apply theme to document
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
        this.updateToggleButton();

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    /**
     * Toggle between light and dark themes
     */
    toggle() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        localStorage.setItem('vloracode-theme', newTheme);

        // Add smooth transition animation
        this.animateThemeTransition();
    }

    /**
     * Update toggle button UI
     */
    updateToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;

        const icon = toggleBtn.querySelector('.theme-icon');
        if (!icon) return;

        if (this.theme === 'dark') {
            icon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>
      `;
            toggleBtn.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
        </svg>
      `;
            toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    /**
     * Animate theme transition
     */
    animateThemeTransition() {
        document.documentElement.style.transition = 'background-color 0.3s ease-in-out, color 0.3s ease-in-out';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }

    /**
     * Watch for system theme changes
     */
    watchSystemTheme() {
        if (!window.matchMedia) return;

        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        darkModeQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.theme;
    }

    /**
     * Set specific theme
     */
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
            localStorage.setItem('vloracode-theme', theme);
        }
    }
}

// Initialize theme manager when DOM is ready
let themeManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        themeManager = new ThemeManager();
    });
} else {
    themeManager = new ThemeManager();
}

// Export for use in other scripts
window.ThemeManager = ThemeManager;
window.themeManager = themeManager;
