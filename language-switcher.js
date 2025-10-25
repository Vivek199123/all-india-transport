// Language Switcher for All India Transport
// Supports: English (en), Hindi (hi), Gujarati (gu), Marathi (mr)

class LanguageSwitcher {
    constructor() {
        this.currentLanguage = localStorage.getItem('selectedLanguage') || 'en';
        this.init();
    }

    init() {
        this.createLanguageDropdown();
        this.translatePage();
        this.addEventListeners();
    }

    createLanguageDropdown() {
        // Remove existing dropdown if any
        const existingDropdown = document.querySelector('.language-switcher');
        if (existingDropdown) {
            existingDropdown.remove();
        }

        // Create language switcher HTML
        const languageSwitcher = document.createElement('div');
        languageSwitcher.className = 'language-switcher';
        languageSwitcher.innerHTML = `
            <div class="language-dropdown">
                <button class="language-btn" id="languageBtn">
                    <span class="language-text">${this.getLanguageDisplay(this.currentLanguage)}</span>
                    <span class="dropdown-arrow">▼</span>
                </button>
                <div class="language-options" id="languageOptions">
                    <div class="language-option" data-lang="en">English</div>
                    <div class="language-option" data-lang="hi">हिंदी</div>
                    <div class="language-option" data-lang="gu">ગુજરાતી</div>
                    <div class="language-option" data-lang="mr">मराठी</div>
                </div>
            </div>
        `;

        // Insert into topbar
        const topbar = document.querySelector('.toppart');
        if (topbar) {
            topbar.appendChild(languageSwitcher);
        }
    }

    getLanguageDisplay(lang) {
        const displays = {
            'en': 'English',
            'hi': 'हिंदी',
            'gu': 'ગુજરાતી',
            'mr': 'मराठी'
        };
        return displays[lang] || 'English';
    }

    addEventListeners() {
        const languageBtn = document.getElementById('languageBtn');
        const languageOptions = document.getElementById('languageOptions');

        if (languageBtn && languageOptions) {
            // Toggle dropdown
            languageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                languageOptions.classList.toggle('show');
            });

            // Handle language selection
            languageOptions.addEventListener('click', (e) => {
                if (e.target.classList.contains('language-option')) {
                    const selectedLang = e.target.getAttribute('data-lang');
                    this.changeLanguage(selectedLang);
                    languageOptions.classList.remove('show');
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                languageOptions.classList.remove('show');
            });
        }
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('selectedLanguage', lang);
        
        // Update button text
        const languageText = document.querySelector('.language-text');
        if (languageText) {
            languageText.textContent = this.getLanguageDisplay(lang);
        }
        
        // Translate page
        this.translatePage();
    }

    translatePage() {
        if (!translations[this.currentLanguage]) return;

        const translation = translations[this.currentLanguage];
        
        // Translate elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translation[key]) {
                element.textContent = translation[key];
            }
        });

        // Update page title if needed
        if (translation.page_title) {
            document.title = translation.page_title;
        }
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new LanguageSwitcher();
});
