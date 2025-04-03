// HTML table templates for calculation results
function generateTransferCostsTable(tranval, dof, tf, af, ps, pp, dgf, erf, fica, SCandFS, Transfee, ratesclearcert, etdf, payverlexis, accverfee, elecfacfee, vat, total) {
    return `
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
    <td>Account verification and payment fee</td>
    <td>R${numberWithCommas(accverfee)}</td>
    </tr>

    <tr>
    <td>Electronic Facilitation Fee</td>
    <td >R${numberWithCommas(elecfacfee)}</td>
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
    `;
}

function generateBondCostsTable(tranval, dof, af, ps, pp, dgf, eff, fica, dosearchfee, vat, total) {
    return `
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
    `;
}

function generateInstalmentsTable(principal, years, MonthlyP, principal, interestP, GrandTotal) {
    return `
    <div style="overflow-x:auto;" class="result">
      <div class="form-header bg-secondary text-white py-2 px-3 rounded">
        <h6 class="h6 m-0">Instalments Costs on R${numberWithCommas(principal)}</h6>
    </div>

    <hr/>
    <table class="table table-striped responsive-font-table">
    <tr>
    <td>Pay-off time</td>
    <td>${numberWithCommas(years)} Years</td>
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
    </div>
    `;
}
