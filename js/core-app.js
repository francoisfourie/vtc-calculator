// Core application initialization
$(document).ready(function () {
    let csrfToken = '';

    // Fetch CSRF token when the page loads
    $.get('email_sender.php', function(data) {
        csrfToken = JSON.parse(data).csrf_token;
    });
    
    // Check if running inside iframe and adjust display accordingly
    checkIframeStatus();
    
    // Set up event listeners for the action buttons
    setupActionButtons(csrfToken);
});

function checkIframeStatus() {
    if ($(window.parent)[0] !== window) {
        console.log("Page is running inside an iframe.");
        $('#topbar').removeClass("d-flex").addClass("d-none");
    } else {
        console.log("Page is not running inside an iframe.");
    }
}
