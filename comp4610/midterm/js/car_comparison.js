
// Class for an option involving car ownership
class Ownership {
    constructor(name, dealer, msrp, disc, rebate, down, months, interest) {
        this.name = name;
        this.dealer = dealer;
        this.msrp = msrp;
        this.disc = disc;
        this.rebate = rebate;
        this.down = down / 100;
        this.months = months;
        this.interest = interest;
    }
    monthlyPayment() {
        var initial_cost = this.msrp - this.disc - this.rebate;
        var principal = initial_cost - this.down * initial_cost;
        var monthly_interest = this.interest / 100 / 12;
        var monthly_payment = (monthly_interest * principal) / (1 - Math.pow(1 + monthly_interest, - this.months));
        return monthly_payment;
    }
    totalPayment() {
        return (this.monthlyPayment() * this.months);
    }
    perMilePayment(miles_per_year) {
        return (this.totalPayment / miles_per_year);
    }
};

// Class for an option involving leasing a car
class Lease {
    constructor(name, dealer, monthly_pmt, miles, extra, ccr, period) {
        this.name = name;
        this.dealer = dealer;
        this.monthly_pmt = monthly_pmt;
        this.miles = miles;
        this.extra = extra;
        this.ccr = ccr / 100;
        this.period = period;
    }
    monthlyPayment(miles_per_year) {
        return 0;
    }
    totalPayment(miles_per_year) {
        return (this.monthlyPayment(miles_per_year) * this.period);
    }
    perMilePayment(miles_per_year) {
        return (this.totalPayment(miles_per_year) / miles_per_year);
    }
};

window.onload = function() {
    var listofcars = [];

    // Detect "Add a Car" Button Clicked
    document.getElementById("add_a_car").onclick = function() {
        document.getElementById("add_a_car_form").style.display = "block";
    }

    // Detect selection of Lease/Ownership
    document.getElementById("radio_own").onclick = function() {
        document.getElementById("ownership").style.display = "block";
        document.getElementById("lease").style.display = "none";
    }
    document.getElementById("radio_lease").onclick = function() {
        document.getElementById("lease").style.display = "block";
        document.getElementById("ownership").style.display = "none";
    }

    // Detect "Cancel" Button Clicked
    document.getElementById("cancel").onclick = function() {
        document.getElementById("add_a_car_form").style.display = "none";
    }

    // Detect "Save" Button Clicked
    document.getElementById("save").onclick = function() {
        if (document.getElementById("radio_own").checked) {
            var name = document.getElementsByName("model")[0].value;
            var dealer = document.getElementsByName("dealer")[0].value;
            var msrp = document.getElementsByName("msrp")[0].value;
            var disc = document.getElementsByName("disc")[0].value;
            var rebate = document.getElementsByName("rebate")[0].value;
            var down = document.getElementsByName("down")[0].value;
            var months = document.getElementsByName("months")[0].value;
            var interest = document.getElementsByName("interest")[0].value;
            
            var option = new Ownership(name, dealer, msrp, disc, rebate, down, months, interest);
            listofcars.push(option);
            
            var card = document.createElement("LI");
            var name_elt = document.createElement("H2");
            name_elt.appendChild(document.createTextNode("Ownership: " + name));
            var dealer_elt = document.createElement("P");
            dealer_elt.appendChild(document.createTextNode("Dealer: " + dealer));
            var total_elt = document.createElement("P");
            total_elt.appendChild(document.createTextNode("Total Cost: $" + option.totalPayment().toFixed(2)));
            var monthly_elt = document.createElement("P");
            monthly_elt.appendChild(document.createTextNode("Monthly Cost: $" + option.monthlyPayment().toFixed(2)));
            card.appendChild(name_elt);
            card.appendChild(dealer_elt);
            card.appendChild(total_elt);
            card.appendChild(monthly_elt);
            document.getElementById("carlist").appendChild(card);
        } else {
            var name = document.getElementsByName("model")[0].value;
            var dealer = document.getElementsByName("dealer")[0].value;
            var monthly_pmt = document.getElementsByName("monthly_pmt")[0].value;
            var miles = document.getElementsByName("miles")[0].value;
            var extra = document.getElementsByName("extra")[0].value;
            var ccr = document.getElementsByName("ccr")[0].value;
            var period = document.getElementsByName("period")[0].value;
            
            var option = new Lease(name, dealer, monthly_pmt, miles, extra, ccr, period);
            listofcars.push(option);

            var card = document.createElement("LI");
            var name_elt = document.createElement("H2");
            name_elt.appendChild(document.createTextNode(period + "-Month Lease: " + name));
            var dealer_elt = document.createElement("P");
            dealer_elt.appendChild(document.createTextNode("Dealer: " + dealer));
            var total_elt = document.createElement("P");
            total_elt.appendChild(document.createTextNode("Total Cost: $" + option.totalPayment().toFixed(2)));
            var monthly_elt = document.createElement("P");
            monthly_elt.appendChild(document.createTextNode("Monthly Cost: $" + option.monthlyPayment().toFixed(2)));
            card.appendChild(name_elt);
            card.appendChild(dealer_elt);
            card.appendChild(total_elt);
            card.appendChild(monthly_elt);
            document.getElementById("carlist").appendChild(card);
        }
        document.getElementById("add_a_car_form").style.display = "none";
    };
};

// TO DO:
// Complete calculations for lease
// Event handlers for sort and changed mileage
// Editing of Entries
// Style