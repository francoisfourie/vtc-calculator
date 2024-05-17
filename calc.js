$(document).ready(function () {

    if ($(window.parent)[0] !== window) {
        // The page is running inside an iframe
        console.log("Page is running inside an iframe.");
        $('#topbar').removeClass("d-flex").addClass("d-none");
    } else {
        // The page is not running inside an iframe
        console.log("Page is not running inside an iframe.");
        //$('#topbar').removeClass("d-none").addClass("d-flex");
    }


})

// transfer
function calculateTransfer(event) {
    cleanScreen();
    event.preventDefault()
    var tranval = document.getElementById("amntt").value.replace(/,/g, '');

    var data = getFees(tranval);

    var af = data.fee
    var ps = 350.00

    var SCandFS = 85.00 //new
    var Transfee = 350.00 //new
    var ratesclearcert = 80.00 //new
    var fica = 250.00  //new
    var dgf = 607.00
    var erf = 1000.00
    var pp = 950.00
    var subtotal = af + ps  + dgf + erf + pp + SCandFS + Transfee + fica
    var vatcalc = (15 / 100) * subtotal
    var vat = vatcalc
    var etdf = 300.00
    var tf = parseInt(data.transfer_duty)
    var dof = parseInt(data.deeds_office_charge)
    var tc = subtotal + vatcalc + dof + etdf + tf + ratesclearcert

    var total = tc

    setResult(
        `
            
            <div style="overflow-x:auto;" class="result">
           <div class="form-header bg-secondary text-white py-2 px-3 rounded">
                <h6 class="h6 m-0">Transfer costs on R${numberWithCommas(tranval)}</h6>
            </div>
            
            
<hr/>
            <table class="table table-striped">
        <tr>
        <td>Attorney Fees</td>
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
        <td>VAT</td>
        <td  >R${numberWithCommas(vat)}</td>
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
        <td>Deeds Office Fees</td>
        <td  >R${numberWithCommas(dof)}</td>
        </tr>
        <tr>
        <td>Transfer Duties</td>
        <td  >R${numberWithCommas(tf)}</td>
        </tr>
        <tr>
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
    var dgf = 520.00
    var eff = 1150.00
    var pp = 950.00
    var fica = 250.00
    var subtotal = af + ps + dgf + eff + pp + fica
    var vatcalc = (15 / 100) * subtotal
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
            
<hr/>
            <table  class="table table-striped">
        <tr>
        <td>Attorney Fees</td>
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
        <td>VAT</td>
        <td  >R${numberWithCommas(vat)}</td>
        </tr>
        
        <tr>
        <td>Deeds Office Fees</td>
        <td  >R${numberWithCommas(dof)}</td>
        </tr>
        <tr>
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
    <table class="table table-striped">
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
    var i, tabcontent, tablinks;

   $("#result").html("")

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

    // if (cityName == "BA") {
    //     $("#Sub-Def").click()
    // }
}


function numberWithCommas(x) {
    // var y = parseInt(x)
    return x.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

$(".sumButton").addClass("hidden")

// find value
// Function to get fees for a specific bond amount
function getFees(bondAmount) {
    feesData = getCostsFromFile();

    // Handle cases where bond amount is less than 500,000
    if (bondAmount < 500000) {
        return {
            fee: feesData.fees[0].fee,
            vat: feesData.fees[0].vat,
            total: feesData.fees[0].fee_plus_vat,
            deeds_office_charge: feesData.fees[0].deeds_office_charge,
            transfer_duty: feesData.fees[0].transfer_duty
        };
    }

    // Handle cases where bond amount is greater than 6,000,000
    if (bondAmount > 6000000) {
        const lastEntryIndex = feesData.fees.length - 1;
        return {
            fee: feesData.fees[lastEntryIndex].fee,
            vat: feesData.fees[lastEntryIndex].vat,
            total: feesData.fees[lastEntryIndex].fee_plus_vat,
            deeds_office_charge: feesData.fees[lastEntryIndex].deeds_office_charge,
            transfer_duty: feesData.fees[lastEntryIndex].transfer_duty
        };
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

    var data = $.ajax({
        type: 'GET',
        url: `costs.json`,
        async: false,
        dataType: "json",
        success: function (data) {
            return data;
        },
        error: function (xhr, type, exception) {
            issue("Error reading from cost file")
        }
    });

    if (data.status === 200) {
        json = data.responseJSON
        return json;
    }

}


function setResult(value)
{
    $("#result").html(value);
   // $("#result").addClass("light-border");
    $(".tabcontent").addClass("d-none");
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


