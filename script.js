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

// Initialize all animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize parallax effect
    initParallaxEffect();
    
    // Initialize hero animations
    initHeroAnimations();
    
    // Initialize counters
    initCounters();
    
    // Add smooth scrolling
    addSmoothScrolling();
    
    // Initialize form handlers
    initializeForms();
    
    // Add mobile menu functionality
    addMobileMenu();
    
    // Initialize scroll to top
    addScrollToTop();
    
    // Initialize field validation
    addFieldValidation();

    // Initialize service selection
    handleServiceSelection();
    prefillServiceSelection();
});

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
    // Typewriter effect for hero text (optional enhancement)
    const heroTexts = document.querySelectorAll('.header-content h1');
    
    heroTexts.forEach((text, index) => {
        setTimeout(() => {
            text.style.animationPlayState = 'running';
        }, index * 300);
    });
    
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
        
        // Insert button before navbar (assuming navbar is wrapped in a container or body)
        // If the navbar is the first child of a container, this needs adjustment, 
        // but for general use, we'll append it to a reachable parent.
        const header = document.querySelector('header');
        if (header) {
            header.insertBefore(mobileMenuBtn, navbar);
        }
    }
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

// Handle quote form submission (CLEANED UP)
function handleQuoteForm(event) {
    event.preventDefault();
    
    // Collect form data
    const formData = new FormData(event.target);
    const formObject = {};
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    
    // Check if Commercial Insurance is selected
    if (formObject.service === 'Commercial Insurance') {
        window.location.href = 'https://reach.turtlemint.com/leadforms?partnerId=6840a22f40315a2f211758ab&formId=cad01134-8a7e-4b7c-aaec-1cfc344b600e&language=English';
        return;
    }
    
    // Prevent double submission globally
    if (isSubmitting) {
        console.log('Form submission already in progress');
        return;
    }
    
    // Check for recent submissions
    if (checkRecentSubmission('quote', formObject.email, formObject.phone)) {
        showNotification('duplicate', 'warning');
        return;
    }
    
    // Validate form data
    if (validateQuoteForm(formObject)) {
        // Hand off control to sendToGoogleSheets, passing the form element
        sendToGoogleSheets(formObject, 'quote', event.target);
    }
}

// Handle contact form submission (CLEANED UP)
function handleContactForm(event) {
    event.preventDefault();
    
    // Prevent double submission globally
    if (isSubmitting) {
        console.log('Form submission already in progress');
        return;
    }
    
    // Collect form data
    const formData = new FormData(event.target);
    const formObject = {};
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }
    
    // Check for recent submissions
    if (checkRecentSubmission('contact', formObject.email, formObject.phone)) {
        showNotification('duplicate', 'warning');
        return;
    }
    
    // Validate form data
    if (validateContactForm(formObject)) {
        // Hand off control to sendToGoogleSheets, passing the form element
        sendToGoogleSheets(formObject, 'contact', event.target);
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
    // Use translated messages if available
    if (window.translationMessages && window.translationMessages[message]) {
        message = window.translationMessages[message];
    }
    
    // Default messages for form submission status
    let displayMessage = message;
    if (message === 'submitting') displayMessage = 'Submitting your request...';
    if (message === 'quoteSuccess') displayMessage = 'Quote request submitted successfully! We will contact you soon.';
    if (message === 'contactSuccess') displayMessage = 'Message sent successfully! We will get back to you soon.';
    if (message === 'error') displayMessage = 'Submission failed due to a network error. Please try again.';
    if (message === 'duplicate') displayMessage = 'You recently submitted this form. Please wait a few minutes before trying again.';


    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${displayMessage}</span>
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

// Add CSS animations (for notification)
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

// Add scroll to top functionality
function addScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('div');
    scrollBtn.className = 'back-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #2196F3;
        color: white;
        padding: 10px 15px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: flex; /* Change to flex for better centering */
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        opacity: 0;
        visibility: hidden;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
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

// Google Sheets Integration (UPDATED for button management and CORS fix)
function sendToGoogleSheets(data, formType, formElement) {
    // Replace this URL with your Google Apps Script web app URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxyNvi0k0OtkTJeW38WXCGufiuyHUYdj4FqQzpa5ZlsIuJNz19P4Gvf69-OZ9OuH8Bx/exec';
    
    // Set global submission flag
    isSubmitting = true;
    
    // Find the submit button and determine original text
    const submitBtn = formElement.querySelector('.submit-btn');
    const originalBtnText = formType === 'quote' ? 'Get A Quote' : 'Send Message';
    
    // Add form type and timestamp to data
    data.formType = formType;
    data.submissionTimestamp = Date.now();
    
    // Store submission attempt in localStorage to prevent duplicates
    const submissionKey = `${formType}_${data.email}_${data.phone}_${data.submissionTimestamp}`;
    localStorage.setItem(submissionKey, 'submitted');

    // Show loading state and disable button immediately
    showNotification('submitting', 'info');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = formType === 'quote' ? 'Submitting...' : 'Sending...';
        submitBtn.style.opacity = '0.7';
    }

    fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // CRITICAL: This bypasses the CORS header check
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        // Since we use no-cors, we assume success here.
        showNotification(
            formType === 'quote' 
                ? 'quoteSuccess' 
                : 'contactSuccess',
            'success'
        );
        
        // Reset form and global flag
        formElement.reset();
        isSubmitting = false;
        
        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = '1';
        }
        
        // Clean up localStorage
        setTimeout(() => {
            localStorage.removeItem(submissionKey);
        }, 60000);
    })
    .catch(error => {
        // This only catches true network errors (e.g., disconnected)
        console.error('Network error during submission:', error);
        showNotification('error', 'error');
        
        // Re-enable submit button and global flag on error
        isSubmitting = false;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = '1';
        }
        
        // Clean up localStorage
        localStorage.removeItem(submissionKey);
    });
}

// Alternative method using Google Forms (kept for reference, not used for live submissions)
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
