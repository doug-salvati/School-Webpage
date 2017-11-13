// Douglas Salvati
// Douglas_Salvati@student.uml.edu
// Computer Science Department, UMass Lowell
// COMP.4610 GUI Programming 1
// File: /usr/cs/2018/dsalvati/public_html/comp4610/hw4/js/hw4.js
// Created: 11 November 2017
// Modified: 12 November 2017

// Description: This script uses jQuery to control what
// happens when certain buttons are clicked, managing the
// transition from raw data input, to calculation, to
// preparing the dynamic table.

// Calculate costs - utility functions
totalCost = function(price, mileage, mpy, cpg, time) {
    var gallons_needed_per_year = mpy / mileage;
    var cost_of_gas_per_year = gallons_needed_per_year * cpg;
    var total_gas_price = cost_of_gas_per_year * (time / 12);
    return total_gas_price + price;
}
costPerMile = function(price, mileage, mpy, cpg, time) {
    return (totalCost(price, mileage, mpy, cpg, time) / (mpy * time / 12)).toFixed(2);
}
costPerMonth = function(price, mileage, mpy, cpg, time) {
    return (totalCost(price, mileage, mpy, cpg, time) / time).toFixed(2);
}

// Event handlers load when page is ready
$(document).ready(function() {
    // Add a price entry
    $('#add-price').click(function() {
        var elt = document.createElement("LI");
        elt.innerHTML = 'Price: $<input type="number" class="price">';
        // Delete button
        var del = document.createElement("INPUT");
        del.type = "button";
        del.value = "Delete";
        // Onclick, deletes itself
        del.onclick = function() {this.parentElement.parentElement.removeChild(this.parentElement);};
        elt.appendChild(del);
        // Initially invisible, then slide-in animation
        elt.style = "display: none";
        $(elt).appendTo('#price-list').slideDown('fast');
    });

    // Add a mileage entry
    // Analagous to previous
    $('#add-mpg').click(function() {
        var elt = document.createElement("LI");
        elt.innerHTML = 'Miles per Gallon: <input type="number" class="mpg">';
        var del = document.createElement("INPUT");
        del.type = "button";
        del.value = "Delete";
        del.onclick = function() {this.parentElement.parentElement.removeChild(this.parentElement);};
        elt.appendChild(del);
        elt.style = "display: none";
        $(elt).appendTo('#mpg-list').slideDown('fast');
    });

    // Transition to table view, assuming values are correct
    $('#submit').click(function() {
        // Get vars, input validation...
        $('#error-msg').hide();
        var error = false;
        $(".error").removeClass("error");
        // Convert lists into arrays of values
        var prices = $(".price").map(function() {
            var ret = parseFloat(this.value);
            // Turn input red if invalid
            if (isNaN(ret) || (ret <= 0)) { $(this).addClass("error"); error = true; }
            return ret;
        });
        var mileages = $(".mpg").map(function() {
            var ret = parseFloat(this.value);
            if (isNaN(ret) || (ret <= 0)) { $(this).addClass("error"); error = true; }
            return ret;
        });
        var mpy = parseFloat($("#mpy").val());
        if (isNaN(mpy) || (mpy <= 0)) { $("#mpy").addClass("error"); error = true; }
        var cpg = parseFloat($("#cpg").val());
        if (isNaN(cpg) || (cpg <= 0)) { $("#cpg").addClass("error"); error = true; }
        var time = parseFloat($("#time").val());
        if (isNaN(time) || (time <= 0)) { $("#time").addClass("error"); error = true; }
        if (error) {
            $('#error-msg').show('fast');
            return;
        }

        // Clear table
        $('#part-one-enter-data').hide('fast');
        $('#part-two-view-table').show('fast');
        $("#data-table").html("");

        // Table header
        var thead = document.createElement("TR");
        thead.appendChild(document.createElement("TD"));
        for (i = 0; i < prices.length; ++i) {
            var td = document.createElement("TD");
            td.innerHTML = "$" + prices[i];
            thead.appendChild(td);
            $(thead).appendTo('#data-table');
        }

        // Table rows
        for (j = 0; j < mileages.length; ++j) {
            var tr = document.createElement("TR");
            var first = document.createElement("TD");
            first.innerHTML = mileages[j];
            tr.appendChild(first);
            for (i = 0; i < prices.length; ++i) {
                var td = document.createElement("TD");
                td.innerHTML = "$" + costPerMile(prices[i], mileages[j], mpy, cpg, time) + "/mi, $" + costPerMonth(prices[i], mileages[j], mpy, cpg, time) + "/mo";
                tr.appendChild(td);
                tr.style = "display: none";
                $(tr).appendTo('#data-table').show("fast");
            }
        }
    });

    // Return to previous view to edit values
    $('#edit').click(function() {
        $('#part-one-enter-data').show('fast');
        $('#part-two-view-table').hide('fast');
    });
});