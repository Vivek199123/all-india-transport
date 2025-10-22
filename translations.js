// All India Transport - Multi-Language Translations
// Supported Languages: English, Hindi, Gujarati, Marathi

const translations = {
    en: {
        // Navigation
        home: "Home",
        about: "About",
        services: "Services",
        quotes: "Quotes",
        contact: "Contact",
        
        // Common
        company_name: "All India Transport",
        tagline: "Your Trusted Logistic Service Provider",
        get_quote: "Get Free Quote",
        
        // Contact
        get_in_touch: "Get In Touch",
        quick_links: "Quick Links",
        follow_us: "Follow Us",
        
        // Footer
        address: "Hotel Sugam Compound, Golden Chokdi, Vadodara",
        copyright: "© 2024 All India Transport. All rights reserved."
    },
    hi: {
        // Navigation
        home: "होम",
        about: "हमारे बारे में",
        services: "सेवाएं",
        quotes: "कोटेशन",
        contact: "संपर्क",
        
        // Common
        company_name: "ऑल इंडिया ट्रांसपोर्ट",
        tagline: "आपका विश्वसनीय लॉजिस्टिक सेवा प्रदाता",
        get_quote: "मुफ्त कोटेशन पाएं",
        
        // Contact
        get_in_touch: "संपर्क करें",
        quick_links: "त्वरित लिंक",
        follow_us: "हमें फॉलो करें",
        
        // Footer
        address: "होटल सुगम कंपाउंड, गोल्डन चौकड़ी, वडोदरा",
        copyright: "© 2024 ऑल इंडिया ट्रांसपोर्ट। सभी अधिकार सुरक्षित।"
    },
    gu: {
        // Navigation
        home: "હોમ",
        about: "અમારા વિશે",
        services: "સેવાઓ",
        quotes: "કોટેશન",
        contact: "સંપર્ક",
        
        // Common
        company_name: "ઓલ ઇન્ડિયા ટ્રાન્સપોર્ટ",
        tagline: "તમારા વિશ્વસनीय લોજિસ્ટિક સેવા પ્રદાતા",
        get_quote: "મફત કોટેશન મેળવો",
        
        // Contact
        get_in_touch: "સંપર્કમાં રહો",
        quick_links: "ઝડપી લિંક્સ",
        follow_us: "અમને ફોલો કરો",
        
        // Footer
        address: "હોટેલ સુગમ કમ્પાઉન્ડ, ગોલ્ડન ચોકડી, વડોદરા",
        copyright: "© 2024 ઓલ ઇન્ડિયા ટ્રાન્સપોર્ટ. બધા અધિકારો સુરક્ષિત."
    },
    mr: {
        // Navigation
        home: "होम",
        about: "आमच्याबद्दल",
        services: "सेवा",
        quotes: "कोटेशन",
        contact: "संपर्क",
        
        // Common
        company_name: "ऑल इंडिया ट्रान्सपोर्ट",
        tagline: "तुमचा विश्वसनीय लॉजिस्टिक सेवा प्रदाता",
        get_quote: "मोफत कोटेशन मिळवा",
        
        // Contact
        get_in_touch: "संपर्कात रहा",
        quick_links: "द्रुत दुवे",
        follow_us: "आम्हाला फॉलो करा",
        
        // Footer
        address: "हॉटेल सुगम कंपाऊंड, गोल्डन चौकडी, वडोदरा",
        copyright: "© 2024 ऑल इंडिया ट्रान्सपोर्ट. सर्व हक्क राखीव."
    }
};

// Export translations for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
} else {
    window.translations = translations;
}