// Google Apps Script for All India Transport Forms
// This script should be deployed as a web app in Google Apps Script

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const formType = data.formType; // 'quote' or 'contact'
    
    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.openById('1C8BoGI2bJRySC9biCLOjMFgmA0gKC4gfNgnPBxd9kz0');
    
    if (formType === 'quote') {
      return handleQuoteForm(data, spreadsheet);
    } else if (formType === 'contact') {
      return handleContactForm(data, spreadsheet);
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Invalid form type'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error processing request: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleQuoteForm(data, spreadsheet) {
  try {
    // Get the Quote sheet
    let sheet = spreadsheet.getSheetByName('Quote Submissions');
    if (!sheet) {
      // Create sheet if it doesn't exist
      sheet = spreadsheet.insertSheet('Quote Submissions');
      // Add headers
      sheet.getRange(1, 1, 1, 10).setValues([['Timestamp', 'Name', 'Phone', 'Email', 'Product Type', 'Description', 'Weight (kg)', 'Pickup Location', 'Drop Location', 'Service', 'Submission ID']]);
    }
    
    // Check for duplicate submission (within last 5 minutes with same email and phone)
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const existingData = sheet.getDataRange().getValues();
    for (let i = 1; i < existingData.length; i++) { // Skip header row
      const row = existingData[i];
      const rowTimestamp = new Date(row[0]);
      const rowEmail = row[3];
      const rowPhone = row[2];
      
      // Check if same email/phone submitted within last 5 minutes
      if (rowEmail === data.email && 
          rowPhone === data.phone && 
          rowTimestamp > fiveMinutesAgo) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Duplicate submission detected. Please wait a few minutes before submitting again.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Generate unique submission ID
    const submissionId = Utilities.getUuid();
    
    // Prepare data for sheet
    const rowData = [
      new Date(), // Timestamp
      data.name,
      data.phone,
      data.email,
      data.productType,
      data.description,
      data.weight,
      data.pickupLocation,
      data.dropLocation,
      data.service,
      submissionId
    ];
    
    // Add data to sheet
    sheet.appendRow(rowData);
    
    // Send email notification (optional)
    sendQuoteNotification(data);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Quote request submitted successfully!',
      submissionId: submissionId
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error saving quote data: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleContactForm(data, spreadsheet) {
  try {
    // Get the Contact sheet
    let sheet = spreadsheet.getSheetByName('Contact Submissions');
    if (!sheet) {
      // Create sheet if it doesn't exist
      sheet = spreadsheet.insertSheet('Contact Submissions');
      // Add headers
      sheet.getRange(1, 1, 1, 7).setValues([['Timestamp', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Submission ID']]);
    }
    
    // Check for duplicate submission (within last 5 minutes with same email and phone)
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const existingData = sheet.getDataRange().getValues();
    for (let i = 1; i < existingData.length; i++) { // Skip header row
      const row = existingData[i];
      const rowTimestamp = new Date(row[0]);
      const rowEmail = row[2];
      const rowPhone = row[3];
      
      // Check if same email/phone submitted within last 5 minutes
      if (rowEmail === data.email && 
          rowPhone === data.phone && 
          rowTimestamp > fiveMinutesAgo) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Duplicate submission detected. Please wait a few minutes before submitting again.'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Generate unique submission ID
    const submissionId = Utilities.getUuid();
    
    // Prepare data for sheet
    const rowData = [
      new Date(), // Timestamp
      data.name,
      data.email,
      data.phone,
      data.subject,
      data.message,
      submissionId
    ];
    
    // Add data to sheet
    sheet.appendRow(rowData);
    
    // Send email notification (optional)
    sendContactNotification(data);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Contact message submitted successfully!',
      submissionId: submissionId
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error saving contact data: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendQuoteNotification(data) {
  try {
    const emailBody = `
      New Quote Request Received!
      
      Name: ${data.name}
      Phone: ${data.phone}
      Email: ${data.email}
      Product Type: ${data.productType}
      Description: ${data.description}
      Weight: ${data.weight} kg
      Pickup Location: ${data.pickupLocation}
      Drop Location: ${data.dropLocation}
      Service: ${data.service}
      
      Submitted on: ${new Date().toLocaleString()}
    `;
    
    MailApp.sendEmail({
      to: 'allindtra@gmail.com', // Your email address
      subject: 'New Quote Request - All India Transport',
      body: emailBody
    });
  } catch (error) {
    console.log('Error sending email notification: ' + error.toString());
  }
}

function sendContactNotification(data) {
  try {
    const emailBody = `
      New Contact Message Received!
      
      Name: ${data.name}
      Email: ${data.email}
      Phone: ${data.phone}
      Subject: ${data.subject}
      Message: ${data.message}
      
      Submitted on: ${new Date().toLocaleString()}
    `;
    
    MailApp.sendEmail({
      to: 'allindtra@gmail.com', // Your email address
      subject: 'New Contact Message - All India Transport',
      body: emailBody
    });
  } catch (error) {
    console.log('Error sending email notification: ' + error.toString());
  }
}

// Test function to verify the script is working
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Google Apps Script is running correctly!'
  })).setMimeType(ContentService.MimeType.JSON);
} 