// ========== CONFIGURATION ========== //
const SHEET_ID = '1kMkRlkACoSdRnaGqA63QnSz-eiBPCtdIu6WCZ5oX4gs'; // REPLACE WITH YOUR SHEET ID
const ADMIN_EMAIL = 'allindtra@gmail.com'; // REPLACE WITH YOUR EMAIL

// ========== MAIN FUNCTIONS ========== //
function doPost(e) {
  try {
    if (!e || !e.postData) {
      return buildResponse({error: 'No POST data received'}, 400);
    }
    
    const data = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    
    if (data.type === 'contact') {
      processContactForm(spreadsheet, data);
    } else {
      processQuoteForm(spreadsheet, data);
    }
    
    return buildResponse({
      result: 'success',
      message: 'Data saved successfully'
    });
    
  } catch (error) {
    console.error('Error:', error);
    return buildResponse({
      result: 'error',
      error: error.message
    }, 500);
  }
}

function doOptions() {
  return buildResponse({}, 200);
}

// ========== HELPER FUNCTIONS ========== //
function buildResponse(data, statusCode = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function processContactForm(spreadsheet, data) {
  const sheetName = 'Contact Messages';
  const headers = ['Timestamp', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Status'];
  
  const sheet = getOrCreateSheet(spreadsheet, sheetName, headers, '#ff6600');
  
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString(),
    data.name,
    data.email,
    data.phone,
    data.subject,
    data.message,
    'New'
  ]);
  
  sendEmail({
    type: 'contact',
    data: data,
    recipient: ADMIN_EMAIL,
    subject: 'New Contact Message'
  });
}

function processQuoteForm(spreadsheet, data) {
  const sheetName = 'Quote Requests';
  const headers = [
    'Timestamp', 'Name', 'Phone', 'Email', 'Product Type',
    'Description', 'Weight (kg)', 'Pickup Location',
    'Drop Location', 'Service', 'Status'
  ];
  
  const sheet = getOrCreateSheet(spreadsheet, sheetName, headers, '#4285f4');
  
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString(),
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
  ]);
  
  sendEmail({
    type: 'quote',
    data: data,
    recipient: ADMIN_EMAIL,
    subject: 'New Quote Request'
  });
}

function getOrCreateSheet(spreadsheet, sheetName, headers, headerColor) {
  let sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    formatHeaderRow(sheet, headers.length, headerColor);
  }
  
  return sheet;
}

function formatHeaderRow(sheet, columns, color) {
  sheet.getRange(1, 1, 1, columns)
    .setFontWeight('bold')
    .setBackground(color)
    .setFontColor('white');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, columns);
}

function sendEmail(params) {
  try {
    const message = `
      ${params.type === 'quote' ? 'Quote Request' : 'Contact Form'} Details:
      Name: ${params.data.name}
      Email: ${params.data.email}
      Phone: ${params.data.phone}
      ${params.type === 'quote' ? `
      Product: ${params.data.productType}
      Weight: ${params.data.weight} kg
      Pickup: ${params.data.pickupLocation}
      Drop: ${params.data.dropLocation}
      ` : `
      Subject: ${params.data.subject}
      `}
      Message: ${params.data.message || 'N/A'}
    `;
    
    MailApp.sendEmail(params.recipient, params.subject, message);
  } catch (error) {
    console.error('Email failed:', error);
  }
}

// ========== SETUP FUNCTION (RUN ONCE) ========== //
function setupSheets() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  
  // Initialize sheets
  processContactForm(spreadsheet, {});
  processQuoteForm(spreadsheet, {});
  
  console.log('Sheets initialized successfully');
}