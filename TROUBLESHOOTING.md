# Google Apps Script Troubleshooting Guide

## Problem: Form data not reaching Google Sheets

### Step-by-Step Solution

#### 1. **Update Google Apps Script Code**
1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project or open your existing one
3. Replace the code with the content from `google-apps-script-final.js`
4. Save the project

#### 2. **Deploy as Web App**
1. Click on "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set the following options:
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the new web app URL

#### 3. **Update Your Website**
1. Open `script.js`
2. Find the line with `const scriptURL = '...'`
3. Replace the URL with your new web app URL from step 2

#### 4. **Test the Connection**
1. Open `test-script.html` in your browser
2. Update the script URL in the test page
3. Click "Test GET Request" to verify basic connection
4. Click "Test Quote Form" to test form submission

### Common Issues and Solutions

#### Issue 1: CORS Errors
**Symptoms**: Browser console shows CORS errors
**Solution**: 
- The updated script includes CORS headers
- Make sure you're using the latest `google-apps-script-final.js` code

#### Issue 2: "Script not found" Error
**Symptoms**: 404 error when testing
**Solution**:
- Verify the web app URL is correct
- Make sure the script is deployed as a web app
- Check that "Who has access" is set to "Anyone"

#### Issue 3: Permission Denied
**Symptoms**: 403 error or permission errors
**Solution**:
- Make sure you're the owner of the Google Apps Script project
- Check that the spreadsheet ID is correct
- Verify you have edit access to the Google Sheet

#### Issue 4: Spreadsheet Not Found
**Symptoms**: Script runs but data doesn't appear
**Solution**:
1. Open your Google Sheet
2. Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Update the spreadsheet ID in the script
4. Make sure the sheet name matches exactly: "Quote Requests" or "Contact Messages"

#### Issue 5: Form Validation Issues
**Symptoms**: Form submits but shows error
**Solution**:
- Check browser console for JavaScript errors
- Verify all required fields are filled
- Check email and phone number formats

### Debugging Steps

#### 1. **Check Browser Console**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Submit the form and look for error messages
4. Check for network errors in the Network tab

#### 2. **Check Google Apps Script Logs**
1. Go to your Google Apps Script project
2. Click on "Executions" in the left sidebar
3. Look for recent executions and check for errors
4. Click on an execution to see detailed logs

#### 3. **Test with Simple Data**
Use the test page (`test-script.html`) to verify:
- Basic connection works
- Form submission works
- Data appears in Google Sheets

### Verification Checklist

- [ ] Google Apps Script code updated with latest version
- [ ] Script deployed as web app with correct permissions
- [ ] Web app URL updated in `script.js`
- [ ] Spreadsheet ID is correct
- [ ] Sheet names match exactly ("Quote Requests", "Contact Messages")
- [ ] Test page shows successful connection
- [ ] Form submission works in test page
- [ ] Data appears in Google Sheets

### Alternative Solutions

If the above doesn't work, try these alternatives:

#### Option 1: Use Google Forms
1. Create a Google Form
2. Connect it to a Google Sheet
3. Embed the form in your website

#### Option 2: Use a Third-Party Service
- Formspree
- Netlify Forms
- EmailJS

#### Option 3: Direct Email Submission
Modify the form to send emails directly instead of using Google Sheets.

### Contact Support

If you're still having issues:
1. Check the browser console for specific error messages
2. Check Google Apps Script execution logs
3. Verify all URLs and IDs are correct
4. Test with the provided test page

### Files to Check

- `google-apps-script-final.js` - Updated script with better error handling
- `script.js` - Updated JavaScript with improved error handling
- `test-script.html` - Test page for debugging
- `Quote.html` - Quote form page
- `contact.html` - Contact form page (if exists) 