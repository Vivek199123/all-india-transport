// Google Apps Script for Quote Form
// Copy this code to your Google Apps Script project

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet (you'll need to replace this with your sheet ID)
    const spreadsheet = SpreadsheetApp.openById('1kTQOggvfFOLA9hbL65cYEKkaWeH1gtrlt2dXqllFz6E');
    const sheet = spreadsheet.getSheetByName('Quote Requests');
    
    // Prepare the row data
    const rowData = [
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
      'Pending' // Status
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Send email notification (optional)
    sendEmailNotification(data);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Quote Form Handler is working!')
    .setMimeType(ContentService.MimeType.TEXT);
}

function sendEmailNotification(data) {
  // Optional: Send email notification to admin
  const adminEmail = 'allindtra@gmail.com'; // Replace with your email
  const subject = 'New Quote Request - All India Transport';
  const message = `
    New quote request received:
    
    Name: ${data.name}
    Phone: ${data.phone}
    Email: ${data.email}
    Product Type: ${data.productType}
    Description: ${data.description}
    Weight: ${data.weight} kg
    Pickup Location: ${data.pickupLocation}
    Drop Location: ${data.dropLocation}
    Service: ${data.service}
    Timestamp: ${data.timestamp}
  `;
  
  try {
    MailApp.sendEmail(adminEmail, subject, message);
  } catch (error) {
    console.log('Email notification failed:', error);
  }
}

// Function to set up the spreadsheet headers
function setupSpreadsheet() {
  const spreadsheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID_HERE');
  const sheet = spreadsheet.getSheetByName('Quote Requests');
  
  // Set up headers
  const headers = [
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
  
  // Clear existing data and set headers
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('white');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);
} 