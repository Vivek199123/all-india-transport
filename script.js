// All India Transport - JavaScript Functionality

// Global submission tracking to prevent double submissions
let isSubmitting = false;

// Counter Animation Function
function animateCounter(element, target, duration = 2000) {
    // Prevent multiple animations on the same element
    if (element.dataset.animated === 'true') return;
    element.dataset.animated = 'true';
    
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Scroll Animation Functions
function initScrollAnimations() {
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animate class when element comes into view
                entry.target.classList.add('animate');
                
                // If it's a counter, start the animation
                if (entry.target.classList.contains('counter') || entry.target.querySelector('.counter')) {
                    const counter = entry.target.classList.contains('counter') 
                        ? entry.target 
                        : entry.target.querySelector('.counter');
                    if (counter && !counter.dataset.animated) {
                        const target = parseInt(counter.getAttribute('data-target'));
                        animateCounter(counter, target);
                    }
                }
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
    });

    // Observe all elements with animation classes
    const animateElements = document.querySelectorAll(
        '.scroll-animate, .fade-in, .slide-in-left, .slide-in-right, .scale-up'
    );
    
    animateElements.forEach(el => observer.observe(el));
    
    // Trigger animations for elements already in view
    setTimeout(() => {
        const elementsInView = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        elementsInView.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('animate');
            }
        });
    }, 100);
}

// Initialize all counters
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        // Reset counter
        counter.textContent = '0';
        counter.dataset.animated = 'false';
    });
}

// Parallax Effect
function initParallaxEffect() {
    const parallaxBg = document.getElementById('parallax-bg');
    const floatingElements = document.querySelectorAll('.floating-icon');
    
    if (parallaxBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxBg.style.transform = `translate3d(0, ${rate}px, 0)`;
            
            floatingElements.forEach((element, index) => {
                const speed = 0.2 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
            });
        });
    }
}

// Hero Animations
function initHeroAnimations() {
    // Add click handler for scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.services') || document.querySelector('.stats');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Typewriter effect for hero text (optional enhancement)
    const heroTexts = document.querySelectorAll('.header-content h1');
    heroTexts.forEach((text, index) => {
        setTimeout(() => {
            text.style.animationPlayState = 'running';
        }, index * 300);
    });
}

// Enhanced smooth scrolling with offset for fixed navbar
function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form handling functions
function initializeForms() {
    // Quote form handler
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleQuoteForm);
    }
    
    // Contact form handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Handle quote form submission
function handleQuoteForm(e) {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit

    const form = document.getElementById('quoteForm');
    const submitBtn = form ? (form.querySelector('button[type="submit"]') || document.getElementById('submitBtn')) : null;

    const payload = {
        name: (form.querySelector('input[name="name"]') || {}).value || '',
        email: (form.querySelector('input[name="email"]') || {}).value || '',
        phone: (form.querySelector('input[name="phone"]') || {}).value || '',
        product_type: (form.querySelector('input[name="product_type"]') || {}).value || '',
        description: (form.querySelector('textarea[name="description"]') || {}).value || '',
        weight: (form.querySelector('input[name="weight"]') || {}).value || '',
        pickup_location: (form.querySelector('input[name="pickup_location"]') || {}).value || '',
        drop_location: (form.querySelector('input[name="drop_location"]') || {}).value || '',
        service_type: (form.querySelector('select[name="service_type"]') || {}).value || ''
    };

    // Validate form
    if (!validateQuoteForm(payload)) {
        return; // Validation failed
    }

    // Check for recent submissions
    if (checkRecentSubmission('quote', payload.email, payload.phone)) {
        showNotification('duplicate', 'warning');
        return;
    }

    // Set submitting flag
    isSubmitting = true;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }

    // Send to Google Sheets
    sendToGoogleSheets(payload, 'quote', form, submitBtn, 'Get A Quote');
}

// Handle contact form submission
function handleContactForm(event) {
    event.preventDefault();
    if (isSubmitting) return; // Prevent double submit

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => formObject[key] = value);
    
    // Validate form
    if (!validateContactForm(formObject)) {
        return; // Validation failed
    }

    // Check for recent submissions
    if (checkRecentSubmission('contact', formObject.email, formObject.phone)) {
        showNotification('duplicate', 'warning');
        return;
    }
    
    // Set submitting flag
    isSubmitting = true;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
    }
    
    // Send to Google Sheets
    sendToGoogleSheets(formObject, 'contact', form, submitBtn, 'Send Message');
}

// Validate quote form data
function validateQuoteForm(data) {
    // Updated keys to match payload
    const requiredFields = ['name', 'phone', 'email', 'product_type', 'description', 'weight', 'pickup_location', 'drop_location', 'service_type'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Please fill in the ${field.replace(/_/g, ' ')} field.`, 'error');
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Validate phone number (basic validation for 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
        showNotification('Please enter a valid 10-digit phone number.', 'error');
        return false;
    }
    
    // Validate weight
    const weight = parseFloat(data.weight);
    if (isNaN(weight) || weight <= 0) {
        showNotification('Please enter a valid weight greater than 0.', 'error');
        return false;
    }
    
    return true;
}

// Validate contact form data
function validateContactForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Please fill in the ${field.replace(/_/g, ' ')} field.`, 'error');
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Validate phone number (basic validation for 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
        showNotification('Please enter a valid 10-digit phone number.', 'error');
        return false;
    }
    
    return true;
}

// Show notification messages
function showNotification(message, type = 'info') {
    // Use translated messages if available
    const messages = {
        'submitting': 'Submitting form, please wait...',
        'quoteSuccess': 'Quote request submitted! We will contact you soon.',
        'contactSuccess': 'Message sent! We will get back to you soon.',
        'duplicate': 'You just submitted this form. Please wait a few minutes.',
        'error': 'An error occurred. Please try again later.'
    };
    message = messages[message] || message;

    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Add mobile menu functionality
function addMobileMenu() {
    // Create mobile menu button
    const navbar = document.querySelector('.navbar');
    if (navbar && window.innerWidth <= 768) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 10px;
        `;
        
        // Add mobile menu styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .mobile-menu-btn {
                    display: block !important;
                }
                
                .navbar {
                    flex-direction: column;
                    align-items: stretch;
                }
                
                .navbar a {
                    display: none;
                }
                
                .navbar.mobile-open a {
                    display: block;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Add click handler
        mobileMenuBtn.addEventListener('click', function() {
            navbar.classList.toggle('mobile-open');
        });
        
        // Insert button before navbar
        navbar.parentElement.insertBefore(mobileMenuBtn, navbar);
    }
}

// Service selector functionality
function handleServiceSelection() {
    const serviceSelect = document.getElementById('services'); // Assuming an ID on a select element
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            if (selectedValue && selectedValue !== 'Select A Service') {
                // Store selected service in localStorage for quote page
                localStorage.setItem('selectedService', selectedValue);
            }
        });
    }
}

// Pre-fill service selection on quote page
function prefillServiceSelection() {
    // Corrected selector to match the one in Quote.html
    const serviceSelect = document.querySelector('select[name="service_type"]'); 
    const storedService = localStorage.getItem('selectedService');
    
    if (serviceSelect && storedService) {
        // Find the option with matching text or value
        const options = serviceSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].text === storedService || options[i].value === storedService) {
                serviceSelect.selectedIndex = i;
                break;
            }
        }
        // Clear stored service
        localStorage.removeItem('selectedService');
    }
}

// Add loading animation for forms
function addLoadingState(form, isLoading) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            submitBtn.style.opacity = '0.7';
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.getAttribute('data-original-text') || 'Submit';
            submitBtn.style.opacity = '1';
        }
    }
}

// Add CSS animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    }
    .notification-success { background: #4CAF50; }
    .notification-error { background: #f44336; }
    .notification-warning { background: #ff9800; }
    .notification-info { background: #2196F3; }
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
    }
    .notification-close:hover { opacity: 0.8; }
`;
document.head.appendChild(animationStyles);


// Add form field validation on blur
function addFieldValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error styling on input
            this.classList.remove('error');
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            return false;
        }
    }
    
    // Phone validation
    if (name === 'phone' && value) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ''))) {
            field.classList.add('error');
            return false;
        }
    }
    
    return true;
}

// Add field validation styles
const fieldValidationStyles = document.createElement('style');
fieldValidationStyles.textContent = `
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: #f44336;
        box-shadow: 0 0 5px rgba(244, 67, 54, 0.3);
    }
    
    .form-group input.error:focus,
    .form-group textarea.error:focus,
    .form-group select.error:focus {
        border-color: #f44336;
        box-shadow: 0 0 8px rgba(244, 67, 54, 0.5);
    }
`;
document.head.appendChild(fieldValidationStyles);

// Check for recent submissions to prevent duplicates
function checkRecentSubmission(formType, email, phone) {
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000); // 5 minutes ago
    
    // Check localStorage for recent submissions
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${formType}_`)) {
            const parts = key.split('_');
            if (parts.length >= 4) {
                const storedEmail = parts[1];
                const storedPhone = parts[2];
                const timestamp = parseInt(parts[3]);
                
                // Check if same email/phone submitted within last 5 minutes
                if (storedEmail === email && storedPhone === phone && timestamp > fiveMinutesAgo) {
                    return true; // Recent submission found
                }
            }
        }
    }
    
    return false; // No recent submission found
}

// Google Sheets Integration
function sendToGoogleSheets(data, formType, formElement, submitButton, buttonText) {
    // Replace this URL with your Google Apps Script web app URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxyNvi0k0OtkTJeW38WXCGufiuyHUYdj4FqQzpa5ZlsIuJNz19P4Gvf69-OZ9OuH8Bx/exec';
    
    data.formType = formType;
    data.submissionTimestamp = new Date().toISOString();
    
    showNotification('submitting', 'info');
    
    // Store submission attempt in localStorage
    const submissionKey = `${formType}_${data.email}_${data.phone}_${Date.now()}`;
    localStorage.setItem(submissionKey, 'submitted');
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Correct mode for cross-origin Google Script
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        // Since we're using no-cors, we can't read the response
        // Assume success if no error is thrown
        showNotification(
            formType === 'quote' ? 'quoteSuccess' : 'contactSuccess',
            'success'
        );
        if (formElement) formElement.reset();
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        showNotification('error', 'error');
        // Clean up localStorage on error
        localStorage.removeItem(submissionKey);
    })
    .finally(() => {
        // Re-enable button and reset text
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = buttonText;
        }
        isSubmitting = false;
        
        // Clean up localStorage after 5 minutes
        setTimeout(() => {
            localStorage.removeItem(submissionKey);
        }, 300000); // 5 minutes
    });
}

// Back to top functionality
window.addEventListener('scroll', function() {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) { // Check if the button exists
        if (window.pageYOffset > 300) {
            // Use opacity and visibility for smoother show/hide
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// === MAIN INITIALIZATION ===
// This single listener replaces all the duplicate ones.
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initParallaxEffect();
    initHeroAnimations();
    initCounters();
    addSmoothScrolling();
    initializeForms();
    addMobileMenu();
    handleServiceSelection();
    prefillServiceSelection();
    addFieldValidation();

    console.log('All India Transport JavaScript loaded successfully!');
});
