#   Douglas Salvati
#   Douglas_Salvati@student.uml.edu
#   Computer Science Department, UMass Lowell
#   COMP.4610 GUI Programming 1
#   File: /usr/cs/2018/dsalvati/public_html/comp4610/final/js/final.coffee
#   Created: 9 December 2017
#   Modified: 9 December 2017
#
#   Description: This script manages the CSS Code generator by
#   storing the code in an object, manipulating it on button presses,
#   and generating the CSS.

class Style
    constructor: () ->
        @gradient_type = "left-right"
        @gradient = []
    
    resetGradient: () ->
        @gradient = []

    addGradientStop: (color, pct) ->
        new_stop = [color, pct]
        @gradient.push(new_stop)
        @gradient.sort (a, b) ->
            if a[1] < b[1]
                return -1
            if a[1] > b[1]
                return 1
            return 0

    generateCSS: () ->
        # INITIALIZE
        css = ""
        # SIZE
        css += "height: 300px; "
        css += "width: 300px; "
        # GRADIENT
        if @gradient.length > 0
            # Direction
            switch @gradient_type
                when "left-right"
                    grad_type_safari = "left"
                    grad_type_opera = "right"
                    grad_type_firefox = "right"
                    grad_type_std = "to right"
                when "right-left"
                    grad_type_safari = "right"
                    grad_type_opera = "left"
                    grad_type_firefox = "left"
                    grad_type_std = "to left"
                when "top-bottom"
                    grad_type_safari = "top"
                    grad_type_opera = "bottom"
                    grad_type_firefox = "bottom"
                    grad_type_std = "to bottom"
                when "bottom-top"
                    grad_type_safari = "bottom"
                    grad_type_opera = "top"
                    grad_type_firefox = "top"
                    grad_type_std = "to top"
            # Color list
            grad_color_list = ""
            grad_color_list += ", " + stop[0] + " " + stop[1] + "%" for stop in @gradient

            # Code
            if @gradient_type is "radial"
                css += "background: " + @gradient[0][0] + "; " # No gradient support
                css += "background: -webkit-radial-gradient(circle" + grad_color_list + "); " # Safari
                css += "background: -o-radial-gradient(circle" + grad_color_list + "); " # Opera
                css += "background: -moz-radial-gradient(circle" + grad_color_list + "); " # Firefox
                css += "background: radial-gradient(circle" + grad_color_list + "); " # Standard
            else
                css += "background: " + @gradient[0][0] + "; " # No gradient support
                css += "background: -webkit-linear-gradient(" + grad_type_safari + grad_color_list + "); " # Safari
                css += "background: -o-linear-gradient(" + grad_type_opera + grad_color_list + "); " # Opera
                css += "background: -moz-linear-gradient(" + grad_type_firefox + grad_color_list + "); " # Firefox
                css += "background: linear-gradient(" + grad_type_std + grad_color_list + "); " # Standard
        else
            css += "background: white; "

        console.log css.replace(/; /g,";\n")
        return css

    readableCSS: () ->
        @generateCSS().replace(/; /g,";\n")

$(document).ready () ->
    # Global CSS object
    styling = new Style()

    # GRADIENT
    # Color picker
    picker = new CP(document.getElementById("grad-color-droplet"), false)
    picker.on "change", (color) ->
        $(this.target).css("background-color", '#' + color)
    # Customize color picker, based on example from the distro
    picker.picker.classList.add('static');
    picker.enter(document.getElementById("grad-colorpicker"));

    # Color dropper
    $('#grad-color-droplet').draggable({revert: "invalid", revertDuration: 200, scroll: false,
    helper: "clone", cursorAt: { top: 25, left: 25 } })
    $('#target-div').droppable({accept: ".droplet-and-clone", drop: (event, ui) ->
        # Percentage depends on direction of gradient
        switch styling.gradient_type
            when "left-right", "right-left"
                left = ui.position.left - $('#target-div').position().left + $('#grad-color-droplet').width() / 2
                pct = Math.floor(left / $('#target-div').width() * 100)
                if styling.gradient_type is "right-left"
                    pct = 100 - pct
            when "top-bottom", "bottom-top"
                top = ui.position.top - $('#target-div').position().top + $('#grad-color-droplet').height() / 2
                pct = Math.floor(top / $('#target-div').height() * 100)
                if styling.gradient_type is "bottom-top"
                    pct = 100 - pct
            when "radial"
                x = ui.position.left - $('#target-div').position().left + $('#grad-color-droplet').width() / 2
                y = top = ui.position.top - $('#target-div').position().top + $('#grad-color-droplet').height() / 2
                ctr_x = $('#target-div').width() / 2
                ctr_y = $('#target-div').height() / 2
                cnr_x = ctr_x * 2
                cnr_y = ctr_y * 2
                # Max distance (center to corner)
                dist_max = Math.sqrt(Math.pow(cnr_x - ctr_x, 2) + Math.pow(cnr_y - ctr_y, 2))
                # Actual distance from center
                dist = Math.sqrt(Math.pow(x - ctr_x, 2) + Math.pow(y - ctr_y, 2))
                pct = Math.floor(dist / dist_max * 100)
                
        # Add the CSS
        styling.addGradientStop($("#grad-color-droplet").css('backgroundColor'), pct)
        $('#target-div').attr("style", styling.generateCSS())
    })

    # Direction
    $("input[name=grad-direction]").change () ->
        styling.gradient_type = $("input[name=grad-direction]:checked").val()
        $('#target-div').attr("style", styling.generateCSS())

    # Reset
    $('#grad-reset').click () ->
        styling.resetGradient()
        $('#target-div').attr("style", styling.generateCSS())
