```javascript
/* ============================================
   CONTACT FORM
   Formspree AJAX Submission
   Immediate redirect to index.html after success
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
    this.toastTimeout = null;

    this.init();
  }

  /* ============================================
     INITIALIZE
  ============================================ */

  init() {
    this.createToast();
    this.bindEvents();
  }

  /* ============================================
     CREATE TOAST
  ============================================ */

  createToast() {
    this.toast = document.createElement('div');

    this.toast.className = 'toast';
    this.toast.setAttribute('role', 'alert');
    this.toast.setAttribute('aria-live', 'polite');

    document.body.appendChild(this.toast);
  }

  /* ============================================
     BIND EVENTS
  ============================================ */

  bindEvents() {
    this.form.addEventListener('submit', (event) => {
      this.handleSubmit(event);
    });

    Object.entries(this.fields).forEach(([fieldName, field]) => {
      if (!field.input) return;

      field.input.addEventListener('blur', () => {
        this.validateField(fieldName);
      });

      field.input.addEventListener('input', () => {
        this.clearError(fieldName);
      });
    });
  }

  /* ============================================
     HANDLE FORM SUBMISSION
  ============================================ */

  async handleSubmit(event) {
    event.preventDefault();

    /* Validate all fields */
    let isValid = true;

    Object.keys(this.fields).forEach((fieldName) => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    /* Get submit button */
    const submitButton = this.form.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (!submitButton) {
      console.error('Contact form submit button not found.');
      return;
    }

    const buttonText = submitButton.querySelector('.btn__text');

    /* Save original button text */
    const originalText = buttonText
      ? buttonText.textContent
      : submitButton.value;

    /* Loading state */
    submitButton.disabled = true;
    submitButton.classList.add('btn--loading');

    if (buttonText) {
      buttonText.textContent = 'Sending...';
    } else if (submitButton.tagName === 'INPUT') {
      submitButton.value = 'Sending...';
    }

    try {
      /* ============================================
         FORMSPREE ENDPOINT

         Replace YOUR_FORM_ID with your actual
         Formspree form ID.

         Example:
         https://formspree.io/f/xabcdefg
      ============================================ */

      const response = await fetch(
        'https://formspree.io/f/xaennwbp',
        {
          method: 'POST',

          body: new FormData(this.form),

          headers: {
            Accept: 'application/json',
          },
        }
      );

      /* ============================================
         SUCCESS
      ============================================ */

      if (response.ok) {
        /*
         * Formspree successfully received the message.
         * Redirect immediately to index.html.
         */

        window.location.href = 'index.html';

        return;
      }

      /* ============================================
         FORMSPREE ERROR
      ============================================ */

      const data = await response.json().catch(() => null);

      let errorMessage =
        'Something went wrong. Please try again.';

      if (data && Array.isArray(data.errors)) {
        errorMessage = data.errors
          .map((error) => error.message)
          .filter(Boolean)
          .join(', ');
      }

      this.showToast(errorMessage, 'error');

    } catch (error) {
      /* ============================================
         NETWORK ERROR
      ============================================ */

      console.error('Contact form error:', error);

      this.showToast(
        'Unable to send your message. Please check your internet connection and try again.',
        'error'
      );

    } finally {
      /* Restore button if submission failed */
      submitButton.disabled = false;
      submitButton.classList.remove('btn--loading');

      if (buttonText) {
        buttonText.textContent = originalText;
      } else if (submitButton.tagName === 'INPUT') {
        submitButton.value = originalText;
      }
    }
  }

  /* ============================================
     VALIDATE FIELD
  ============================================ */

  validateField(fieldName) {
    const field = this.fields[fieldName];

    if (!field || !field.input) {
      return true;
    }

    const value = field.input.value.trim();

    switch (fieldName) {

      /* NAME */
      case 'name':

        if (!value) {
          this.showError(
            fieldName,
            'Please enter your name.'
          );

          return false;
        }

        if (value.length < 2) {
          this.showError(
            fieldName,
            'Name must be at least 2 characters.'
          );

          return false;
        }

        break;

      /* EMAIL */
      case 'email':

        if (!value) {
          this.showError(
            fieldName,
            'Please enter your email.'
          );

          return false;
        }

        if (!this.isValidEmail(value)) {
          this.showError(
            fieldName,
            'Please enter a valid email address.'
          );

          return false;
        }

        break;

      /* MESSAGE */
      case 'message':

        if (!value) {
          this.showError(
            fieldName,
            'Please enter a message.'
          );

          return false;
        }

        if (value.length < 10) {
          this.showError(
            fieldName,
            'Message must be at least 10 characters.'
          );

          return false;
        }

        break;
    }

    this.clearError(fieldName);

    return true;
  }

  /* ============================================
     EMAIL VALIDATION
  ============================================ */

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ============================================
     SHOW FIELD ERROR
  ============================================ */

  showError(fieldName, message) {
    const field = this.fields[fieldName];

    if (!field) return;

    if (field.input) {
      field.input.classList.add('form-input--error');
      field.input.setAttribute('aria-invalid', 'true');
    }

    if (field.error) {
      field.error.textContent = message;
    }
  }

  /* ============================================
     CLEAR FIELD ERROR
  ============================================ */

  clearError(fieldName) {
    const field = this.fields[fieldName];

    if (!field) return;

    if (field.input) {
      field.input.classList.remove('form-input--error');
      field.input.removeAttribute('aria-invalid');
    }

    if (field.error) {
      field.error.textContent = '';
    }
  }

  /* ============================================
     SHOW TOAST
  ============================================ */

  showToast(message, type = 'success') {
    if (!this.toast) return;

    clearTimeout(this.toastTimeout);

    this.toast.textContent = message;

    this.toast.className = `toast toast--${type}`;

    void this.toast.offsetWidth;

    this.toast.classList.add('toast--visible');

    this.toastTimeout = setTimeout(() => {
      this.toast.classList.remove('toast--visible');
    }, 5000);
  }
}

/* ============================================
   INITIALIZE CONTACT FORM
============================================ */

document.addEventListener('DOMContentLoaded', () => {
  window.contactForm = new ContactForm();
});
```
