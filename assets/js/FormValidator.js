/**
 * FormValidator class for handling client-side form validation
 * with support for custom validation rules and accessibility
 */
class FormValidator {
    constructor(form, options = {}) {
        this.form = form;
        this.options = {
            validateOnInput: true,
            validateOnBlur: true,
            showErrorsOnSubmit: true,
            scrollToError: true,
            errorClass: 'error',
            successClass: 'success',
            errorMessageClass: 'error-message',
            ...options
        };
        
        this.validators = {
            required: (value) => ({
                valid: value.length > 0,
                message: 'This field is required'
            }),
            email: (value) => ({
                valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'Please enter a valid email address'
            }),
            phone: (value) => ({
                valid: /^\+?[\d\s-]{10,}$/.test(value),
                message: 'Please enter a valid phone number'
            }),
            date: (value) => {
                const date = new Date(value);
                return {
                    valid: !isNaN(date.getTime()),
                    message: 'Please enter a valid date'
                };
            },
            minLength: (value, length) => ({
                valid: value.length >= length,
                message: `Please enter at least ${length} characters`
            }),
            maxLength: (value, length) => ({
                valid: value.length <= length,
                message: `Please enter no more than ${length} characters`
            }),
            pattern: (value, pattern) => ({
                valid: new RegExp(pattern).test(value),
                message: 'Please match the requested format'
            }),
            numeric: (value) => ({
                valid: /^\d+$/.test(value),
                message: 'Please enter numbers only'
            }),
            match: (value, matchId) => {
                const matchElement = document.getElementById(matchId);
                return {
                    valid: matchElement && value === matchElement.value,
                    message: 'Fields do not match'
                };
            }
        };
        
        this.init();
    }

    init() {
        if (this.options.validateOnInput) {
            this.form.addEventListener('input', this.handleInput.bind(this));
        }
        
        if (this.options.validateOnBlur) {
            this.form.addEventListener('blur', this.handleBlur.bind(this), true);
        }
        
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Add custom validators from options
        if (this.options.customValidators) {
            Object.assign(this.validators, this.options.customValidators);
        }
    }

    handleInput(event) {
        if (event.target.dataset.validate) {
            this.validateField(event.target);
        }
    }

    handleBlur(event) {
        if (event.target.dataset.validate) {
            this.validateField(event.target);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        
        const isValid = this.validateForm();
        
        if (isValid) {
            if (this.options.onSuccess) {
                this.options.onSuccess(this.form);
            }
        } else if (this.options.showErrorsOnSubmit) {
            this.showFormErrors();
        }
    }

    validateField(field) {
        const validations = field.dataset.validate.split(',').map(v => v.trim());
        let isValid = true;
        let errorMessage = '';
        
        for (const validation of validations) {
            const [rule, param] = validation.split(':');
            
            if (this.validators[rule]) {
                const result = this.validators[rule](field.value, param);
                if (!result.valid) {
                    isValid = false;
                    errorMessage = result.message;
                    break;
                }
            }
        }
        
        this.updateFieldStatus(field, isValid, errorMessage);
        return isValid;
    }

    validateForm() {
        const fields = this.form.querySelectorAll('[data-validate]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    updateFieldStatus(field, isValid, errorMessage = '') {
        const container = field.closest('.form-group') || field.parentElement;
        
        // Remove existing status classes
        container.classList.remove(this.options.errorClass, this.options.successClass);
        
        // Remove existing error message
        const existingError = container.querySelector(`.${this.options.errorMessageClass}`);
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid) {
            // Add error class and message
            container.classList.add(this.options.errorClass);
            
            const errorElement = document.createElement('div');
            errorElement.className = this.options.errorMessageClass;
            errorElement.setAttribute('role', 'alert');
            errorElement.textContent = errorMessage;
            
            container.appendChild(errorElement);
            
            // Update ARIA attributes
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', `${field.id}-error`);
        } else {
            // Add success class
            container.classList.add(this.options.successClass);
            
            // Update ARIA attributes
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        }
    }

    showFormErrors() {
        const firstError = this.form.querySelector(`.${this.options.errorClass}`);
        
        if (firstError && this.options.scrollToError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const input = firstError.querySelector('input, select, textarea');
            if (input) {
                input.focus();
            }
        }
    }

    addValidator(name, validator) {
        this.validators[name] = validator;
    }

    removeValidator(name) {
        delete this.validators[name];
    }

    reset() {
        this.form.reset();
        const errorMessages = this.form.querySelectorAll(`.${this.options.errorMessageClass}`);
        errorMessages.forEach(error => error.remove());
        
        const fields = this.form.querySelectorAll('[data-validate]');
        fields.forEach(field => {
            const container = field.closest('.form-group') || field.parentElement;
            container.classList.remove(this.options.errorClass, this.options.successClass);
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        });
    }

    destroy() {
        if (this.options.validateOnInput) {
            this.form.removeEventListener('input', this.handleInput);
        }
        
        if (this.options.validateOnBlur) {
            this.form.removeEventListener('blur', this.handleBlur, true);
        }
        
        this.form.removeEventListener('submit', this.handleSubmit);
    }
} 