# Google Sheets Integration Setup Guide

## Method 1: Google Apps Script (Recommended)

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "All India Transport - Form Submissions"
4. Copy the Spreadsheet ID from the URL (the long string between /d/ and /edit)

### Step 2: Set up Google Apps Script
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the content from `google-apps-script.js`
4. Replace `'YOUR_SPREADSHEET_ID_HERE'` with your actual spreadsheet ID
5. Save the project with a name like "All India Transport Forms"

### Step 3: Deploy as Web App
1. Click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the Web App URL

### Step 4: Update Your Website
1. Open `script.js`
2. Replace `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` with your Web App URL
3. Save the file

## Method 2: Google Forms (Alternative)

### Step 1: Create Google Forms
1. Go to [Google Forms](https://forms.google.com)
2. Create two forms:
   - "Quote Request Form"
   - "Contact Form"

### Step 2: Add Form Fields
**For Quote Form:**
- Name (Short answer)
- Phone (Short answer)
- Email (Short answer)
- Product Type (Short answer)
- Description (Paragraph)
- Weight (Short answer)
- Pickup Location (Short answer)
- Drop Location (Short answer)
- Service (Multiple choice)

**For Contact Form:**
- Name (Short answer)
- Email (Short answer)
- Phone (Short answer)
- Subject (Short answer)
- Message (Paragraph)

### Step 3: Get Form URLs
1. Click "Send" on each form
2. Copy the form URLs
3. Update `script.js` with these URLs

### Step 4: Enable Form Responses
1. In each form, click the "Responses" tab
2. Click the Google Sheets icon to create a linked spreadsheet
3. This will automatically save responses to Google Sheets

## Method 3: Formspree (Easiest)

### Step 1: Sign up for Formspree
1. Go to [Formspree](https://formspree.io)
2. Create a free account
3. Create a new form

### Step 2: Update HTML Forms
Add this to your forms:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Step 3: Get Email Notifications
Formspree will send all form submissions to your email and optionally save to Google Sheets.

## Testing Your Setup

### Test Quote Form:
1. Fill out the quote form on your website
2. Submit the form
3. Check your Google Sheet for the new entry
4. Check your email for notification (if enabled)

### Test Contact Form:
1. Fill out the contact form on your website
2. Submit the form
3. Check your Google Sheet for the new entry
4. Check your email for notification (if enabled)

## Troubleshooting

### Common Issues:

1. **CORS Error**: Make sure you're using `mode: 'no-cors'` in the fetch request
2. **Permission Denied**: Check that your Google Apps Script is deployed with "Anyone" access
3. **Form Not Submitting**: Check browser console for JavaScript errors
4. **Data Not Appearing**: Verify your spreadsheet ID is correct

### Debug Steps:

1. Open browser developer tools (F12)
2. Check the Console tab for errors
3. Check the Network tab to see if requests are being sent
4. Test your Google Apps Script URL directly in the browser

## Security Considerations

1. **Rate Limiting**: Google Apps Script has daily quotas
2. **Data Validation**: Always validate data on both client and server side
3. **Email Notifications**: Be careful with email notifications to avoid spam
4. **Access Control**: Consider who has access to your spreadsheet

## Advanced Features

### Auto-Response Emails
You can modify the Google Apps Script to send auto-response emails to users:

```javascript
function sendAutoResponse(data, formType) {
    const subject = formType === 'quote' 
        ? 'Thank you for your quote request' 
        : 'Thank you for contacting us';
    
    const body = `Dear ${data.name},\n\nThank you for your ${formType} request. We will get back to you within 24 hours.\n\nBest regards,\nAll India Transport Team`;
    
    MailApp.sendEmail({
        to: data.email,
        subject: subject,
        body: body
    });
}
```

### Data Analytics
You can add analytics to track form submissions:

```javascript
function logAnalytics(data, formType) {
    const analyticsSheet = spreadsheet.getSheetByName('Analytics');
    if (!analyticsSheet) {
        const newSheet = spreadsheet.insertSheet('Analytics');
        newSheet.getRange(1, 1, 1, 4).setValues([['Date', 'Form Type', 'User Agent', 'IP Address']]);
    }
    
    analyticsSheet.appendRow([
        new Date(),
        formType,
        e.parameter['user-agent'] || 'Unknown',
        e.parameter['ip'] || 'Unknown'
    ]);
}
```

<!-- Product Catalog section removed -->

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all URLs and IDs are correct
3. Test with a simple form submission first
4. Check Google Apps Script logs for server-side errors 