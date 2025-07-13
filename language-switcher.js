// Language Switcher for All India Transport
// Supports: English (en), Hindi (hi), Gujarati (gu), Marathi (mr)

class LanguageSwitcher {
    constructor() {
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        this.supportedLanguages = ['en', 'hi', 'gu', 'mr'];
        this.languageNames = {
            'en': 'English',
            'hi': 'हिंदी',
            'gu': 'ગુજરાતી',
            'mr': 'मराठी'
        };
        
        this.init();
    }
    
    init() {
        // Create language switcher UI
        this.createLanguageSwitcher();
        
        // Apply current language
        this.applyLanguage(this.currentLanguage);
        
        // Add event listeners
        this.addEventListeners();
    }
    
    createLanguageSwitcher() {
        // Create language switcher container
        const languageContainer = document.createElement('div');
        languageContainer.className = 'language-switcher';
        languageContainer.innerHTML = `
            <div class="language-selector">
                <button class="language-btn" id="languageBtn">
                    <span class="current-lang">${this.languageNames[this.currentLanguage]}</span>
                    <span class="dropdown-arrow">▼</span>
                </button>
                <div class="language-dropdown" id="languageDropdown">
                    <div class="language-option" data-lang="en">English</div>
                    <div class="language-option" data-lang="hi">हिंदी</div>
                    <div class="language-option" data-lang="gu">ગુજરાતી</div>
                    <div class="language-option" data-lang="mr">मराठी</div>
                </div>
            </div>
        `;
        
        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            .language-switcher {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
            }
            
            .language-selector {
                position: relative;
                display: inline-block;
            }
            
            .language-btn {
                background: #ff6600;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.3s;
            }
            
            .language-btn:hover {
                background: #e65c00;
            }
            
            .dropdown-arrow {
                font-size: 12px;
                transition: transform 0.3s;
            }
            
            .language-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: none;
                min-width: 120px;
                z-index: 10001;
            }
            
            .language-dropdown.show {
                display: block;
            }
            
            .language-option {
                padding: 10px 15px;
                cursor: pointer;
                transition: background 0.3s;
                border-bottom: 1px solid #eee;
            }
            
            .language-option:last-child {
                border-bottom: none;
            }
            
            .language-option:hover {
                background: #f5f5f5;
            }
            
            .language-option.active {
                background: #ff6600;
                color: white;
            }
            
            @media (max-width: 768px) {
                .language-switcher {
                    top: 10px;
                    right: 10px;
                }
                
                .language-btn {
                    padding: 8px 12px;
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(styles);
        
        // Insert into page
        document.body.appendChild(languageContainer);
    }
    
    addEventListeners() {
        const languageBtn = document.getElementById('languageBtn');
        const languageDropdown = document.getElementById('languageDropdown');
        const languageOptions = document.querySelectorAll('.language-option');
        
        // Toggle dropdown
        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            languageDropdown.classList.remove('show');
        });
        
        // Language selection
        languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedLang = option.getAttribute('data-lang');
                this.switchLanguage(selectedLang);
                languageDropdown.classList.remove('show');
            });
        });
    }
    
    switchLanguage(language) {
        if (this.supportedLanguages.includes(language)) {
            this.currentLanguage = language;
            localStorage.setItem('selectedLanguage', language);
            this.applyLanguage(language);
            this.updateLanguageButton();
        }
    }
    
    updateLanguageButton() {
        const currentLangSpan = document.querySelector('.current-lang');
        if (currentLangSpan) {
            currentLangSpan.textContent = this.languageNames[this.currentLanguage];
        }
        
        // Update active state in dropdown
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === this.currentLanguage) {
                option.classList.add('active');
            }
        });
    }
    
    applyLanguage(language) {
        try {
            if (!window.translations || !window.translations[language]) {
                console.error('Translations not found for language:', language);
                return;
            }
            
            const t = window.translations[language];
            
            // Update document title
            document.title = this.getPageTitle(t);
            
            // Update meta description
            this.updateMetaDescription(t);
            
            // Update all translatable elements
            this.updateElements(t);
            
                    // Update form placeholders and labels
        this.updateFormPlaceholders(t);
            
            // Update notifications
            this.updateNotifications(t);
        } catch (error) {
            console.error('Error applying language:', error);
        }
    }
    
    getPageTitle(t) {
        const currentPage = this.getCurrentPage();
        switch (currentPage) {
            case 'about':
                return `${t.about_title} - ${t.company_name}`;
            case 'services':
                return `${t.services_title} - ${t.company_name}`;
            case 'quote':
                return `${t.quote_title} - ${t.company_name}`;
            case 'contact':
                return `${t.contact_title} - ${t.company_name}`;
            default:
                return t.company_name;
        }
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('about')) return 'about';
        if (path.includes('services')) return 'services';
        if (path.includes('Quote')) return 'quote';
        if (path.includes('contact')) return 'contact';
        return 'home';
    }
    
    updateMetaDescription(t) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            const currentPage = this.getCurrentPage();
            switch (currentPage) {
                case 'about':
                    metaDescription.content = t.about_description_1.substring(0, 160) + '...';
                    break;
                case 'services':
                    metaDescription.content = t.services_subtitle;
                    break;
                case 'quote':
                    metaDescription.content = t.quote_title;
                    break;
                case 'contact':
                    metaDescription.content = t.contact_subtitle;
                    break;
                default:
                    metaDescription.content = t.tagline;
            }
        }
    }
    
    updateElements(t) {
        try {
            // Update navigation
            this.updateTextContent('.navbar a[href="index.html"]', t.nav_home);
            this.updateTextContent('.navbar a[href="about us.html"]', t.nav_about);
            this.updateTextContent('.navbar a[href="services.html"]', t.nav_services);
            this.updateTextContent('.navbar a[href="Quote.html"]', t.nav_quotes);
            this.updateTextContent('.navbar a[href="contact.html"]', t.nav_contact);
            
            // Update header
            this.updateTextContent('.title h1', t.company_name);
            this.updateTextContent('.title p', t.tagline);
            
            // Update hero section
            this.updateTextContent('.header-content h1:nth-child(1)', t.hero_title_1);
            this.updateTextContent('.header-content h1:nth-child(2)', t.hero_title_2);
            this.updateTextContent('.header-content h1:nth-child(3)', t.hero_title_3);
            
            // Update stats
            this.updateTextContent('.stat-box p', t.stats_experts, 0);
            this.updateTextContent('.stat-box p', t.stats_clients, 1);
            this.updateTextContent('.stat-box p', t.stats_projects, 2);
            
            // Update page-specific content
            this.updatePageContent(t);
            
            // Update footer
            this.updateTextContent('.footer h3', t.footer_get_touch);
            this.updateTextContent('.quicklinks h3', t.footer_quick_links);
            this.updateTextContent('.links a[href="index.html"]', t.nav_home);
            this.updateTextContent('.links a[href="about us.html"]', t.footer_about_us);
            this.updateTextContent('.links a[href="services.html"]', t.footer_our_services);
            this.updateTextContent('.links a[href="Quote.html"]', t.nav_quotes);
            this.updateTextContent('.links a[href="contact.html"]', t.footer_contact_us);
        } catch (error) {
            console.error('Error updating elements:', error);
        }
    }
    
    updatePageContent(t) {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'about':
                this.updateAboutPage(t);
                break;
            case 'services':
                this.updateServicesPage(t);
                break;
            case 'quote':
                this.updateQuotePage(t);
                break;
            case 'contact':
                this.updateContactPage(t);
                break;
        }
    }
    
    updateAboutPage(t) {
        this.updateTextContent('.about h1', t.about_title);
        this.updateTextContent('.about h6', t.about_subtitle);
        this.updateTextContent('.about-info h3', t.about_experience);
        
        // Update paragraphs
        const paragraphs = document.querySelectorAll('.about p');
        if (paragraphs.length >= 2) {
            paragraphs[0].textContent = t.about_description_1;
            paragraphs[1].textContent = t.about_description_2;
        }
        
        // Update list items
        const listItems = document.querySelectorAll('.about li');
        if (listItems.length >= 6) {
            listItems[0].textContent = t.about_ltl;
            listItems[1].textContent = t.about_ftl;
            listItems[2].textContent = t.about_flatbed;
            listItems[3].textContent = t.about_refrigerated;
            listItems[4].textContent = t.about_hazardous;
            listItems[5].textContent = t.about_express;
        }
    }
    
    updateServicesPage(t) {
        this.updateTextContent('.services-container h1', t.services_title);
        this.updateTextContent('.services-container > p', t.services_subtitle);
        this.updateTextContent('.service-selector h2', t.service_selector_title);
        this.updateTextContent('.service-selector select option[selected]', t.service_selector_placeholder);
        this.updateTextContent('.quote-btn', t.get_quote_btn);
        
        // Update service cards
        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards.length >= 8) {
            this.updateServiceCard(serviceCards[0], t.service_parcel, t.service_parcel_desc);
            this.updateServiceCard(serviceCards[1], t.service_ftl, t.service_ftl_desc);
            this.updateServiceCard(serviceCards[2], t.service_ptl, t.service_ptl_desc);
            this.updateServiceCard(serviceCards[3], t.service_household, t.service_household_desc);
            this.updateServiceCard(serviceCards[4], t.service_trailer, t.service_trailer_desc);
            this.updateServiceCard(serviceCards[5], t.service_container, t.service_container_desc);
            this.updateServiceCard(serviceCards[6], t.service_refrigerated, t.service_refrigerated_desc);
            this.updateServiceCard(serviceCards[7], t.service_express, t.service_express_desc);
        }
    }
    
    updateServiceCard(card, title, description) {
        const titleEl = card.querySelector('h3');
        const descEl = card.querySelector('p');
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = description;
    }
    
    updateQuotePage(t) {
        this.updateTextContent('.quote-title', t.quote_title);
        this.updateTextContent('.quote-form h2', t.quote_form_title);
        this.updateTextContent('.submit-btn', t.submit_quote);
        
        // Update form placeholders
        this.updateFormPlaceholders(t);
    }
    
    updateContactPage(t) {
        this.updateTextContent('.contact-container h1', t.contact_title);
        this.updateTextContent('.contact-container > p', t.contact_subtitle);
        this.updateTextContent('.contact-info h2', t.contact_get_touch);
        this.updateTextContent('.contact-form h2', t.contact_send_message);
        this.updateTextContent('.submit-btn', t.send_message_btn);
        
        // Update contact info
        this.updateTextContent('.contact-item h3', t.contact_address, 0);
        this.updateTextContent('.contact-item h3', t.contact_phone, 1);
        this.updateTextContent('.contact-item h3', t.contact_email, 2);
        this.updateTextContent('.contact-item h3', t.contact_hours, 3);
        
        // Update form placeholders
        this.updateFormPlaceholders(t);
    }
    
    updateFormPlaceholders(t) {
        // Update input placeholders
        this.updateAttribute('input[name="name"]', 'placeholder', t.form_name);
        this.updateAttribute('input[name="phone"]', 'placeholder', t.form_phone);
        this.updateAttribute('input[name="email"]', 'placeholder', t.form_email);
        this.updateAttribute('input[name="productType"]', 'placeholder', t.form_product_type);
        this.updateAttribute('textarea[name="description"]', 'placeholder', t.form_description);
        this.updateAttribute('input[name="weight"]', 'placeholder', t.form_weight);
        this.updateAttribute('input[name="pickupLocation"]', 'placeholder', t.form_pickup);
        this.updateAttribute('input[name="dropLocation"]', 'placeholder', t.form_drop);
        this.updateAttribute('input[name="subject"]', 'placeholder', t.form_subject);
        this.updateAttribute('textarea[name="message"]', 'placeholder', t.form_message);
        
        // Update select options
        const serviceSelect = document.querySelector('select[name="service"]');
        if (serviceSelect) {
            const options = serviceSelect.querySelectorAll('option');
            if (options.length >= 9) {
                options[0].textContent = t.form_service;
                options[1].textContent = t.service_parcel;
                options[2].textContent = t.service_ftl;
                options[3].textContent = t.service_ptl;
                options[4].textContent = t.service_household;
                options[5].textContent = t.service_trailer;
                options[6].textContent = t.service_container;
                options[7].textContent = t.service_refrigerated;
                options[8].textContent = t.service_express;
            }
        }
    }
    
    updateNotifications(t) {
        // Update notification messages in the script
        window.translationMessages = {
            submitting: t.notification_submitting,
            quoteSuccess: t.notification_quote_success,
            contactSuccess: t.notification_contact_success,
            error: t.notification_error,
            duplicate: t.notification_duplicate
        };
    }
    
    updateTextContent(selector, text, index = 0) {
        const elements = document.querySelectorAll(selector);
        if (elements[index]) {
            elements[index].textContent = text;
        }
    }
    
    updateAttribute(selector, attribute, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.setAttribute(attribute, value);
        }
    }
    
    // Get translation function for use in other scripts
    getTranslation(key) {
        if (window.translations && window.translations[this.currentLanguage]) {
            return window.translations[this.currentLanguage][key] || key;
        }
        return key;
    }
    
    // Format translation with parameters
    formatTranslation(key, params = {}) {
        let text = this.getTranslation(key);
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure translations are loaded
    setTimeout(() => {
        // Check if translations are loaded
        if (typeof window.translations === 'undefined') {
            console.error('Translations not loaded. Make sure translations.js is included before language-switcher.js');
            return;
        }
        
        // Initialize language switcher
        window.languageSwitcher = new LanguageSwitcher();
    }, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageSwitcher;
} 