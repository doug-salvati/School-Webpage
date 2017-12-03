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

// Global list of tabs
var tabs_list = {
    tabs: ["part-one-enter-data"],
    add_tab: function(id) {
        this.tabs.push(id);
    },
    is_open: function(id) {
        return this.tabs.indexOf(id);
    }
}

// Table renderer
render_table = function(param1c, param2c, tab_id) {
    // Convert lists into arrays of values
    var vals1 = $(param1c).map(function() {
        var ret = parseFloat(this.value);
        return ret;
    });
    var vals2 = $(param2c).map(function() {
        var ret = parseFloat(this.value);
        return ret;
    });
    var mpy = parseFloat($("#mpy").val());
    var cpg = parseFloat($("#cpg").val());
    var time = parseFloat($("#time").val());

    // Create Table
    var table = $("#" + tab_id + " > .data-table")
    table.html("");

    // Table header
    var thead = document.createElement("TR");
    thead.appendChild(document.createElement("TD"));
    for (i = 0; i < vals1.length; ++i) {
        var td = document.createElement("TD");
        td.innerHTML = "$" + vals1[i] + " Car";
        thead.appendChild(td);
        $(thead).appendTo(table);
    }

    // Table rows
    for (j = 0; j < vals2.length; ++j) {
        var tr = document.createElement("TR");
        var first = document.createElement("TD");
        first.innerHTML = vals2[j] + " mpg";
        tr.appendChild(first);
        for (i = 0; i < vals1.length; ++i) {
            var td = document.createElement("TD");
            td.innerHTML = "$" + costPerMile(vals1[i], vals2[j], mpy, cpg, time) + "/mi, $" + costPerMonth(vals1[i], vals2[j], mpy, cpg, time) + "/mo";
            tr.appendChild(td);
            $(tr).appendTo(table);
        }
    }
}


// Event handlers load when page is ready
$(document).ready(function() {
    // Tabs
    $("#tabs").tabs();

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

    // Create a new tab, assuming values are correct
    $('#submit').click(function() {
        // Check validation
        if (!$('#enter-data-form').valid()) return;

        // See what's being compared
        param1 = $("#param1").find(":selected").val();
        param2 = $("#param2").find(":selected").val();
        param1name = $("#param1").find(":selected").text();
        param2name = $("#param2").find(":selected").text();
        param1c = "." + param1;
        param2c = "." + param2;
        tab_id = param1 + "-v-" + param2;
        tab_name = param1name + " vs " + param2name;

        // If tab already exists, just switch to it
        if ((idx = tabs_list.is_open(tab_id)) >= 0) {
            $("#tabs").tabs( "option", "active", idx);
        }
        // Otherwise, create new tab
        else {
            $("#tabs").append("<div id='" + tab_id + "'><table class='data-table'></table></div>");
            $("<li><a href='#" + tab_id + "'>" + tab_name + "</a></li>").appendTo("#tabs .ui-tabs-nav");
            $("#tabs").tabs("refresh");
            $("#tabs").tabs( "option", "active", 1);
            tabs_list.add_tab(tab_id);
        }

        // Render contents of tab
        render_table(param1c, param2c, tab_id);
    });

    // Re-render a tab's contents on load in case
    // inputs have changed.
    $("#tabs").on("tabsactivate", function(event, ui) {
        var tab_id = ui.newPanel.attr("id");
        if (tab_id != "part-one-enter-data") {
            var split = tab_id.split("-");
            var param1c = "." + split[0];
            var param2c = "." + split[2];
            render_table(param1c, param2c, tab_id);
        }
    });

});