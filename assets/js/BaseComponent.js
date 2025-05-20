/**
 * BaseComponent class that provides common functionality and accessibility features
 * for all components in the medical system
 */
class BaseComponent {
    constructor(element, options = {}) {
        if (!element) {
            throw new Error('Element is required for BaseComponent');
        }
        
        this.element = element;
        this.options = {
            id: options.id || this.generateId(),
            ariaLabel: options.ariaLabel || '',
            role: options.role || '',
            focusable: options.focusable !== undefined ? options.focusable : true,
            ...options
        };
        
        this.storage = new StorageManager();
        this.init();
    }

    init() {
        this.setupAccessibility();
        this.setupEventListeners();
    }

    setupAccessibility() {
        // Set ARIA attributes
        if (this.options.ariaLabel) {
            this.element.setAttribute('aria-label', this.options.ariaLabel);
        }
        if (this.options.role) {
            this.element.setAttribute('role', this.options.role);
        }
        
        // Make element focusable if needed
        if (this.options.focusable) {
            this.element.tabIndex = 0;
        }
        
        // Add keyboard navigation
        this.element.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    setupEventListeners() {
        // Focus management
        this.element.addEventListener('focus', this.handleFocus.bind(this));
        this.element.addEventListener('blur', this.handleBlur.bind(this));
        
        // Touch events for mobile
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleKeyDown(event) {
        // Default keyboard navigation
        switch (event.key) {
            case 'Enter':
            case 'Space':
                this.handleActivation(event);
                break;
            case 'Escape':
                this.handleEscape(event);
                break;
            case 'Tab':
                this.handleTab(event);
                break;
        }
    }

    handleActivation(event) {
        // Override in child components
    }

    handleEscape(event) {
        // Override in child components
        this.element.blur();
    }

    handleTab(event) {
        // Override in child components
    }

    handleFocus(event) {
        this.element.classList.add('focused');
        this.announceToScreenReader(this.options.ariaLabel);
    }

    handleBlur(event) {
        this.element.classList.remove('focused');
    }

    handleTouchStart(event) {
        this.element.classList.add('touch-active');
    }

    handleTouchEnd(event) {
        this.element.classList.remove('touch-active');
    }

    // Utility methods
    generateId() {
        return `component-${Math.random().toString(36).substr(2, 9)}`;
    }

    announceToScreenReader(message) {
        if (!message) return;
        
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('class', 'sr-only');
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    showLoadingState() {
        this.element.setAttribute('aria-busy', 'true');
        this.element.classList.add('loading');
    }

    hideLoadingState() {
        this.element.setAttribute('aria-busy', 'false');
        this.element.classList.remove('loading');
    }

    disable() {
        this.element.setAttribute('aria-disabled', 'true');
        this.element.classList.add('disabled');
        if (this.options.focusable) {
            this.element.tabIndex = -1;
        }
    }

    enable() {
        this.element.removeAttribute('aria-disabled');
        this.element.classList.remove('disabled');
        if (this.options.focusable) {
            this.element.tabIndex = 0;
        }
    }

    show() {
        this.element.removeAttribute('hidden');
        this.element.setAttribute('aria-hidden', 'false');
    }

    hide() {
        this.element.setAttribute('hidden', '');
        this.element.setAttribute('aria-hidden', 'true');
    }

    setError(message) {
        this.element.setAttribute('aria-invalid', 'true');
        this.element.classList.add('error');
        
        const errorId = `${this.options.id}-error`;
        let errorElement = document.getElementById(errorId);
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = errorId;
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            this.element.parentNode.insertBefore(errorElement, this.element.nextSibling);
        }
        
        errorElement.textContent = message;
        this.element.setAttribute('aria-describedby', errorId);
    }

    clearError() {
        this.element.removeAttribute('aria-invalid');
        this.element.classList.remove('error');
        
        const errorId = `${this.options.id}-error`;
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.remove();
        }
        
        this.element.removeAttribute('aria-describedby');
    }

    destroy() {
        // Remove all event listeners
        this.element.removeEventListener('keydown', this.handleKeyDown);
        this.element.removeEventListener('focus', this.handleFocus);
        this.element.removeEventListener('blur', this.handleBlur);
        this.element.removeEventListener('touchstart', this.handleTouchStart);
        this.element.removeEventListener('touchend', this.handleTouchEnd);
        
        // Remove all attributes and classes added by the component
        this.element.removeAttribute('aria-label');
        this.element.removeAttribute('role');
        this.element.removeAttribute('tabindex');
        this.element.removeAttribute('aria-busy');
        this.element.removeAttribute('aria-disabled');
        this.element.removeAttribute('aria-hidden');
        this.element.removeAttribute('aria-invalid');
        this.element.removeAttribute('aria-describedby');
        
        this.element.classList.remove('focused', 'touch-active', 'loading', 'disabled', 'error');
    }
} 