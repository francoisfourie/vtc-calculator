$(document).ready(function () {

    let csrfToken = '';
    let capturedImageData = null;

    // Fetch CSRF token when the page loads
    $.get('email_sender.php', function(data) {
        csrfToken = JSON.parse(data).csrf_token;
    });
    
    if ($(window.parent)[0] !== window) {
        // The page is running inside an iframe
        console.log("Page is running inside an iframe.");
        $('#topbar').removeClass("d-flex").addClass("d-none");
    } else {
        // The page is not running inside an iframe
        console.log("Page is not running inside an iframe.");
        //$('#topbar').removeClass("d-none").addClass("d-flex");
    }

    function captureToPDF() {
        return new Promise((resolve, reject) => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
    
            const content = document.getElementById("maintab");
    
            // Fetch the HTML template
            fetch('pdf_template.html')
                .then(response => response.text())
                .then(template => {
                    // Create a temporary div to hold the template
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = template;
    
                    // Find the content div in the template
                    const contentDiv = tempDiv.querySelector('.content');
                    if (contentDiv) {
                        // Insert the captured content into the template
                        contentDiv.innerHTML = content.innerHTML;
                    }
    
                    // Generate PDF from the modified template
                    doc.html(tempDiv, {
                        callback: function (doc) {
                            // Check the number of pages and remove extra pages
                            const totalPages = doc.internal.getNumberOfPages();
                            if (totalPages > 1) {
                                for (let i = totalPages; i > 1; i--) {
                                    doc.deletePage(i);
                                }
                            }
    
                            // Resolve the promise with the PDF document
                            resolve(doc);
                        },
                        x: 10,
                        y: 10,
                        width: 190, // Adjust as needed
                        windowWidth: 1000 // Use a fixed width for consistency
                    });
                })
                .catch(error => {
                    console.error('Error loading template:', error);
                    reject(error);
                });
        });
    }
    
   
    $(document).on('click', '#captureAndEmail', function() {
      
        captureToPDF().then(pdf => {
            const pdfData = pdf.output('datauristring');
            
            console.log("PDF Data length:", pdfData.length);
            var emailModal = new bootstrap.Modal(document.getElementById('emailModal'));
            emailModal.show();
    
            $("#sendEmailBtn").click(function() {
                const recipientEmail = $('#recipientEmail').val();
                if (!recipientEmail) {
                    alert('Please enter a valid email address.');
                    return;
                }
                $('#emailModal').modal('hide');
                $.ajax({
                    url: 'email_sender.php',
                    method: 'POST',
                    data: {
                        csrf_token: csrfToken,
                        to: recipientEmail,
                        subject: 'PDF Capture',
                        message: 'Please find the PDF capture attached.',
                        pdf: pdfData
                    },
                    dataType: 'json',
                    success: function(response) {
                        if (response.success) {
                            console.log('Email sent successfully');
                           // alert('Email sent successfully!');
                            
                        } else {
                            console.error('Failed to send email:', response.message);
                            alert('Failed to send email: ' + response.message);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('AJAX error:', status, error);
                        $('#emailModal').modal('hide');
                        alert('An error occurred while sending the email.');
                        
                    }
                });
            });
        }).catch(error => {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF');
        });

       // emailModal.hide();

    });

    // $("#sendEmailBtn").click(function() {
    //     alert('2');
    //     const recipientEmail = $('#recipientEmail').val();
    //     if (!recipientEmail) {
    //         alert('Please enter a valid email address.');
    //         return;
    //     }

    //     $.ajax({
    //         url: 'email_sender.php',
    //         method: 'POST',
    //         data: {
    //             csrf_token: csrfToken,
    //             to: recipientEmail,
    //             image: capturedImageData
    //         },
    //         dataType: 'json',
    //         success: function(response) {
    //             if (response.success) {
    //                 console.log('Email sent successfully');
    //                 $('#emailModal').modal('hide');
    //                 alert('Email sent successfully!');
    //             } else {
    //                 console.error('Failed to send email:', response.message);
    //                 alert('Failed to send email: ' + response.message);
    //             }
    //         },
    //         error: function(xhr, status, error) {
    //             console.error('AJAX error:', status, error);
    //             alert('An error occurred while sending the email.');
    //         }
    //     });

    //     var emailModal = bootstrap.Modal.getInstance(document.getElementById('emailModal'));
    //         if (emailModal) {
    //             emailModal.hide();
    //         }

    // });
    
    $(document).on('click', '#captureAndWhatsApp', function() {
        captureToPDF().then(pdf => {
            // Always save the PDF for testing purposes
            pdf.save("vtc.pdf");
    
            if (navigator.share) {
                const pdfBlob = pdf.output('blob');
                navigator.share({
                    files: [new File([pdfBlob], 'vtc.pdf', { type: 'application/pdf' })],
                    title: 'VTC Estimate',
                    text: 'VTC Estimate'
                }).then(() => console.log('Shared successfully'))
                  .catch((error) => console.error('Error sharing:', error));
            } else {
                // Fallback for devices that don't support Web Share API
                alert("Your device doesn't support direct sharing. The PDF has been saved, you can share it manually.");
            }
        }).catch(error => {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF');
        });
    });

  
        // To handle the close button and top-right (x) button:
        $(document).on('click', '[data-bs-dismiss="modal"]', function() {
            var emailModal = bootstrap.Modal.getInstance(document.getElementById('emailModal'));
            if (emailModal) {
                emailModal.hide();
            }
        });
})

// transfer
function calculateTransfer(event) {
    cleanScreen();
    event.preventDefault()
    var tranval = document.getElementById("amntt").value.replace(/,/g, '') ;

    var data = getFees(tranval);

    //from sheet, exclude VAT
    var tf = parseInt(data.transfer_duty)
    var dof = parseInt(data.deeds_office_charge)

    var af = data.fee
    var ps = 350.00

    var SCandFS = 100.00 //new
    var Transfee = 375.00 //FF new 05/07/2024
    var ratesclearcert = 80.00 //new
    var fica = 800.00  //FF new 05/07/2024
    var dgf = 607.00
    var erf = 1000.00
    var pp = 950.00
    var etdf = 325.00 //FF new 05/07/2024

    var payverlexis = 225;
    var accverfee = 17.5;
    var elecfacfee = 625;


    var subtotal = af + ps  + dgf + erf + pp + SCandFS + Transfee + fica + ratesclearcert + etdf + payverlexis + accverfee + elecfacfee;

    var vatcalc = (15 / 100) * subtotal
    var vat = vatcalc
    
    
    var tc = subtotal + vatcalc + dof + tf 

    var total = tc

    setResult(
        `
            <div style="overflow-x:auto;" class="result">
            <div class="form-header bg-secondary text-white py-2 px-3 rounded">
            <h6 class="h6 m-0">Transfer costs on R${numberWithCommas(tranval)}</h6>
        </div>
                        
<hr/>
        <table class="table responsive-font-table">
        <tr >
        <td colspan="2" > <b>GOVERNMENT COSTS </b> </td>
        </tr>
        <tr>
        <td>Deeds Office Fees</td>
        <td  >R${numberWithCommas(dof)}</td>
        </tr>
        <tr>
        <td>Transfer Duties</td>
        <td  >R${numberWithCommas(tf)}</td>
        </tr>
        <tr>
        <td colspan="2" > <b>ATTORNEYS COSTS </b> </td>
        </tr>
        <tr>
        <td>Attorney Fee</td>
        <td  >R${numberWithCommas(af)}</td>
        </tr>
        <tr>
        <td>Property Search</td>
        <td  >R${numberWithCommas(ps)}</td>
        </tr>
        <tr>
        <td>Postage & Petties</td>
        <td  >R${numberWithCommas(pp)}</td>
        </tr>
       
        <tr>
        <td>Document Generation Fees</td>
        <td  >R${numberWithCommas(dgf)}</td>
        </tr>
        <tr>
        <td>Electronic Rates Application Fee</td>
        <td  >R${numberWithCommas(erf)}</td>
        </tr>
        <tr>
        <td>FICA</td>
        <td  >R${numberWithCommas(fica)}</td>
        </tr>
        <tr>
        <td>Secure Chat and File Storage</td>
        <td  >R${numberWithCommas(SCandFS)}</td>
        </tr>
        <tr>
        <td>Transfer Duty Submission Fee</td>
        <td  >R${numberWithCommas(Transfee)}</td>
        </tr>
        
        <tr>
        <td>Rates Clearance Certificate Fee</td>
        <td  >R${numberWithCommas(ratesclearcert)}</td>
        </tr>
        <tr>
        <td>Electronic Transfer Duty Fee</td>
        <td  >R${numberWithCommas(etdf)}</td>
        </tr> 
        
        <tr>
        <td>Payment verification via Lexis Pay</td>
        <td>R${numberWithCommas(payverlexis)}</td>
        </tr>
        <tr>

        <tr>
        <td>Account verification and payment fee</td>
        <td>R${numberWithCommas(accverfee)}</td>
        </tr>
        <tr>

        <tr>
        <td>Electronic Facilitation Fee</td>
        <td >R${numberWithCommas(elecfacfee)}</td>
        </tr>
        <tr>

        <tr >
        <td colspan = "2"></td>
        
      </tr>

        <tr >
    <td>VAT</td>
    <td>R${numberWithCommas(vat)}</td>
  </tr>

        <tr class="table-secondary">
        <td><b>Total</b></td>
        <td  ><b>R${numberWithCommas(total)}</b></td>
        </tr>
            </table>
            <hr/>
        </div>
        `
    )

}

// Bond
function calculateBondCosts(event) {
    cleanScreen();
    event.preventDefault()

    var tranval = document.getElementById("amnt").value.replace(/,/g, '');

    var data = getFees(tranval);

    var af = data.fee

    var ps = 375.00
    var dgf = 1550.00 //FF New 05/07/2024
    var eff = 1000.00 //FF New 05/07/2024
    var pp = 950.00
    var fica = 250.00
    var dosearchfee = 545;

    var subtotal = af + ps + dgf + eff + pp + fica + dosearchfee
    var vatcalc = (15 / 100) * subtotal;

    var vat = vatcalc

    var dof = parseInt(data.deeds_office_charge)
    var tc = subtotal + vatcalc + dof

    var total = tc


    setResult(`
            <div style="overflow-x:auto;" class="result">
            
            <div style="overflow-x:auto;" class="result">
              <div class="form-header bg-secondary text-white py-2 px-3 rounded">
                <h6 class="h6 m-0">Bond costs on R${numberWithCommas(tranval)}</h6>
            </div>
            
       
            <table class="table responsive-font-table">
            <tr >
            <td colspan="2" > <b>GOVERNMENT COSTS </b> </td>
            </tr>
            <tr>
            <td>Deeds Office Fees</td>
            <td  >R${numberWithCommas(dof)}</td>
            </tr>
        <tr>
        <tr>
        <td colspan="2" > <b>ATTORNEYS COSTS </b> </td>
        </tr>

        <td>Attorney Fee</td>
        <td  >R${numberWithCommas(af)}</td>
        </tr>  
        <tr>
        <td>Property Search</td>
        <td  >R${numberWithCommas(ps)}</td>
        </tr>
        <tr>
        <td>Postage & Petties</td>
        <td  >R${numberWithCommas(pp)}</td>
        </tr>
        <tr>
        <td>Document Generation Fees</td>
        <td  >R${numberWithCommas(dgf)}</td>
        </tr>
        <tr>
        <td>Electronic Facilitation Fee</td>
        <td  >R${numberWithCommas(eff)}</td>
        </tr>
        <tr>
        <td>FICA</td>
        <td  >R${numberWithCommas(fica)}</td>
        </tr>
        <tr>
        <td>Deeds Office search Fee</td>
        <td  >R${numberWithCommas(dosearchfee)}</td>
        </tr>
        <tr >
        <td colspan = "2"></td>
        
      </tr>

        <tr >
    <td>VAT</td>
    <td>R${numberWithCommas(vat)}</td>
  </tr>

        <tr class="table-secondary">
        <td><b>Total</b></td>
        <td  ><b>R${numberWithCommas(total)}</b></td>
        </tr>
            </table>
            <hr/>
        </div>
        `)


}

// Loan Calc
function calculateInstalments(event) {
    cleanScreen();
    event.preventDefault()
    //Look up the input and output elements in the document
    var amount = document.getElementById("Loan_price");
    var apr = document.getElementById("Interest_per");
    var Loan_Years = document.getElementById("Loan_Term");


    var principal = parseFloat(amount.value.replace(/,/g, ''));
    var interest = parseFloat(apr.value.replace(/,/g, '')) / 100 / 12;
    var payments = parseFloat(Loan_Years.value.replace(/,/g, '')) * 12;

    // compute the monthly payment figure
    var x = Math.pow(1 + interest, payments); //Math.pow computes powers
    var monthly = (principal * x * interest) / (x - 1);

    // If the result is a finite number, the user's input was good and
    // we have meaningful results to display
    if (isFinite(monthly)) {
        // Fill in the output fields, rounding to 2 decimal places
        var MonthlyP = monthly;
        var GrandTotal = (monthly * payments);
        var interestP = ((monthly * payments) - principal);

        setResult(
            `
    
    <div style="overflow-x:auto;" class="result">
              <div class="form-header bg-secondary text-white py-2 px-3 rounded">
                <h6 class="h6 m-0">Instalments Costs on R${numberWithCommas(principal)}</h6>
            </div>
    
        <hr/>
            <table class="table table-striped responsive-font-table">
        <tr>
        <td>Pay-off time</td>
        <td>${numberWithCommas(Loan_Years.value)} Years</td>
        </tr>
        <tr>
        <td>Monthly payment</td>
        <td  >R${numberWithCommas(MonthlyP)}</td>
        </tr>
        <tr>
        <td>Total capital paid</td>
        <td  >R${numberWithCommas(principal)}</td>
        </tr>
        <tr>
        <td>Total interest paid</td>
        <td  >R${numberWithCommas(interestP)}</td>
        </tr>
        <tr>
        <td><b>Total amount paid</b></td>
        <td  ><b>R${numberWithCommas(GrandTotal)}</b></td>
        </tr>
            </table>
            <hr/>
        </div>`
        )

    }
    else {
        issue("Please enter a valid value")
    }

}


function issue(t) {
    // $("#alertMessage").html(`${t}`)
    // jQuery('.alert').removeClass('hide')
    // jQuery('.alert').removeClass('fade')
    showAlert(t,'danger');
}

function cleanScreen() {
    // $("#alertMessage").html("");
    // $('.alert').addClass('hide');
    // $('.alert').addClass('fade');
    $('.alert .btn-close').click();
    //$("#result").removeClass("light-border");
    $(".tabcontent").removeClass("d-none");
}



// Tabs

function openTab(evt, cityName) {
    // Declare all variables
    cleanScreen()
// Get all buttons with class="nav-button" and remove the class "active"s
    var buttons = document.getElementsByClassName("nav-button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    // Add the "active" class to the clicked button
    event.currentTarget.classList.add("active");


    var i, tabcontent, tablinks;

   $("#result").html("")
   $("#footernote").html("")
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
    // var y = parseInt(x)
    x = parseFloat(x);
    return x.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

$(".sumButton").addClass("hidden")

// find value
// Function to get fees for a specific bond amount
function getFees(bondAmount) {
    const feesData = getCostsFromFile();

    // Extract the minimum and maximum bond amounts from the fees data
    let minBondAmount = Infinity;
    let maxBondAmount = -Infinity;

    for (const feeEntry of feesData.fees) {
        if (feeEntry.bond_amount_range.includes("-")) {
            const range = feeEntry.bond_amount_range.split("-");
            const lowerBound = parseFloat(range[0].replace(/,/g, ''));
            const upperBound = parseFloat(range[1].replace(/,/g, '')) || lowerBound;

            if (lowerBound < minBondAmount) minBondAmount = lowerBound;
            if (upperBound > maxBondAmount) maxBondAmount = upperBound;
        } else {
            const amount = parseFloat(feeEntry.bond_amount_range.replace(/,/g, ''));
            if (amount < minBondAmount) minBondAmount = amount;
            if (amount > maxBondAmount) maxBondAmount = amount;
        }
    }

    // Handle cases where bond amount is less than the minimum bond amount
    if (bondAmount < minBondAmount) {
        issue("Please insert an amount more than R" + numberWithCommas(minBondAmount));
        return;
        // return {
        //     fee: feesData.fees[0].fee,
        //     vat: feesData.fees[0].vat,
        //     total: feesData.fees[0].fee_plus_vat,
        //     deeds_office_charge: feesData.fees[0].deeds_office_charge,
        //     transfer_duty: feesData.fees[0].transfer_duty
        // };
    }

    // Handle cases where bond amount is greater than the maximum bond amount
    if (bondAmount > maxBondAmount) {
        const lastEntryIndex = feesData.fees.length - 1;
        // return {
        //     fee: feesData.fees[lastEntryIndex].fee,
        //     vat: feesData.fees[lastEntryIndex].vat,
        //     total: feesData.fees[lastEntryIndex].fee_plus_vat,
        //     deeds_office_charge: feesData.fees[lastEntryIndex].deeds_office_charge,
        //     transfer_duty: feesData.fees[lastEntryIndex].transfer_duty
        // };
        issue("Please insert an amount less than R" + numberWithCommas(maxBondAmount));
        return;
    }

    let closestLowerBound = -Infinity;
    let closestFees = null;

    for (const feeEntry of feesData.fees) {
        if (feeEntry.bond_amount_range.includes("-")) {
            const range = feeEntry.bond_amount_range.split("-");
            const lowerBound = parseFloat(range[0].replace(/,/g, ''));
            const upperBound = parseFloat(range[1].replace(/,/g, '')) || lowerBound;

            if (bondAmount >= lowerBound && bondAmount <= upperBound) {
                return {
                    fee: feeEntry.fee,
                    vat: feeEntry.vat,
                    total: feeEntry.fee_plus_vat,
                    deeds_office_charge: feeEntry.deeds_office_charge,
                    transfer_duty: feeEntry.transfer_duty
                };
            } else if (bondAmount > lowerBound && lowerBound > closestLowerBound) {
                closestLowerBound = lowerBound;
                closestFees = {
                    fee: feeEntry.fee,
                    vat: feeEntry.vat,
                    total: feeEntry.fee_plus_vat,
                    deeds_office_charge: feeEntry.deeds_office_charge,
                    transfer_duty: feeEntry.transfer_duty
                };
            }
        } else {
            const amount = parseFloat(feeEntry.bond_amount_range.replace(/,/g, ''));
            if (bondAmount >= amount && amount > closestLowerBound) {
                closestLowerBound = amount;
                closestFees = {
                    fee: feeEntry.fee,
                    vat: feeEntry.vat,
                    total: feeEntry.fee_plus_vat,
                    deeds_office_charge: feeEntry.deeds_office_charge,
                    transfer_duty: feeEntry.transfer_duty,
                };
            }
        }
    }
    
    return closestFees; // Return closest fees found
}





function getCostsFromFile() {
    var timestamp = new Date().getTime(); // Get current timestamp
    var data = $.ajax({
        type: 'GET',
        url: `costs.json?t=${timestamp}`, // Append timestamp as a query parameter
        async: false,
        dataType: "json",
        cache: false, // Disable jQuery's ajax cache
        success: function (data) {
            return data;
        },
        error: function (xhr, type, exception) {
            issue("Error reading from cost file");
        }
    });

    if (data.status === 200) {
        json = data.responseJSON;
        return json;
    }
}


function setResult(value)
{
    $("#result").html(value);
    $("#footernote").html(`<p class="responsive-font-table text-secondary" style=" font-style: italic;">
    <i>Please note that these fees are provided as a general guide and do not represent an exhaustive list of potential charges. For a precise calculation of all applicable costs, we recommend contacting our offices to request a detailed, formal quote.</i> <br>
    <i>It's important to note that your transaction may incur additional costs and disbursements beyond the fees listed above. These can include expenses for obtaining rates and levies information, Transfer Duty, Homeowners Association figures, FICA compliance, Conveyancers Certificates, Powers of Attorney, and various undertakings. Such extra expenses are not included in the initial estimate and will be added to the total cost. We recommend factoring in these potential additional expenses when budgeting for your transaction.</i>
    </p>`)
   // $("#result").addClass("light-border");
    $(".tabcontent").addClass("d-none");
    $("#actionSection").html(`<div class="container light-border"> <button type="button" class="btn btn-secondary" id="captureAndEmail">
    <i class="fas fa-envelope"></i> Email
</button>
<button type="button" class="btn btn-secondary" id="captureAndWhatsApp">
    <i class="fas fa-download"></i> Download
</button></div>`);

}


const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const showAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
}


function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}


