/* ============================================
   CONTACT FORM
   Validation, error display, toast notifications
============================================ */

class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    if (!this.form) return;

    this.fields = {
      name: {
        input: document.getElementById('form-name'),
        error: document.getElementById('form-name-error'),
      },
      email: {
        input: document.getElementById('form-email'),
        error: document.getElementById('form-email-error'),
      },
      message: {
        input: document.getElementById('form-message'),
        error: document.getElementById('form-message-error'),
      },
    };

    this.toast = null;
    this._init();
  }

  _init() {
    this._createToastElement();
    this._bindEvents();
  }

  /* ---- Create toast container ---- */
  _createToastElement() {
    this.toast = document.createElement('div');
    this.toast.className = 'toast';
    this.toast.setAttribute('role', 'alert');
    this.toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(this.toast);
  }

  /* ---- Bind form events ---- */
  _bindEvents() {
    this.form.addEventListener('submit', (e) => this._handleSubmit(e));

    // Real-time validation on blur
    Object.values(this.fields).forEach(({ input }) => {
      input.addEventListener('blur', () => this._validateField(input.name));
      input.addEventListener('input', () => this._clearError(input.name));
    });
  }

  /* ---- Handle form submission ---- */
  _handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    for (const fieldName of Object.keys(this.fields)) {
      if (!this._validateField(fieldName)) {
        isValid = false;
      }
    }

    if (!isValid) return;

    // Simulate submission
    const submitBtn = this.form.querySelector('button[type="submit"]');
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;

    // Simulate network delay
    setTimeout(() => {
      submitBtn.classList.remove('btn--loading');
      submitBtn.disabled = false;
      this.form.reset();
      this._showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
    }, 1500);
  }

  /* ---- Validate a single field ---- */
  _validateField(fieldName) {
    const field = this.fields[fieldName];
    if (!field) return true;

    const value = field.input.value.trim();

    switch (fieldName) {
      case 'name':
        if (!value) {
          this._showError(fieldName, 'Please enter your name.');
          return false;
        }
        if (value.length < 2) {
          this._showError(fieldName, 'Name must be at least 2 characters.');
          return false;
        }
        break;

      case 'email':
        if (!value) {
          this._showError(fieldName, 'Please enter your email.');
          return false;
        }
        if (!this._isValidEmail(value)) {
          this._showError(fieldName, 'Please enter a valid email address.');
          return false;
        }
        break;

      case 'message':
        if (!value) {
          this._showError(fieldName, 'Please enter a message.');
          return false;
        }
        if (value.length < 10) {
          this._showError(fieldName, 'Message must be at least 10 characters.');
          return false;
        }
        break;
    }

    this._clearError(fieldName);
    return true;
  }

  /* ---- Email regex ---- */
  _isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ---- Show error ---- */
  _showError(fieldName, message) {
    const field = this.fields[fieldName];
    if (!field) return;

    field.input.classList.add('form-input--error');
    field.error.textContent = message;
  }

  /* ---- Clear error ---- */
  _clearError(fieldName) {
    const field = this.fields[fieldName];
    if (!field) return;

    field.input.classList.remove('form-input--error');
    field.error.textContent = '';
  }

  /* ---- Toast notification ---- */
  _showToast(message, type = 'success') {
    this.toast.textContent = message;
    this.toast.className = `toast toast--${type}`;

    // Trigger reflow for re-animation
    void this.toast.offsetWidth;
    this.toast.classList.add('toast--visible');

    // Auto-hide after 4 seconds
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      this.toast.classList.remove('toast--visible');
    }, 4000);
  }
}

// Export for use in main.js
window.ContactForm = ContactForm;
