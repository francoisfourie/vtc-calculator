// Calculate transfer, bond costs, and loan instalments functions
function calculateTransfer(event) {
    cleanScreen();
    event.preventDefault();
    var tranval = document.getElementById("amntt").value.replace(/,/g, '');

    var data = getFees(tranval);
    if (!data) return; // Exit if data is invalid

    //from sheet, exclude VAT
    var tf = parseInt(data.transfer_duty);
    var dof = parseInt(data.deeds_office_charge);

    var af = data.fee;
    var ps = 350.00;

    var SCandFS = 100.00; //new
    var Transfee = 375.00; //FF new 05/07/2024
    var ratesclearcert = 80.00; //new
    var fica = 800.00;  //FF new 05/07/2024
    var dgf = 607.00;
    var erf = 1000.00;
    var pp = 950.00;
    var etdf = 325.00; //FF new 05/07/2024

    var payverlexis = 225;
    var accverfee = 17.5;
    var elecfacfee = 625;

    var subtotal = af + ps + dgf + erf + pp + SCandFS + Transfee + fica + ratesclearcert + etdf + payverlexis + accverfee + elecfacfee;
    var vatcalc = (15 / 100) * subtotal;
    var vat = vatcalc;
    
    var total = subtotal + vatcalc + dof + tf;

    setResult(
        generateTransferCostsTable(tranval, dof, tf, af, ps, pp, dgf, erf, fica, SCandFS, Transfee, ratesclearcert, etdf, payverlexis, accverfee, elecfacfee, vat, total)
    );
}

function calculateBondCosts(event) {
    cleanScreen();
    event.preventDefault();

    var tranval = document.getElementById("amnt").value.replace(/,/g, '');

    var data = getFees(tranval);
    if (!data) return; // Exit if data is invalid

    var af = data.fee;

    var ps = 375.00;
    var dgf = 1550.00; //FF New 05/07/2024
    var eff = 1000.00; //FF New 05/07/2024
    var pp = 950.00;
    var fica = 250.00;
    var dosearchfee = 545;

    var subtotal = af + ps + dgf + eff + pp + fica + dosearchfee;
    var vatcalc = (15 / 100) * subtotal;
    var vat = vatcalc;

    var dof = parseInt(data.deeds_office_charge);
    var total = subtotal + vatcalc + dof;

    setResult(
        generateBondCostsTable(tranval, dof, af, ps, pp, dgf, eff, fica, dosearchfee, vat, total)
    );
}

function calculateInstalments(event) {
    cleanScreen();
    event.preventDefault();
    
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
            generateInstalmentsTable(principal, Loan_Years.value, MonthlyP, principal, interestP, GrandTotal)
        );
    } else {
        issue("Please enter a valid value");
    }
}
