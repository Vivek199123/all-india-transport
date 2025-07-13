// All India Transport - JavaScript Functionality

// Global submission tracking to prevent double submissions
let isSubmitting = false;

// Counter Animation Function
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Initialize counters when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Animate counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target);
    });
    
    // Initialize form handlers
    initializeForms();
    
    // Add smooth scrolling for navigation links
    addSmoothScrolling();
    
    // Add mobile menu functionality
    addMobileMenu();
});

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
function handleQuoteForm(event) {
    event.preventDefault();
    
    // Prevent double submission globally
    if (isSubmitting) {
        console.log('Form submission already in progress');
        return;
    }
    
    // Prevent double submission
    const submitBtn = event.target.querySelector('.submit-btn');
    if (submitBtn.disabled) {
        return;
    }
    
    const formData = new FormData(event.target);
    const formObject = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    
    // Check for recent submissions
    if (checkRecentSubmission('quote', formObject.email, formObject.phone)) {
        showNotification('You have recently submitted a quote request. Please wait a few minutes before submitting again.', 'warning');
        return;
    }
    
    // Validate form data
    if (validateQuoteForm(formObject)) {
        // Set global submission flag
        isSubmitting = true;
        
        // Disable submit button to prevent double submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Send to Google Sheets
        sendToGoogleSheets(formObject, 'quote');
        
        // Re-enable button after a delay
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Get A Quote';
            isSubmitting = false;
        }, 5000);
    }
}

// Handle contact form submission
function handleContactForm(event) {
    event.preventDefault();
    
    // Prevent double submission globally
    if (isSubmitting) {
        console.log('Form submission already in progress');
        return;
    }
    
    // Prevent double submission
    const submitBtn = event.target.querySelector('.submit-btn');
    if (submitBtn.disabled) {
        return;
    }
    
    const formData = new FormData(event.target);
    const formObject = {};
    
    // Convert FormData to object
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    
    // Check for recent submissions
    if (checkRecentSubmission('contact', formObject.email, formObject.phone)) {
        showNotification('You have recently submitted a contact message. Please wait a few minutes before submitting again.', 'warning');
        return;
    }
    
    // Validate form data
    if (validateContactForm(formObject)) {
        // Set global submission flag
        isSubmitting = true;
        
        // Disable submit button to prevent double submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Send to Google Sheets
        sendToGoogleSheets(formObject, 'contact');
        
        // Re-enable button after a delay
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
            isSubmitting = false;
        }, 5000);
    }
}

// Validate quote form data
function validateQuoteForm(data) {
    const requiredFields = ['name', 'phone', 'email', 'productType', 'description', 'weight', 'pickupLocation', 'dropLocation', 'service'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'error');
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Validate phone number (basic validation for Indian numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
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
            showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'error');
            return false;
        }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
        showNotification('Please enter a valid 10-digit phone number.', 'error');
        return false;
    }
    
    return true;
}

// Show notification messages
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add smooth scrolling for navigation links
function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
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
    const serviceSelect = document.getElementById('services');
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
    const serviceSelect = document.querySelector('select[name="service"]');
    const storedService = localStorage.getItem('selectedService');
    
    if (serviceSelect && storedService) {
        // Find the option with matching text
        const options = serviceSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].text === storedService) {
                serviceSelect.selectedIndex = i;
                break;
            }
        }
        // Clear stored service
        localStorage.removeItem('selectedService');
    }
}

// Initialize service selection
document.addEventListener('DOMContentLoaded', function() {
    handleServiceSelection();
    prefillServiceSelection();
});

// Add loading animation for forms
function addLoadingState(form, isLoading) {
    const submitBtn = form.querySelector('.submit-btn');
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
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
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
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(animationStyles);

// Add scroll to top functionality
function addScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ff6600;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top
document.addEventListener('DOMContentLoaded', addScrollToTop);

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
        const phoneRegex = /^[6-9]\d{9}$/;
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

// Initialize field validation
document.addEventListener('DOMContentLoaded', addFieldValidation);

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
function sendToGoogleSheets(data, formType) {
    // Replace this URL with your Google Apps Script web app URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxyNvi0k0OtkTJeW38WXCGufiuyHUYdj4FqQzpa5ZlsIuJNz19P4Gvf69-OZ9OuH8Bx/exec';
    
    // Add form type to data
    data.formType = formType;
    
    // Add unique timestamp to prevent duplicate submissions
    data.submissionTimestamp = Date.now();
    
    // Show loading state
    showNotification('Submitting your request...', 'info');
    
    // Store submission attempt in localStorage to prevent duplicates
    const submissionKey = `${formType}_${data.email}_${data.phone}_${data.submissionTimestamp}`;
    localStorage.setItem(submissionKey, 'submitted');
    
    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for Google Apps Script
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        // Since we're using no-cors, we can't read the response
        // But we can assume success if no error is thrown
        showNotification(
            formType === 'quote' 
                ? 'Quote request submitted successfully! We will contact you soon.' 
                : 'Message sent successfully! We will get back to you soon.',
            'success'
        );
        
        // Reset form
        const form = document.querySelector(formType === 'quote' ? '#quoteForm' : '#contactForm');
        if (form) {
            form.reset();
            
            // Re-enable submit button immediately after successful submission
            const submitBtn = form.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = formType === 'quote' ? 'Get A Quote' : 'Send Message';
            }
        }
        
        // Reset global submission flag
        isSubmitting = false;
        
        // Clean up localStorage after successful submission
        setTimeout(() => {
            localStorage.removeItem(submissionKey);
        }, 60000); // Remove after 1 minute
    })
    .catch(error => {
        console.error('Error submitting form:', error);
        showNotification('There was an error submitting your request. Please try again.', 'error');
        
        // Re-enable submit button on error
        const form = document.querySelector(formType === 'quote' ? '#quoteForm' : '#contactForm');
        if (form) {
            const submitBtn = form.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = formType === 'quote' ? 'Get A Quote' : 'Send Message';
            }
        }
        
        // Reset global submission flag
        isSubmitting = false;
        
        // Clean up localStorage on error
        localStorage.removeItem(submissionKey);
    });
}

// Alternative method using Google Forms (if Apps Script doesn't work)
function sendToGoogleForms(data, formType) {
    // Google Forms URLs (you'll need to create these forms)
    const GOOGLE_FORMS = {
        quote: 'YOUR_QUOTE_FORM_URL_HERE',
        contact: 'YOUR_CONTACT_FORM_URL_HERE'
    };
    
    const formUrl = GOOGLE_FORMS[formType];
    if (!formUrl) {
        showNotification('Form configuration error. Please contact support.', 'error');
        return;
    }
    
    // Create a hidden form to submit to Google Forms
    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = formUrl;
    hiddenForm.target = '_blank';
    hiddenForm.style.display = 'none';
    
    // Add form fields
    Object.keys(data).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        hiddenForm.appendChild(input);
    });
    
    // Submit the form
    document.body.appendChild(hiddenForm);
    hiddenForm.submit();
    document.body.removeChild(hiddenForm);
    
    showNotification(
        formType === 'quote' 
            ? 'Quote request submitted successfully! We will contact you soon.' 
            : 'Message sent successfully! We will get back to you soon.',
        'success'
    );
    
    // Reset original form
    const form = document.querySelector(formType === 'quote' ? '#quoteForm' : '#contactForm');
    if (form) {
        form.reset();
    }
}

console.log('All India Transport JavaScript loaded successfully!'); 