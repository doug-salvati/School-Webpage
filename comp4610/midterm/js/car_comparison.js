// Class for an option involving car ownership
class Ownership {
    constructor(name, dealer, msrp, disc, rebate, down, months, interest) {
        this.name = name;
        this.dealer = dealer;
        this.msrp = msrp;
        this.disc = disc;
        this.rebate = rebate;
        this.down = down;
        this.months = months;
        this.interest = interest;
    }
    monthlyPayment() {
        var initial_cost = this.msrp - this.disc - this.rebate;
        var principal = initial_cost - this.down;
        var monthly_interest = this.interest / 100 / 12;
        var monthly_payment = (monthly_interest * principal) / (1 - Math.pow(1 + monthly_interest, - this.months));
        return monthly_payment;
    }
    totalPayment() {
        return (this.monthlyPayment() * this.months) + this.down;
    }
    perMilePayment(miles_per_year) {
        return (this.totalPayment() / (miles_per_year * (this.months / 12)));
    }
    getCard(miles_per_year) {
        var card = document.createElement("LI");
        var name_elt = document.createElement("H2");
        name_elt.appendChild(document.createTextNode("Ownership: " + this.name));
        var dealer_elt = document.createElement("P");
        dealer_elt.appendChild(document.createTextNode("Dealer: " + this.dealer));
        var total_elt = document.createElement("P");
        total_elt.appendChild(document.createTextNode("Total Cost: $" + this.totalPayment().toFixed(2)));
        var down_elt = document.createElement("P");
        down_elt.appendChild(document.createTextNode("You pay a down payment of $" + this.down + " plus..."));
        var monthly_elt = document.createElement("P");
        monthly_elt.appendChild(document.createTextNode("Monthly Cost: $" + this.monthlyPayment().toFixed(2) + " for " + this.months + " months"));
        var permile_elt = document.createElement("P");
        permile_elt.appendChild(document.createTextNode("Cost per Mile: $" + this.perMilePayment(miles_per_year).toFixed(2)));
        card.appendChild(name_elt);
        card.appendChild(dealer_elt);
        card.appendChild(total_elt);
        card.appendChild(down_elt);
        card.appendChild(monthly_elt);
        card.appendChild(permile_elt);
        return card;
    }
};

// Class for an option involving leasing a car
class Lease {
    constructor(name, dealer, monthly_pmt, miles_included, extra, ccr, period) {
        this.name = name;
        this.dealer = dealer;
        this.monthly_pmt = monthly_pmt;
        this.miles_included = miles_included;
        this.extra = extra;
        this.ccr = ccr;
        this.period = period;
    }
    monthlyPayment(miles_per_year) {
        var whole_years = Math.floor(this.period / 12);
        var remaining = (this.period / 12) - whole_years;
        var extra_charge = 0;
        var extra_mileage = miles_per_year - this.miles_included;
        if (extra_mileage > 0) {
            extra_charge += this.extra * extra_mileage * whole_years;
        }
        // Potentially, there is a portion of another year
        extra_mileage = (miles_per_year * remaining) - this.miles_included;
        if (extra_mileage > 0) {
            extra_charge += this.extra * extra_mileage;
        }
        return this.monthly_pmt + (extra_charge / this.period);
    }
    totalPayment(miles_per_year) {
        return (this.monthlyPayment(miles_per_year) * this.period) + this.ccr;
    }
    perMilePayment(miles_per_year) {
        return (this.totalPayment(miles_per_year) / (miles_per_year * (this.period / 12)));
    }
    getCard(miles_per_year) {
        var card = document.createElement("LI");
        var name_elt = document.createElement("H2");
        name_elt.appendChild(document.createTextNode(this.period + "-Month Lease: " + this.name));
        var dealer_elt = document.createElement("P");
        dealer_elt.appendChild(document.createTextNode("Dealer: " + this.dealer));
        var total_elt = document.createElement("P");
        total_elt.appendChild(document.createTextNode("Total Cost: $" + this.totalPayment(miles_per_year).toFixed(2)));
        var ccr_elt = document.createElement("P");
        ccr_elt.appendChild(document.createTextNode("You pay a capital cost reduction of $" + this.ccr + " plus..."));
        var monthly_elt = document.createElement("P");
        monthly_elt.appendChild(document.createTextNode("Monthly Cost: $" + this.monthlyPayment(miles_per_year).toFixed(2) + " for " + this.period + " months"));
        var permile_elt = document.createElement("P");
        permile_elt.appendChild(document.createTextNode("Cost per Mile: $" + this.perMilePayment(miles_per_year).toFixed(2)));            
        card.appendChild(name_elt);
        card.appendChild(dealer_elt);
        card.appendChild(total_elt);
        card.appendChild(ccr_elt);
        card.appendChild(monthly_elt);
        card.appendChild(permile_elt);
        return card;
    }
};

// List of cars - need to preserve objects for sorting!
var listofcars = {
    list: [],
    add: function(elt) {
        this.list.push(elt);
    },
    // Replaces li's in a list with the newest values
    // Learned about this technique from https://stackoverflow.com/questions/8837191/sort-an-html-list-with-javascript
    draw_cards: function(replace, miles_per_year) {
        var cards = replace.cloneNode(false);
        for (var i = 0; i < this.list.length; ++i) {
            cards.appendChild(this.list[i].getCard(miles_per_year));
        }
        replace.parentNode.replaceChild(cards, replace);
    },
    sort_by: function(key, miles_per_year) {
        if (key == 'price') {
            var comparison = function(x, y) {
                x_price = (x instanceof Lease) ? x.monthlyPayment(miles_per_year) : x.monthlyPayment();
                y_price = (y instanceof Lease) ? y.monthlyPayment(miles_per_year) : y.monthlyPayment();
                if (x_price < y_price) return -1;
                if (x_price > y_price) return 1;
                return 0;
            };
        } else {
            var comparison = function(x, y) {
                if (x.name < y.name) return -1;
                if (x.name > y.name) return 1;
                return 0;
            };
        }
        this.list = this.list.sort(comparison);
    }
};

// Event Handlers
window.onload = function() {

    // Detect "Add a Car" Button Clicked
    document.getElementById("add_a_car").onclick = function() {
        document.getElementById("add_a_car_form").style.display = "block";
    };

    // Detect selection of Lease/Ownership
    document.getElementById("radio_own").onclick = function() {
        document.getElementById("ownership").style.display = "block";
        document.getElementById("lease").style.display = "none";
    };
    document.getElementById("radio_lease").onclick = function() {
        document.getElementById("lease").style.display = "block";
        document.getElementById("ownership").style.display = "none";
    };

    // Detect "Cancel" Button Clicked
    document.getElementById("cancel").onclick = function() {
        document.getElementById("add_a_car_form").style.display = "none";
    };

    // Detect "Save" Button Clicked
    document.getElementById("save").onclick = function() {
        if (document.getElementById("radio_own").checked) {
            var name = document.getElementsByName("model")[0].value;
            var dealer = document.getElementsByName("dealer")[0].value;
            var msrp = Number(document.getElementsByName("msrp")[0].value);
            var disc = Number(document.getElementsByName("disc")[0].value);
            var rebate = Number(document.getElementsByName("rebate")[0].value);
            var down = Number(document.getElementsByName("down")[0].value);
            var months = Number(document.getElementsByName("months")[0].value);
            var interest = Number(document.getElementsByName("interest")[0].value);
            var miles_per_year = Number(document.getElementsByName("miles_per_year")[0].value);
            var option = new Ownership(name, dealer, msrp, disc, rebate, down, months, interest);
        } else {
            var name = document.getElementsByName("model")[0].value;
            var dealer = document.getElementsByName("dealer")[0].value;
            var monthly_pmt = Number(document.getElementsByName("monthly_pmt")[0].value);
            var miles = Number(document.getElementsByName("miles")[0].value);
            var extra = Number(document.getElementsByName("extra")[0].value);
            var ccr = Number(document.getElementsByName("ccr")[0].value);
            var period = Number(document.getElementsByName("period")[0].value);
            var option = new Lease(name, dealer, monthly_pmt, miles, extra, ccr, period);
        }
        listofcars.add(option);
        var miles_per_year = Number(document.getElementsByName("miles_per_year")[0].value);
        if (document.getElementById("radio_price").checked) listofcars.sort_by('price', miles_per_year);
        else listofcars.sort_by('name', miles_per_year);
        listofcars.draw_cards(document.getElementById("carlist"), miles_per_year)
        document.getElementById("add_a_car_form").style.display = "none";
    };

    // Detect sorting change
    document.getElementById("radio_price").onclick = function() {
        var miles_per_year = Number(document.getElementsByName("miles_per_year")[0].value);
        listofcars.sort_by('price', miles_per_year);
        listofcars.draw_cards(document.getElementById("carlist"), miles_per_year);
    };
    document.getElementById("radio_name").onclick = function() {
        var miles_per_year = Number(document.getElementsByName("miles_per_year")[0].value);
        listofcars.sort_by('name', miles_per_year);
        listofcars.draw_cards(document.getElementById("carlist"), miles_per_year);
    };

    // Detect changed miles per year
    document.getElementById("miles_per_year").onchange = function() {
        var miles_per_year = Number(document.getElementsByName("miles_per_year")[0].value);
        if (document.getElementById("radio_price").checked) listofcars.sort_by('price', miles_per_year);
        else listofcars.sort_by('name', miles_per_year);
        listofcars.draw_cards(document.getElementById("carlist"), miles_per_year);
    }
};