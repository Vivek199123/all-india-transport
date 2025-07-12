// All India Transport - Form Handler v2.0
document.addEventListener('DOMContentLoaded', function() {
  initializeCounterAnimation();
  setupFormHandlers();
  setupSmoothScrolling();
  setupImageLoading();
  setupFormFieldEffects();
});

// ========== COUNTER ANIMATION ========== //
function initializeCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    if (isNaN(target)) return;
    
    let count = 0;
    const speed = 20;
    const step = Math.ceil(target / 100);
    
    const update = () => {
      if (count < target) {
        count += step;
        if (count > target) count = target;
        counter.innerText = count;
        setTimeout(update, speed);
      } else {
        counter.innerText = target + "+";
      }
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          update();
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(counter);
  });
}

// ========== FORM HANDLING ========== //
function setupFormHandlers() {
  // Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => handleFormSubmission(e, 'contact'));
  }

  // Quote Form Handler
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => handleFormSubmission(e, 'quote'));
  }
}

async function handleFormSubmission(event, formType) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const submitBtn = form.querySelector('.submit-btn') || form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  // Validate form
  if (!validateForm(form)) return;

  // Show loading state
  submitBtn.textContent = 'Processing...';
  submitBtn.disabled = true;

  // Prepare data
  const data = {
    type: formType,
    timestamp: new Date().toLocaleString('en-IN')
  };

  // Add form-specific fields
  formData.forEach((value, key) => {
    data[key] = value;
  });

  try {
    const response = await submitToGoogleSheets(data);
    
    if (response.result === 'success') {
      showSuccessMessage(formType);
      form.reset();
    } else {
      throw new Error(response.message || 'Unknown error occurred');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    alert(`Error: ${error.message || 'Failed to submit form. Please try again.'}`);
  } finally {
    // Reset button state
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll('[required]');
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = '#ff0000';
      field.addEventListener('input', () => {
        if (field.value.trim()) {
          field.style.borderColor = '#ddd';
        }
      });
    }
  });

  // Email validation
  const emailField = form.querySelector('input[type="email"]');
  if (emailField && emailField.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
      isValid = false;
      emailField.style.borderColor = '#ff0000';
      emailField.addEventListener('input', () => {
        if (emailRegex.test(emailField.value)) {
          emailField.style.borderColor = '#ddd';
        }
      });
    }
  }

  // Phone validation
  const phoneField = form.querySelector('input[type="tel"]');
  if (phoneField && phoneField.value) {
    const phoneRegex = /^[\+]?[0-9]{0,15}$/;
    if (!phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
      isValid = false;
      phoneField.style.borderColor = '#ff0000';
      phoneField.addEventListener('input', () => {
        if (phoneRegex.test(phoneField.value.replace(/\s/g, ''))) {
          phoneField.style.borderColor = '#ddd';
        }
      });
    }
  }

  if (!isValid) {
    alert('Please fill in all required fields correctly.');
  }

  return isValid;
}

async function submitToGoogleSheets(data) {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbzEgZU-jbmW_d8zFlmplibcA1IvwwMgMv7jLne7rVdkxWGfCWICnMsDnNw5BsrAWVxn6w/exec';
  
  try {
    const response = await fetch(scriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

function showSuccessMessage(formType) {
  const messages = {
    contact: 'Thank you for contacting All India Transport! We will get back to you soon.',
    quote: 'Thank you for your quote request! We will get back to you within 24 hours with a detailed quote.'
  };
  
  alert(messages[formType] || 'Thank you for your submission!');
}

// ========== UI ENHANCEMENTS ========== //
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function setupImageLoading() {
  document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => img.style.opacity = '1');
      img.addEventListener('error', () => {
        img.style.opacity = '0.5';
        img.alt = 'Image not available';
      });
    }
  });
}

function setupFormFieldEffects() {
  document.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('focus', () => {
      field.parentElement.classList.add('focused');
    });
    
    field.addEventListener('blur', () => {
      field.parentElement.classList.remove('focused');
    });
  });
}

// Mobile menu toggle
function toggleMobileMenu() {
  const navbar = document.querySelector('.navbar');
  navbar.classList.toggle('active');
  
  const icon = document.querySelector('.mobile-menu-icon');
  icon.classList.toggle('active');
}