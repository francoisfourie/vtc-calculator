// UI utility functions
function issue(t) {
    showAlert(t, 'danger');
}

function cleanScreen() {
    $('.alert .btn-close').click();
    $(".tabcontent").removeClass("d-none");
}

function openTab(evt, cityName) {
    // Declare all variables
    cleanScreen();
    
    // Get all buttons with class="nav-button" and remove the class "active"s
    var buttons = document.getElementsByClassName("nav-button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    // Add the "active" class to the clicked button
    event.currentTarget.classList.add("active");

    var i, tabcontent, tablinks;

    $("#result").html("");
    $("#footernote").html("");
    $("#actionSection").html("");

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function numberWithCommas(x) {
    x = parseFloat(x);
    return x.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function setResult(value) {
    $("#result").html(value);
    $("#footernote").html(`<p class="responsive-font-table text-secondary" style=" font-style: italic;">
    <i>Please note that these fees are provided as a general guide and do not represent an exhaustive list of potential charges. For a precise calculation of all applicable costs, we recommend contacting our offices to request a detailed, formal quote.</i> <br>
    <i>It's important to note that your transaction may incur additional costs and disbursements beyond the fees listed above. These can include expenses for obtaining rates and levies information, Transfer Duty, Homeowners Association figures, FICA compliance, Conveyancers Certificates, Powers of Attorney, and various undertakings. Such extra expenses are not included in the initial estimate and will be added to the total cost. We recommend factoring in these potential additional expenses when budgeting for your transaction.</i>
    </p>`);
    $(".tabcontent").addClass("d-none");
    $("#actionSection").html(`<div class="container light-border"> <button type="button" class="btn btn-secondary" id="captureAndEmail">
    <i class="fas fa-envelope"></i> Email
</button>
<button type="button" class="btn btn-secondary" id="captureAndWhatsApp">
    <i class="fas fa-download"></i> Download
</button></div>`);
}

const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
const showAlert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}
