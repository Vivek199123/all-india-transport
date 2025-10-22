# Multi-Language Setup Guide

## Overview

Your All India Transport website now supports **4 languages**:
- 🇺🇸 **English** (en)
- 🇮🇳 **Hindi** (hi)
- 🇮🇳 **Gujarati** (gu)
- 🇮🇳 **Marathi** (mr)

## Features

### ✅ **Language Switcher**
- Floating language selector in top-right corner
- Dropdown menu with all supported languages
- Remembers user's language preference
- Responsive design for mobile devices

### ✅ **Complete Translation**
- All website content translated
- Form labels and placeholders
- Navigation menus
- Page titles and meta descriptions
- Notification messages
- Error messages

### ✅ **User Experience**
- Smooth language switching
- No page reload required
- Maintains form data when switching
- Preserves user's current page

## How It Works

### 1. **Language Detection**
- Automatically detects user's preferred language
- Falls back to English if language not supported
- Remembers selection in localStorage

### 2. **Dynamic Translation**
- All text content is replaced dynamically
- Forms and placeholders are updated
- Meta tags are updated for SEO
- Page titles are translated

### 3. **Form Integration**
- Form validation messages are translated
- Success/error notifications are translated
- Placeholders and labels are updated
- Submit buttons are translated

## File Structure

```
ALT/
├── translations.js          # All translations
├── language-switcher.js     # Language switching logic
├── script.js               # Updated with translation support
├── index.html              # Updated with language scripts
├── about us.html           # Updated with language scripts
├── services.html           # Updated with language scripts
├── Quote.html              # Updated with language scripts
├── contact.html            # Updated with language scripts
└── MULTI_LANGUAGE_SETUP.md # This guide
```

## Adding New Languages

### Step 1: Add Language to translations.js

```javascript
// Add new language object
const translations = {
    en: { /* English translations */ },
    hi: { /* Hindi translations */ },
    gu: { /* Gujarati translations */ },
    mr: { /* Marathi translations */ },
    // Add your new language here
    es: { /* Spanish translations */ }
};
```

### Step 2: Update Language Switcher

In `language-switcher.js`, add to the `supportedLanguages` array:

```javascript
this.supportedLanguages = ['en', 'hi', 'gu', 'mr', 'es']; // Add 'es'
```

### Step 3: Add Language Name

```javascript
this.languageNames = {
    'en': 'English',
    'hi': 'हिंदी',
    'gu': 'ગુજરાતી',
    'mr': 'मराठी',
    'es': 'Español' // Add your language
};
```

### Step 4: Add to Dropdown

Update the HTML in `createLanguageSwitcher()`:

```html
<div class="language-option" data-lang="es">Español</div>
```

## Translation Keys

### Navigation
- `nav_home` - Home link
- `nav_about` - About link
- `nav_services` - Services link
- `nav_quotes` - Quotes link
- `nav_contact` - Contact link

### Header
- `company_name` - Company name
- `tagline` - Company tagline

### Hero Section
- `hero_title_1` - First hero title
- `hero_title_2` - Second hero title
- `hero_title_3` - Third hero title

### Stats
- `stats_experts` - Skilled experts text
- `stats_clients` - Happy clients text
- `stats_projects` - Complete projects text

### Forms
- `form_name` - Name field placeholder
- `form_phone` - Phone field placeholder
- `form_email` - Email field placeholder
- `form_subject` - Subject field placeholder
- `form_message` - Message field placeholder

### Notifications
- `notification_submitting` - Submitting message
- `notification_quote_success` - Quote success message
- `notification_contact_success` - Contact success message
- `notification_error` - Error message
- `notification_duplicate` - Duplicate submission message

## Customization

### Changing Language Switcher Position

Edit the CSS in `language-switcher.js`:

```css
.language-switcher {
    position: fixed;
    top: 20px;        /* Change top position */
    right: 20px;      /* Change right position */
    z-index: 10000;
}
```

### Changing Language Switcher Style

Modify the button styles:

```css
.language-btn {
    background: #ff6600;    /* Change background color */
    color: white;           /* Change text color */
    padding: 10px 15px;     /* Change padding */
    border-radius: 5px;     /* Change border radius */
}
```

### Adding Language Icons

You can add flag icons to the language switcher:

```html
<div class="language-option" data-lang="en">
    🇺🇸 English
</div>
<div class="language-option" data-lang="hi">
    🇮🇳 हिंदी
</div>
```

## SEO Benefits

### Meta Tags
- Page titles are translated
- Meta descriptions are updated
- Language-specific keywords

### URL Structure
Consider adding language codes to URLs:
- `/en/about` for English
- `/hi/about` for Hindi
- `/gu/about` for Gujarati
- `/mr/about` for Marathi

### Hreflang Tags
Add language-specific links:

```html
<link rel="alternate" hreflang="en" href="https://yoursite.com/en/" />
<link rel="alternate" hreflang="hi" href="https://yoursite.com/hi/" />
<link rel="alternate" hreflang="gu" href="https://yoursite.com/gu/" />
<link rel="alternate" hreflang="mr" href="https://yoursite.com/mr/" />
```

## Testing

### Test Each Language
1. **English** - Default language
2. **Hindi** - Right-to-left text support
3. **Gujarati** - Regional language
4. **Marathi** - Regional language

### Test Features
- ✅ Language switching works
- ✅ Forms are translated
- ✅ Notifications are translated
- ✅ Navigation is translated
- ✅ Page titles are translated
- ✅ Language preference is saved

### Test on Different Devices
- ✅ Desktop browsers
- ✅ Mobile devices
- ✅ Tablets
- ✅ Different screen sizes

## Troubleshooting

### Language Not Switching
1. Check if `translations.js` is loaded
2. Check browser console for errors
3. Verify language codes match

### Missing Translations
1. Add missing keys to `translations.js`
2. Check for typos in translation keys
3. Ensure all languages have the same keys

### Form Issues
1. Check if form placeholders are updated
2. Verify validation messages are translated
3. Test form submission in different languages

### Performance Issues
1. Translations are loaded once
2. Language switching is instant
3. No page reloads required

## Best Practices

### Translation Quality
- Use professional translators
- Maintain consistent terminology
- Consider cultural differences
- Test with native speakers

### Content Management
- Keep translations organized
- Use consistent naming conventions
- Document translation keys
- Version control translations

### User Experience
- Make language switcher easily accessible
- Remember user preferences
- Provide fallback language
- Test on all devices

## Support

If you need help with:
- Adding new languages
- Customizing the language switcher
- Translation issues
- Performance optimization

Check the browser console for any errors and ensure all files are properly loaded in the correct order:
1. `translations.js`
2. `language-switcher.js`
3. `script.js` 