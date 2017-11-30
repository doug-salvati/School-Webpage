// Douglas Salvati
// Douglas_Salvati@student.uml.edu
// Computer Science Department, UMass Lowell
// COMP.4610 GUI Programming 1
// File: /usr/cs/2018/dsalvati/public_html/comp4610/hw6/js/hw6.js
// Created: 11 November 2017
// Modified: 29 November 2017

// Description: This script uses jQuery to control what
// happens when certain buttons are clicked, managing the
// transition from raw data input, to calculation, to
// preparing the dynamic table.

price_options = {min: 1000, max: 100000, step: 1000, value: 5000}
mpg_options = {min: 1, max: 100, step: 1, value: 25}

// Field counter to give unique names
counter = 2;

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
    // Sliders
    $("#initial-price-slider").slider(price_options);
    $("#initial-price-slider").on("slide", function(e,u) {
        var value = u.value;
        $("input[name=initial-price]").val(value);
    });
    $("input[name=initial-price]").on("input", function(e) {
        var value = $(this).val();
        $("#initial-price-slider").slider("value", value);
    });
    $("#initial-mpg-slider").slider(mpg_options);
    $("#initial-mpg-slider").on("slide", function(e,u) {
        var value = u.value;
        $("input[name=initial-mpg]").val(value);
    });
    $("input[name=initial-mpg]").on("input", function(e) {
        var value = $(this).val();
        $("#initial-mpg-slider").slider("value", value);
    });

    // JQuery Input Validation Plugin
    $('#enter-data-form').validate({
        // Custom messages, I decided the defaults for number being negative
        // were what I wanted already
        messages: {
            mpy: { required: "We need to know how many miles you'll be driving.",
                   number: "Must be a number!" },
            cpg: { required: "The cost of gas is needed to determine your price per mile.",
                   number: "Must be a number!" },
            time: { required: "This is necessary to show you cost per month.",
                    number: "Must be a number!" }
        },
        // When you click on the field to start fixing, hide the error
        // so you can delete the field
        focusCleanup: true,
        // Classes assigned to the labels that get made
        errorClass: "invalid",
        validClass: "valid",
        // Have the error places with a fade-in animation
        errorPlacement: function(error, element) {
            $(error).hide().fadeIn('slow').insertAfter(element);
        }
    });
    $(".price").rules("add", { 
        messages: { required: "A table entry can't be blank!",
                    number: "Must be a number!" }
    });
    $(".mpg").rules("add", { 
        messages: { required: "A table entry can't be blank!",
                    number: "Must be a number!" }
    });

    // Add a price entry
    $('#add-price').click(function() {
        var elt = document.createElement("LI");
        var name = 'price-' + counter++
        elt.innerHTML = '$<input type="number" class="price" name="' + name + '" value="5000" min="1000" max="100000" required>';
        // Delete button
        var del = document.createElement("INPUT");
        del.type = "button";
        del.value = "X";
        // Onclick, deletes itself
        del.onclick = function() {this.parentElement.parentElement.removeChild(this.parentElement);};
        elt.appendChild(del);
        // Slider
        var slider = document.createElement("DIV");
        $(slider).attr("class", "slider");
        $(slider).slider(price_options);
        $(slider).on("slide", function(e,u) {
            var value = u.value;
            $("input[name=" + name + "]").val(value);
        });
        elt.appendChild(slider);
        // Initially invisible, then slide-in animation
        elt.style = "display: none";
        $(elt).appendTo('#price-list').slideDown('fast');
        // Dynamically add custom messages to new li's
        $(".price").each(function () {
            $(this).rules('add', {messages: {required: "A table entry can't be blank!",
                                             number: "Must be a number!"}});
        });
        // Second-way binding
        $("input[name=" + name + "]").on("input", function(e) {
            var value = $(this).val();
            $(slider).slider("value", value);
        });
    });

    // Add a mileage entry
    // Analagous to previous
    $('#add-mpg').click(function() {
        var elt = document.createElement("LI");
        var name = "mpg-" + counter++;
        elt.innerHTML = 'MPG <input type="number" class="mpg" name="' + name + '" value="25" min="1" max="100" required>';
        var del = document.createElement("INPUT");
        del.type = "button";
        del.value = "X";
        del.onclick = function() {this.parentElement.parentElement.removeChild(this.parentElement);};
        elt.appendChild(del);
        var slider = document.createElement("DIV");
        $(slider).attr("class", "slider");
        $(slider).slider(mpg_options);
        $(slider).on("slide", function(e,u) {
            var value = u.value;
            $("input[name=" + name + "]").val(value);
        });
        elt.appendChild(slider);
        elt.style = "display: none";
        $(elt).appendTo('#mpg-list').slideDown('fast');
        $(".mpg").each(function () {
            $(this).rules('add', {messages: {required: "A table entry can't be blank!",
                                             number: "Must be a number!"}});
        });
        $("input[name=" + name + "]").on("input", function(e) {
            var value = $(this).val();
            $(slider).slider("value", value);
        });
    });

    // Transition to table view, assuming values are correct
    $('#submit').click(function() {
        // Check validation
        if (!$('#enter-data-form').valid()) return;

        // Convert lists into arrays of values
        var prices = $(".price").map(function() {
            var ret = parseFloat(this.value);
            return ret;
        });
        var mileages = $(".mpg").map(function() {
            var ret = parseFloat(this.value);
            return ret;
        });
        var mpy = parseFloat($("#mpy").val());
        var cpg = parseFloat($("#cpg").val());
        var time = parseFloat($("#time").val());

        // Clear table
        $('#part-one-enter-data').fadeOut('fast', function() {$('#part-two-view-table').fadeIn('slow'); });
        $("#data-table").html("");

        // Table header
        var thead = document.createElement("TR");
        thead.appendChild(document.createElement("TD"));
        for (i = 0; i < prices.length; ++i) {
            var td = document.createElement("TD");
            td.innerHTML = "$" + prices[i] + " Car";
            thead.appendChild(td);
            $(thead).appendTo('#data-table');
        }

        // Table rows
        for (j = 0; j < mileages.length; ++j) {
            var tr = document.createElement("TR");
            var first = document.createElement("TD");
            first.innerHTML = mileages[j] + " mpg";
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
        $('#part-two-view-table').fadeOut('fast', function() {$('#part-one-enter-data').fadeIn('slow'); });
    });
});