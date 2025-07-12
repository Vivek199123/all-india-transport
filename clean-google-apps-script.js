// Google Apps Script for Quote and Contact Forms - CLEAN VERSION
// Copy this entire code to your Google Apps Script project

function doPost(e) {
  try {
    Logger.log('doPost function called');
    Logger.log('Request data: ' + e.postData.contents);
    
    const data = JSON.parse(e.postData.contents);
    Logger.log('Parsed data: ' + JSON.stringify(data));
    
    // Your Google Sheet ID
    const spreadsheet = SpreadsheetApp.openById('1kTQOggvfFOLA9hbL65cYEKkaWeH1gtrlt2dXqllFz6E');
    Logger.log('Spreadsheet opened successfully');
    
    if (data.type === 'contact') {
      // Handle contact form submission
      Logger.log('Processing contact form submission');
      let contactSheet = spreadsheet.getSheetByName('Contact Messages');
      if (!contactSheet) {
        contactSheet = spreadsheet.insertSheet('Contact Messages');
        Logger.log('Created Contact Messages sheet');
        // Set up headers for contact sheet
        const contactHeaders = [
          'Timestamp',
          'Name',
          'Email',
          'Phone',
          'Subject',
          'Message',
          'Status'
        ];
        contactSheet.getRange(1, 1, 1, contactHeaders.length).setValues([contactHeaders]);
        contactSheet.getRange(1, 1, 1, contactHeaders.length)
          .setFontWeight('bold')
          .setBackground('#ff6600')
          .setFontColor('white');
        contactSheet.autoResizeColumns(1, contactHeaders.length);
      }
      
      const contactRowData = [
        data.timestamp,
        data.name,
        data.email,
        data.phone,
        data.subject,
        data.message,
        'New'
      ];
      
      contactSheet.appendRow(contactRowData);
      Logger.log('Contact data appended to sheet');
      sendContactEmailNotification(data);
      
    } else {
      // Handle quote form submission
      Logger.log('Processing quote form submission');
      let quoteSheet = spreadsheet.getSheetByName('Quote Requests');
      if (!quoteSheet) {
        quoteSheet = spreadsheet.insertSheet('Quote Requests');
        Logger.log('Created Quote Requests sheet');
        // Set up headers for quote sheet
        const quoteHeaders = [
          'Timestamp',
          'Name',
          'Phone',
          'Email',
          'Product Type',
          'Description',
          'Weight (kg)',
          'Pickup Location',
          'Drop Location',
          'Service',
          'Status'
        ];
        quoteSheet.getRange(1, 1, 1, quoteHeaders.length).setValues([quoteHeaders]);
        quoteSheet.getRange(1, 1, 1, quoteHeaders.length)
          .setFontWeight('bold')
          .setBackground('#4285f4')
          .setFontColor('white');
        quoteSheet.autoResizeColumns(1, quoteHeaders.length);
      }
      
      const quoteRowData = [
        data.timestamp,
        data.name,
        data.phone,
        data.email,
        data.productType,
        data.description,
        data.weight,
        data.pickupLocation,
        data.dropLocation,
        data.service,
        'Pending'
      ];
      
      quoteSheet.appendRow(quoteRowData);
      Logger.log('Quote data appended to sheet');
      sendQuoteEmailNotification(data);
    }
    
    Logger.log('Form submission successful: ' + (data.type || 'quote'));
    
    // Set CORS headers for better error handling
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'message': 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'result': 'error', 
        'error': error.toString(),
        'message': 'Failed to save data'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('All India Transport - Form Handler is working!')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*');
}

// Handle preflight OPTIONS request for CORS
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendQuoteEmailNotification(data) {
  const adminEmail = 'allindtra@gmail.com';
  const subject = 'New Quote Request - All India Transport';
  const message = `
    New quote request received:
    
    Name: ${data.name || 'Not provided'}
    Phone: ${data.phone || 'Not provided'}
    Email: ${data.email || 'Not provided'}
    Product Type: ${data.productType || 'Not provided'}
    Description: ${data.description || 'Not provided'}
    Weight: ${data.weight || 'Not provided'} kg
    Pickup Location: ${data.pickupLocation || 'Not provided'}
    Drop Location: ${data.dropLocation || 'Not provided'}
    Service: ${data.service || 'Not provided'}
    Timestamp: ${data.timestamp || 'Not provided'}
  `;
  
  try {
    MailApp.sendEmail(adminEmail, subject, message);
    Logger.log('Quote email notification sent successfully');
  } catch (error) {
    Logger.log('Quote email notification failed: ' + error);
  }
}

function sendContactEmailNotification(data) {
  const adminEmail = 'allindtra@gmail.com';
  const subject = 'New Contact Message - All India Transport';
  const message = `
    New contact message received:
    
    Name: ${data.name || 'Not provided'}
    Email: ${data.email || 'Not provided'}
    Phone: ${data.phone || 'Not provided'}
    Subject: ${data.subject || 'Not provided'}
    Message: ${data.message || 'Not provided'}
    Timestamp: ${data.timestamp || 'Not provided'}
  `;
  
  try {
    MailApp.sendEmail(adminEmail, subject, message);
    Logger.log('Contact email notification sent successfully');
  } catch (error) {
    Logger.log('Contact email notification failed: ' + error);
  }
}

function setupSpreadsheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById('1kTQOggvfFOLA9hbL65cYEKkaWeH1gtrlt2dXqllFz6E');
    
    // Set up Quote Requests sheet
    let quoteSheet = spreadsheet.getSheetByName('Quote Requests');
    if (!quoteSheet) {
      quoteSheet = spreadsheet.insertSheet('Quote Requests');
      Logger.log('Created Quote Requests sheet');
    }
    
    const quoteHeaders = [
      'Timestamp',
      'Name',
      'Phone',
      'Email',
      'Product Type',
      'Description',
      'Weight (kg)',
      'Pickup Location',
      'Drop Location',
      'Service',
      'Status'
    ];
    
    quoteSheet.clear();
    quoteSheet.getRange(1, 1, 1, quoteHeaders.length).setValues([quoteHeaders]);
    quoteSheet.getRange(1, 1, 1, quoteHeaders.length)
      .setFontWeight('bold')
      .setBackground('#4285f4')
      .setFontColor('white');
    quoteSheet.autoResizeColumns(1, quoteHeaders.length);
    
    // Set up Contact Messages sheet
    let contactSheet = spreadsheet.getSheetByName('Contact Messages');
    if (!contactSheet) {
      contactSheet = spreadsheet.insertSheet('Contact Messages');
      Logger.log('Created Contact Messages sheet');
    }
    
    const contactHeaders = [
      'Timestamp',
      'Name',
      'Email',
      'Phone',
      'Subject',
      'Message',
      'Status'
    ];
    
    contactSheet.clear();
    contactSheet.getRange(1, 1, 1, contactHeaders.length).setValues([contactHeaders]);
    contactSheet.getRange(1, 1, 1, contactHeaders.length)
      .setFontWeight('bold')
      .setBackground('#ff6600')
      .setFontColor('white');
    contactSheet.autoResizeColumns(1, contactHeaders.length);
    
    Logger.log('Spreadsheet setup completed successfully!');
    
  } catch (error) {
    Logger.log('Error setting up spreadsheet: ' + error);
  }
} 