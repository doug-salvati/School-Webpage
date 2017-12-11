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
    constructor: (selector) ->
        @selector = selector
        @gradient_type = "left-right"
        @gradient = []
        @transition_speed = 0
    
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

    generateCSS: (no_trans = false) ->
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

        # TRANSITIONS
        unless (@transition_speed is 0) or no_trans
            css += "-webkit-transition: all " + @transition_speed + "s; " # Safari
            css += "transition: all " + @transition_speed + "s; " # Standard

        return css

    readableCSS: (no_trans = false) ->
        readable = "\t" + @generateCSS(no_trans).replace(/; /g,";\n\t")
        readable.substr(0, readable.length - 1)

    completeCSS: (selector = "", no_trans = false) ->
        if selector.length > 0
            selector + " {\n" + @readableCSS(no_trans) + "}"
        else
            @selector + " {\n" + @readableCSS(no_trans) + "}"

$(document).ready () ->
    # Global CSS objects
    def = new Style("#target-div")
    hover = new Style("#target-div:hover")
    active = new Style("#target-div:active")
    styling = def
    preview_mode = false

    applyStyles = () -> 
        if preview_mode
            $('#target-div').text("TRANSITION PREVIEW")
            css = def.completeCSS() + '\n' + hover.completeCSS() + '\n' + active.completeCSS()
            $('#dynamic_stylesheet').html(css)
        else
            $('#target-div').text("")
            $("#dynamic_stylesheet").html(styling.completeCSS("#target-div", true))

    # GRADIENT ############################################################################
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
                left = ui.offset.left - $('#target-div').offset().left + $('#grad-color-droplet').width() / 2
                pct = Math.floor(left / $('#target-div').width() * 100)
                if styling.gradient_type is "right-left"
                    pct = 100 - pct
            when "top-bottom", "bottom-top"
                console.log ui.position.top
                console.log ui.offset.top
                console.log $('#target-div').offset().top
                console.log $('#grad-color-droplet').height() / 2
                console.log $('#target-div').height()
                top = ui.offset.top - $('#target-div').offset().top + $('#grad-color-droplet').height() / 2
                pct = Math.floor(top / $('#target-div').height() * 100)
                if styling.gradient_type is "bottom-top"
                    pct = 100 - pct
            when "radial"
                x = ui.offset.left - $('#target-div').offset().left + $('#grad-color-droplet').width() / 2
                y = top = ui.offset.top - $('#target-div').position().top + $('#grad-color-droplet').height() / 2
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
        applyStyles()
    })

    # Direction
    $("input[name=grad-direction]").change () ->
        styling.gradient_type = $("input[name=grad-direction]:checked").val()
        applyStyles()

    # Reset
    $('#grad-reset').click () ->
        styling.resetGradient()
        applyStyles()

    # TRANSITION ############################################################################
    # Which state editing?
    $("input[name=transi-state]").change () ->
        currently_editing = $("input[name=transi-state]:checked").val()
        switch currently_editing
            when "default" then styling = def
            when "hover" then styling = hover
            when "click" then styling = active
        $("#" + styling.gradient_type).prop('checked', true)
        applyStyles()
    # View a preview of state effects
    $("input[name=transi-preview]").change () ->
        preview_mode = !preview_mode
        if preview_mode
            $("#lbl-preview-mode").html('<i class="fa fa-toggle-on fa-3x" aria-hidden="true"></i>')
        else
            $("#lbl-preview-mode").html('<i class="fa fa-toggle-off fa-3x" aria-hidden="true"></i>')
        applyStyles()
    # Choosing duration
    $("select#transi-duration").on "change", () ->
        def.transition_speed = parseFloat(this.value)
        applyStyles()

    # Tabs
    $("#toolbar").tabs({active: 0});
    $("#generated-css").dialog {autoOpen: false, modal: true, width: "80%", title: "Copy & Paste CSS for Your Project", \
        buttons: [{text: "Done!", click: () -> $(this).dialog("close")}]}
    $("#generate-css").click () ->
        css = def.completeCSS() + "\n\n"
        css += hover.completeCSS() + "\n\n"
        css += active.completeCSS()
        $("#generated-css").text(css)
        $("#generated-css").dialog "open"
