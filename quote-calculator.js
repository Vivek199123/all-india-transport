// Quote Calculator JavaScript Functions

// Toggle dimensions input based on package type
function toggleDimensions() {
    const packageType = document.getElementById('packageType').value;
    const dimensionsGroup = document.getElementById('dimensionsGroup');
    
    if (packageType === 'volumetric') {
        dimensionsGroup.classList.add('show');
        // Mark dimension fields as required
        const dimensionInputs = dimensionsGroup.querySelectorAll('input');
        dimensionInputs.forEach(input => input.required = true);
    } else {
        dimensionsGroup.classList.remove('show');
        // Remove required attribute from dimension fields
        const dimensionInputs = dimensionsGroup.querySelectorAll('input');
        dimensionInputs.forEach(input => {
            input.required = false;
            input.value = ''; // Clear values
        });
    }
}

// Calculate courier rate based on inputs
function calculateCourierRate() {
    // Get form values
    const packageType = document.getElementById('packageType').value;
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const distance = parseFloat(document.getElementById('distance').value) || 0;
    const serviceType = document.getElementById('serviceType').value;
    
    // Validation
    if (!packageType || weight <= 0 || distance <= 0 || !serviceType) {
        alert('Please fill in all required fields with valid values.');
        return;
    }
    
    let finalWeight = weight;
    
    // Calculate volumetric weight if needed
    if (packageType === 'volumetric') {
        const length = parseFloat(document.getElementById('length').value) || 0;
        const width = parseFloat(document.getElementById('width').value) || 0;
        const height = parseFloat(document.getElementById('height').value) || 0;
        
        if (length <= 0 || width <= 0 || height <= 0) {
            alert('Please enter valid dimensions for volumetric calculation.');
            return;
        }
        
        // Volumetric weight formula: (L × W × H) / 5000
        const volumetricWeight = (length * width * height) / 5000;
        finalWeight = Math.max(weight, volumetricWeight);
    }
    
    // Base rate calculation
    let baseRate = 0;
    
    // Rate structure based on weight (per kg)
    if (finalWeight <= 1) {
        baseRate = 50;
    } else if (finalWeight <= 5) {
        baseRate = 40;
    } else if (finalWeight <= 10) {
        baseRate = 35;
    } else if (finalWeight <= 25) {
        baseRate = 30;
    } else {
        baseRate = 25;
    }
    
    // Distance multiplier
    let distanceMultiplier = 1;
    if (distance <= 100) {
        distanceMultiplier = 1;
    } else if (distance <= 500) {
        distanceMultiplier = 1.2;
    } else if (distance <= 1000) {
        distanceMultiplier = 1.5;
    } else {
        distanceMultiplier = 2;
    }
    
    // Service type multiplier
    let serviceMultiplier = 1;
    switch (serviceType) {
        case 'standard':
            serviceMultiplier = 1;
            break;
        case 'express':
            serviceMultiplier = 1.5;
            break;
        case 'overnight':
            serviceMultiplier = 2;
            break;
        case 'same-day':
            serviceMultiplier = 3;
            break;
    }
    
    // Calculate final rate
    const subtotal = finalWeight * baseRate * distanceMultiplier * serviceMultiplier;
    const gst = subtotal * 0.18; // 18% GST
    const totalRate = subtotal + gst;
    
    // Display results
    displayResults({
        finalWeight: finalWeight,
        baseRate: baseRate,
        distanceMultiplier: distanceMultiplier,
        serviceMultiplier: serviceMultiplier,
        subtotal: subtotal,
        gst: gst,
        totalRate: totalRate,
        serviceType: serviceType
    });
}

// Display calculation results
function displayResults(calculation) {
    const resultSection = document.getElementById('resultSection');
    const rateDisplay = document.getElementById('rateDisplay');
    const rateBreakdown = document.getElementById('rateBreakdown');
    
    // Show result section
    resultSection.style.display = 'block';
    
    // Display total rate
    rateDisplay.innerHTML = `Estimated Rate: ₹${calculation.totalRate.toFixed(2)}`;
    
    // Display breakdown
    rateBreakdown.innerHTML = `
        <div><span>Chargeable Weight:</span><span>${calculation.finalWeight.toFixed(2)} kg</span></div>
        <div><span>Base Rate:</span><span>₹${calculation.baseRate}/kg</span></div>
        <div><span>Distance Factor:</span><span>${calculation.distanceMultiplier}x</span></div>
        <div><span>Service Factor:</span><span>${calculation.serviceMultiplier}x</span></div>
        <div><span>Subtotal:</span><span>₹${calculation.subtotal.toFixed(2)}</span></div>
        <div><span>GST (18%):</span><span>₹${calculation.gst.toFixed(2)}</span></div>
        <div style="border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px; font-weight: bold;">
            <span>Total Amount:</span><span>₹${calculation.totalRate.toFixed(2)}</span>
        </div>
    `;
    
    // Scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners
    const packageTypeSelect = document.getElementById('packageType');
    if (packageTypeSelect) {
        packageTypeSelect.addEventListener('change', toggleDimensions);
    }
    
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateCourierRate);
    }
});