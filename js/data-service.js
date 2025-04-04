// Data fetching and processing functions
let loggingEnabled = true;

function getFees(bondAmount) {
    const feesData = getCostsFromFile();
    if (!feesData) return null;

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

    if (loggingEnabled) {
        console.log(`Minimum bond amount: R${numberWithCommas(minBondAmount)}`);
        console.log(`Maximum bond amount: R${numberWithCommas(maxBondAmount)}`);
    }

    // Handle cases where bond amount is less than the minimum bond amount
    if (bondAmount < minBondAmount) {
        if (loggingEnabled) {
            console.log(`Bond amount (R${numberWithCommas(bondAmount)}) is less than the minimum bond amount (R${numberWithCommas(minBondAmount)})`);
        }
        issue("Please insert an amount more than R" + numberWithCommas(minBondAmount));
        return null;
    }

    // Handle cases where bond amount is greater than the maximum bond amount
    if (bondAmount > maxBondAmount) {
        if (loggingEnabled) {
            console.log(`Bond amount (R${numberWithCommas(bondAmount)}) is greater than the maximum bond amount (R${numberWithCommas(maxBondAmount)})`);
        }
        issue("Please insert an amount less than R" + numberWithCommas(maxBondAmount));
        return null;
    }

    let totalFees = 0;
    let closestLowerBound = -Infinity;
    let closestFees = null;

    for (const feeEntry of feesData.fees) {
        if (feeEntry.bond_amount_range.includes("-")) {
            const range = feeEntry.bond_amount_range.split("-");
            const lowerBound = parseFloat(range[0].replace(/,/g, ''));
            const upperBound = parseFloat(range[1].replace(/,/g, '')) || lowerBound;

            if (bondAmount >= lowerBound && bondAmount <= upperBound) {
                if (loggingEnabled) {
                    console.log(`Extracted fee: R${numberWithCommas(feeEntry.fee)}`);
                    console.log(`Extracted VAT: R${numberWithCommas(feeEntry.vat)}`);
                    console.log(`Extracted total: R${numberWithCommas(feeEntry.fee_plus_vat)}`);
                    console.log(`Extracted deeds office charge: R${numberWithCommas(feeEntry.deeds_office_charge)}`);
                    console.log(`Extracted transfer duty: R${numberWithCommas(feeEntry.transfer_duty)}`);
                }
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
    
    if (closestFees) {

            //Overwrite transfer_duties for zero rated transactions
        if(bondAmount < 1210000)
        {
            console.log("BondAmount less than threshold");
            closestFees.transfer_duty = 0;            
        }

        if (loggingEnabled) {
            console.log(`Closest matching fees:`);
            
            console.log(`- Fee: R${numberWithCommas(closestFees.fee)}`);
            console.log(`- VAT: R${numberWithCommas(closestFees.vat)}`);
            console.log(`- Total: R${numberWithCommas(closestFees.total)}`);
            console.log(`- Deeds office charge: R${numberWithCommas(closestFees.deeds_office_charge)}`);
            console.log(`- Transfer duty: R${numberWithCommas(closestFees.transfer_duty)}`);
        }
        return closestFees;
    }
    

    return null;
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
            return null;
        }
    });

    if (data.status === 200) {
        json = data.responseJSON;
        return json;
    }
    return null;
}
