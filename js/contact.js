/* ============================================
   CONTACT FORM
   Validation, Formspree submission,
   redirect, success/error toast notifications
============================================ */

class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');

    if (!this.form) return;

    this.fields = {
      name: document.getElementById('form-name'),
      email: document.getElementById('form-email'),
      message: document.getElementById('form-message')
    };

    this.errors = {
      name: document.getElementById('form-name-error'),
      email: document.getElementById('form-email-error'),
      message: document.getElementById('form-message-error')
    };

    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.buttonText = this.submitButton?.querySelector('.btn__text');

    this.init();
  }

  /* ============================================
     INITIALIZE
  ============================================ */

  init() {
    this.form.addEventListener('submit', (event) => {
      this.handleSubmit(event);
    });

    // Validate fields when the user leaves them
    Object.keys(this.fields).forEach((fieldName) => {
      const field = this.fields[fieldName];

      if (!field) return;

      field.addEventListener('blur', () => {
        this.validateField(fieldName);
      });

      field.addEventListener('input', () => {
        this.clearFieldError(fieldName);
      });
    });

    // Show success message after returning from Formspree
    this.showSuccessFromRedirect();
  }

  /* ============================================
     VALIDATION
  ============================================ */

  validateField(fieldName) {
    const field = this.fields[fieldName];

    if (!field) return false;

    const value = field.value.trim();

    switch (fieldName) {
      case 'name':
        if (!value) {
          this.showFieldError(fieldName, 'Please enter your name.');
          return false;
        }

        if (value.length < 2) {
          this.showFieldError(
            fieldName,
            'Name must be at least 2 characters.'
          );
          return false;
        }

        break;

      case 'email': {
        if (!value) {
          this.showFieldError(fieldName, 'Please enter your email.');
          return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
          this.showFieldError(
            fieldName,
            'Please enter a valid email address.'
          );
          return false;
        }

        break;
      }

      case 'message':
        if (!value) {
          this.showFieldError(fieldName, 'Please enter your message.');
          return false;
        }

        if (value.length < 10) {
          this.showFieldError(
            fieldName,
            'Message must be at least 10 characters.'
          );
          return false;
        }

        break;
    }

    return true;
  }

  validateForm() {
    let isValid = true;

    Object.keys(this.fields).forEach((fieldName) => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /* ============================================
     ERROR HANDLING
  ============================================ */

  showFieldError(fieldName, message) {
    const field = this.fields[fieldName];
    const error = this.errors[fieldName];

    if (field) {
      field.classList.add('error');
    }

    if (error) {
      error.textContent = message;
    }
  }

  clearFieldError(fieldName) {
    const field = this.fields[fieldName];
    const error = this.errors[fieldName];

    if (field) {
      field.classList.remove('error');
    }

    if (error) {
      error.textContent = '';
    }
  }

  clearAllErrors() {
    Object.keys(this.fields).forEach((fieldName) => {
      this.clearFieldError(fieldName);
    });
  }

  /* ============================================
     FORM SUBMISSION
  ============================================ */

  async handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    this.clearAllErrors();

    // Validate before sending
    if (!this.validateForm()) {
      this.showToast(
        'Please correct the highlighted fields.',
        'error'
      );
      return;
    }

    this.setLoading(true);

    try {
      const response = await fetch(
        'https://formspree.io/f/xaennwbp',
        {
          method: 'POST',
          body: new FormData(this.form),
          headers: {
            Accept: 'application/json'
          }
        }
      );

      if (response.ok) {
        /*
          Store success message temporarily.
          sessionStorage survives the redirect to index.html.
        */
        sessionStorage.setItem(
          'contactSuccess',
          'Message sent successfully!'
        );

        /*
          Immediately redirect back to the contact section.
          The user never sees the Formspree page.
        */
        window.location.href = 'index.html#contact';

        return;
      }

      // Try to read Formspree error response
      let errorMessage =
        'Something went wrong. Please try again.';

      try {
        const data = await response.json();

        if (data?.errors?.length) {
          errorMessage = data.errors
            .map((error) => error.message)
            .join(' ');
        }
      } catch (error) {
        // Ignore JSON parsing errors
      }

      this.showToast(errorMessage, 'error');

    } catch (error) {
      console.error('Contact form error:', error);

      this.showToast(
        'Unable to send your message. Please check your connection and try again.',
        'error'
      );

    } finally {
      this.setLoading(false);
    }
  }

  /* ============================================
     SUCCESS MESSAGE AFTER REDIRECT
  ============================================ */

  showSuccessFromRedirect() {
    const message = sessionStorage.getItem('contactSuccess');

    if (!message) return;

    // Remove it immediately so refreshing the page
    // does not show the message again.
    sessionStorage.removeItem('contactSuccess');

    this.showToast(message, 'success');
  }

  /* ============================================
     LOADING STATE
  ============================================ */

  setLoading(isLoading) {
    if (!this.submitButton) return;

    this.submitButton.disabled = isLoading;
    this.submitButton.classList.toggle(
      'is-loading',
      isLoading
    );

    if (this.buttonText) {
      this.buttonText.textContent = isLoading
        ? 'Sending...'
        : 'Send Message';
    }
  }

  /* ============================================
     TOAST NOTIFICATION
  ============================================ */

  showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.contact-toast');

    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');

    toast.className = `contact-toast contact-toast--${type}`;
    toast.setAttribute('role', 'alert');

    const icon = type === 'success' ? '✓' : '!';
    
    toast.innerHTML = `
      <span class="contact-toast__icon">${icon}</span>
      <span class="contact-toast__message">${message}</span>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    // Automatically remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove('is-visible');

      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }
}


/* ============================================
   INITIALIZE CONTACT FORM
============================================ */

document.addEventListener('DOMContentLoaded', () => {
  window.contactForm = new ContactForm();
});
