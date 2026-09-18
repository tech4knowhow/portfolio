```javascript
/* ============================================
   CONTACT FORM
   Sends messages through Formspree
   Destination: misganatd7@gmail.com
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

    Object.values(this.fields).forEach(({ input }) => {
      input.addEventListener('blur', () => {
        this._validateField(input.name);
      });

      input.addEventListener('input', () => {
        this._clearError(input.name);
      });
    });
  }

  /* ---- Handle form submission ---- */
  async _handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    let isValid = true;

    for (const fieldName of Object.keys(this.fields)) {
      if (!this._validateField(fieldName)) {
        isValid = false;
      }
    }

    if (!isValid) return;

    const submitBtn = this.form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn__text');

    // Loading state
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;

    if (btnText) {
      btnText.textContent = 'Sending...';
    }

    try {
      /*
       * IMPORTANT:
       * Replace YOUR_FORM_ID with the Formspree
       * form ID connected to misganatd7@gmail.com.
       */
      const response = await fetch(
        'https://formspree.io/f/YOUR_FORM_ID',
        {
          method: 'POST',
          body: new FormData(this.form),
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (response.ok) {
        // Successfully sent
        this.form.reset();

        this._showToast(
          "Message sent successfully! I'll get back to you soon.",
          'success'
        );
      } else {
        // Formspree returned an error
        const data = await response.json().catch(() => null);

        const errorMessage =
          data?.errors?.map(error => error.message).join(', ') ||
          'Something went wrong. Please try again.';

        this._showToast(errorMessage, 'error');
      }
    } catch (error) {
      console.error('Contact form error:', error);

      this._showToast(
        'Unable to send your message. Please try again or email me directly.',
        'error'
      );
    } finally {
      // Restore button
      submitBtn.classList.remove('btn--loading');
      submitBtn.disabled = false;

      if (btnText) {
        btnText.textContent = 'Send Message';
      }
    }
  }

  /* ---- Validate a single field ---- */
  _validateField(fieldName) {
    const field = this.fields[fieldName];

    if (!field || !field.input) return true;

    const value = field.input.value.trim();

    switch (fieldName) {
      case 'name':
        if (!value) {
          this._showError(
            fieldName,
            'Please enter your name.'
          );
          return false;
        }

        if (value.length < 2) {
          this._showError(
            fieldName,
            'Name must be at least 2 characters.'
          );
          return false;
        }

        break;

      case 'email':
        if (!value) {
          this._showError(
            fieldName,
            'Please enter your email.'
          );
          return false;
        }

        if (!this._isValidEmail(value)) {
          this._showError(
            fieldName,
            'Please enter a valid email address.'
          );
          return false;
        }

        break;

      case 'message':
        if (!value) {
          this._showError(
            fieldName,
            'Please enter a message.'
          );
          return false;
        }

        if (value.length < 10) {
          this._showError(
            fieldName,
            'Message must be at least 10 characters.'
          );
          return false;
        }

        break;
    }

    this._clearError(fieldName);
    return true;
  }

  /* ---- Email validation ---- */
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

    void this.toast.offsetWidth;

    this.toast.classList.add('toast--visible');

    clearTimeout(this._toastTimeout);

    this._toastTimeout = setTimeout(() => {
      this.toast.classList.remove('toast--visible');
    }, 5000);
  }
}

// Export for use in main.js
window.ContactForm = ContactForm;
```
