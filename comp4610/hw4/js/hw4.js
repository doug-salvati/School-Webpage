totalCost = function(price, mileage, mpy, cpg, time) {
    var gallons_needed_per_year = mpy / mileage;
    var cost_of_gas_per_year = gallons_needed_per_year * cpg;
    var total_gas_price = cost_of_gas_per_year * (time / 12);
    return total_gas_price + price;
}

costPerMile = function(price, mileage, mpy, cpg, time) {
    console.log(totalCost(price, mileage, mpy, cpg, time));
    console.log((mpy * time / 12));
    return (totalCost(price, mileage, mpy, cpg, time) / (mpy * time / 12)).toFixed(2);
}

costPerMonth = function(price, mileage, mpy, cpg, time) {
    return (totalCost(price, mileage, mpy, cpg, time) / time).toFixed(2);
}

$(document).ready(function() {
    $('#add-price').click(function() {
        var elt = document.createElement("LI");
        elt.innerHTML = 'Price: $<input type="number" class="price">';
        var del = document.createElement("INPUT");
        del.type = "button";
        del.value = "Delete";
        del.onclick = function() {this.parentElement.parentElement.removeChild(this.parentElement);};
        elt.appendChild(del);
        $('#price-list').append(elt);
    });

    $('#add-mpg').click(function() {
        var elt = document.createElement("LI");
        elt.innerHTML = 'Miles per Gallon: <input type="number" class="mpg">';
        var del = document.createElement("INPUT");
        del.type = "button";
        del.value = "Delete";
        del.onclick = function() {this.parentElement.parentElement.removeChild(this.parentElement);};
        elt.appendChild(del);
        $('#mpg-list').append(elt);
    });

    $('#submit').click(function() {
        $('#part-one-enter-data').hide();
        $('#part-two-view-table').show();
        var prices = $(".price").map(function() {return parseFloat(this.value)});
        var mileages = $(".mpg").map(function() {return parseFloat(this.value)});
        var mpy = parseFloat($("#mpy").val());
        var cpg = parseFloat($("#cpg").val());
        var time = parseFloat($("#time").val());

        // Clear table
        $("#data-table").html("");

        // Table header
        var thead = document.createElement("TR");
        thead.appendChild(document.createElement("TD"));
        for (i = 0; i < prices.length; ++i) {
            var td = document.createElement("TD");
            td.innerHTML = "$" + prices[i];
            thead.appendChild(td);
        }
        $('#data-table').append(thead)

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
                $('#data-table').append(tr)
            }
        }
    });

    $('#edit').click(function() {
        $('#part-one-enter-data').show();
        $('#part-two-view-table').hide();
    });
});