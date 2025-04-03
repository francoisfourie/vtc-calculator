// Main index file that loads all modules
// This file should be included last in your HTML

// Set initial state for buttons
$(".sumButton").addClass("hidden");

// Expose the public functions needed by the HTML
window.calculateTransfer = calculateTransfer;
window.calculateBondCosts = calculateBondCosts;
window.calculateInstalments = calculateInstalments;
window.openTab = openTab;
