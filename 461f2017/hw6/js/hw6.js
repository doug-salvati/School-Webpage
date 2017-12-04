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

// Slider options
var price_options = {min: 1000, max: 100000, step: 1000, value: 5000};
var mpg_options = {min: 1, max: 100, step: 1, value: 25};
var ins_options = {min: 0, max: 10000, step: 500, value: 1000};
var park_options = {min: 0, max: 1000, step: 20, value: 100};

// Field counter to give unique names
var counter = 2;

// Global list of tabs
var tabs_list = {
    tabs: ["part-one-enter-data"],
    add_tab: function(id) {
        this.tabs.push(id);
        return this.tabs.length - 1;
    },
    remove_tab: function(id) {
        var idx = this.tabs.indexOf(id);
        if (idx < 0) {
            return false;
        } else {
            this.tabs.splice(idx, 1);
            return true;
        }
    },
    get_id: function(idx) {
        return this.tabs[idx];
    },
    is_open: function(id) {
        return this.tabs.indexOf(id);
    },
    get_length: function() {
        return this.tabs.length;
    },
    remove_range: function(r1, r2) {
        this.tabs.splice(Math.min(r1, r2), (Math.abs(r2 - r1) + 1));
    }
}

// Table renderer
render_table = function(param1c, param2c, tab_id) {
    // Convert lists into arrays of values
    var vals1 = $("input" + param1c).map(function() {
        var ret = parseFloat(this.value);
        return ret;
    });
    var vals2 = $("input" + param2c).map(function() {
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
    $(thead).append("<td><i>Horizontal axis represents " + param1c.substr(1).replace("_"," ") +
        "s.</i><br/><i>Vertical axis represents " + param2c.substr(1).replace("_"," ") +
        "s.<br>The crossing represents the their combined costs.</i></td>");
    for (i = 0; i < vals1.length; ++i) {
        var td = document.createElement("TD");
        td.innerHTML = vals1[i];
        thead.appendChild(td);
        $(thead).appendTo(table);
    }

    // Table rows
    for (j = 0; j < vals2.length; ++j) {
        var tr = document.createElement("TR");
        var first = document.createElement("TD");
        first.innerHTML = vals2[j];
        tr.appendChild(first);
        for (i = 0; i < vals1.length; ++i) {
            var td = document.createElement("TD");
            // Monthly cost of first param
            var monthly_cost1 = 0;
            if (param1c == ".insurance_cost") { monthly_cost1 = (vals1[i] / 12) }
            else if (param1c == '.parking_cost') { monthly_cost1 = vals1[i] }
            else if (param1c == '.price') { monthly_cost1 = (vals1[i] / time) }
            else /* param1c == '.mpg' */ { monthly_cost1 = ((mpy / vals1[i] * cpg) / 12) } 
            // Monthly cost of second param
            var monthly_cost2 = 0;
            if (param2c == ".insurance_cost") { monthly_cost2 = (vals2[j] / 12) }
            else if (param2c == '.parking_cost') { monthly_cost2 = vals2[j] }
            else if (param2c == '.price') { monthly_cost2 = (vals2[j] / time) }
            else /* param2c == '.mpg' */ { monthly_cost2 = ((mpy / vals2[j] * cpg) / 12) } 
            // Total costs
            var monthly_cost = (monthly_cost1 + monthly_cost2).toFixed(2);
            var permile_cost = (monthly_cost / (mpy / 12)).toFixed(2);

            td.innerHTML = "$" + permile_cost + "/mi, $" + monthly_cost + "/mo";
            tr.appendChild(td);
            $(tr).appendTo(table);
        }
    }
}

// Event handlers load when page is ready
$(document).ready(function() {
    // Tabs
    $("#tabs").tabs();
    $("#close-tabs").dialog({autoOpen: false, modal: true, title: "Tab Management", buttons: [
        {text: "Cancel", click: function() {
            $(this).dialog("close");
        }},
        {text: "Delete", click: function() {
            var lo = $("#lower").find(":selected").val() - 1;
            var hi = $("#upper").find(":selected").val() - 1;
            for (i = Math.min(lo, hi); i <= Math.max(lo, hi); ++i) {
                $("a[href='" + "#" + tabs_list.get_id(i) + "']").parent().remove();
                $("#" + tabs_list.get_id(i)).remove();
            }
            tabs_list.remove_range(lo, hi);
            $("#tabs").tabs("refresh");
            $("#close-tabs").dialog("close");
        }}]});
    $("#open-dialog").click(function() {
        if (tabs_list.get_length() <= 1) {
            alert("No tabs to delete :)");
            return;
        }
        $("#lower").html("");
        $("#upper").html("");
        for (i = 2; i <= tabs_list.get_length(); i++){
            $("#lower").append($('<option></option>').val(i).html(i))
            $("#upper").append($('<option></option>').val(i).html(i))
        }
        $("#close-tabs").dialog("open");
    });

    // Sliders
    setup_slider = function(slider, options, input) {
        $(slider).slider(options);
        $(slider).on("slide", function(e,u) {
            var value = u.value;
            $(input).val(value);
        });
        $(input).on("input", function(e) {
            var value = $(this).val();
            $(slider).slider("value", value);
        });
    }
    setup_slider("#initial-price-slider", price_options, "input[name=initial-price]");
    setup_slider("#initial-mpg-slider", mpg_options, "input[name=initial-mpg]");
    setup_slider("#initial-ins-slider", ins_options, "input[name=initial-ins]");
    setup_slider("#initial-park-slider", park_options, "input[name=initial-park]");

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

    // Add entries to input lists
    add_entry = function(classname, input, options, listid, name)  {
        var elt = document.createElement("LI");
        elt.innerHTML = input;
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
        $(slider).slider(options);
        $(slider).on("slide", function(e,u) {
            var value = u.value;
            $("input[name=" + name + "]").val(value);
        });
        elt.appendChild(slider);
        // Initially invisible, then slide-in animation
        elt.style = "display: none";
        $(elt).appendTo(listid).slideDown('fast');
        // Dynamically add custom messages to new li's
        $("." + classname).each(function () {
            $(this).rules('add', {messages: {required: "A table entry can't be blank!",
                                             number: "Must be a number!"}});
        });
        // Second-way binding
        $("input[name=" + name + "]").on("input", function(e) {
            var value = $(this).val();
            $(slider).slider("value", value);
        });
    }

    // Add a price entry
    $('#add-price').click(function() {
        var name = "price-" + counter++;
        add_entry('price',
            '$<input type="number" class="price" name="' + name + '" value="5000" min="1000" max="100000" required>',
            price_options, '#price-list', name);
    });
    // Add a mileage entry
    $('#add-mpg').click(function() {
        var name = "mpg-" + counter++;
        add_entry('mpg',
            'MPG <input type="number" class="mpg" name="' + name + '" value="25" min="1" max="100" required>',
            mpg_options, '#mpg-list', name);
    });
    // Add an insurance entry
    $('#add-ins').click(function() {
        var name = "ins-" + counter++;
        add_entry('ins',
            'yearly $<input type="number" class="insurance_cost" name="' + name + '" value="1000" min="1" max="10000" required>',
            ins_options, '#ins-list', name);
    });
    // Add a parking entry
    $('#add-park').click(function() {
        var name = "park-" + counter++;
        add_entry('park',
            'monthly $<input type="number" class="parking_cost" name="' + name + '" value="100" min="1" max="1000" required>',
            park_options, '#park-list', name);
    });

    // Get a table, assuming values are correct
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

        // Can't compare the same thing
        if (param1 == param2) {
            alert("You need to compare two different parameters.");
            return;
        }

        // If tab already exists, just switch to it
        if ((idx = tabs_list.is_open(tab_id)) >= 0) {
            $("#tabs").tabs( "option", "active", idx);
        }
        // Otherwise, create new tab
        else {
            $("#tabs").append("<div id='" + tab_id + "'><table class='data-table'></table></div>");
            $("<li><a href='#" + tab_id + "'>" + tab_name + "</a><span class='ui-icon ui-icon-circle-close ui-closable-tab'></span></li>").appendTo("#tabs .ui-tabs-nav");
            // Learned how to close a tab from http://jsfiddle.net/muVDN/, but I heavily customized the code
            $(".ui-closable-tab").click(function(event, ui) {
                var panel = $(this).closest("li").remove().attr("aria-controls");
                $("#" + panel).remove();
                tabs_list.remove_tab(panel);
                $("#tabs").tabs("refresh");
            });
            $("#tabs").tabs("refresh");
            var new_idx = tabs_list.add_tab(tab_id);
            $("#tabs").tabs( "option", "active", new_idx);
        }
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