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
        @transformation_skew = 0
        @transformation_angle = 0
        @shadows_on = false
        @shadow_darkness = 0
        @shadow_blur = 50
        @shadow_offset_x = 10
        @shadow_offset_y = 10
    
    resetAll: () ->
        @gradient_type = "left-right"
        @gradient = []
        @transition_speed = 0
        @transformation_skew = 0

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

    generateCSS: (no_x = "") ->
        # INITIALIZE
        css = ""
        no_transi = no_x is "no-transi"
        no_transf = no_x is "no-transf"
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

        # TRANSFORMATIONS
        # Skew
        unless no_transf
            css += "-ms-transform: skewX(" + @transformation_skew + "deg)" + "rotate(" + @transformation_angle.toFixed(0) + "deg); " # IE
            css += "-webkit-transform: skewX(" + @transformation_skew + "deg)" + "rotate(" + @transformation_angle.toFixed(0) + "deg); " # Safari
            css += "transform: skewX(" + @transformation_skew + "deg)" + "rotate(" + @transformation_angle.toFixed(0) + "deg); " # Standard

        # SHADOWS
        if @shadows_on            
            css += "box-shadow: " + @shadow_offset_x + "px " + @shadow_offset_y + "px " + @shadow_blur + "px " +
                "rgb(" + @shadow_darkness + "," + @shadow_darkness + "," + @shadow_darkness + "); "

        # TRANSITIONS
        unless (@transition_speed is 0) or no_transi
            css += "-webkit-transition: all " + @transition_speed + "s; " # Safari
            css += "transition: all " + @transition_speed + "s; " # Standard\

        return css

    readableCSS: (no_x = "") ->
        readable = "\t" + @generateCSS(no_x).replace(/; /g,";\n\t")
        readable.substr(0, readable.length - 1)

    completeCSS: (selector = "", no_x = "") ->
        if selector.length > 0
            selector + " {\n" + @readableCSS(no_x) + "}"
        else
            @selector + " {\n" + @readableCSS(no_x) + "}"

$(document).ready () ->
    # Global CSS objects
    def = new Style("#target-div")
    hover = new Style("#target-div:hover")
    active = new Style("#target-div:active")
    styling = def
    preview_mode = false
    center_x = $("#target-div").offset().left + $("#target-div").width() / 2
    center_y = $("#target-div").offset().top + $("#target-div").height() / 2

    applyStyles = () ->
        if preview_mode
            $('#target-div').text("TRANSITION PREVIEW IS ON")
            css = def.completeCSS() + '\n' + hover.completeCSS() + '\n' + active.completeCSS()
            $('#dynamic_stylesheet').html(css)
        else
            $('#target-div').text("")
            $("#dynamic_stylesheet").html(styling.completeCSS("#target-div", "no-transi"))

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
    $('#grad-color-droplet').on 'dragstart', () ->
        $("#dynamic_stylesheet").html(styling.completeCSS("#target-div", "no-transf"))
    $('#grad-color-droplet').on 'dragstop', () ->
        applyStyles()
    
    $('#target-div').droppable({accept: ".droplet-and-clone", drop: (event, ui) ->
        # Percentage depends on direction of gradient
        switch styling.gradient_type
            when "left-right", "right-left"
                left = ui.offset.left - $('#target-div').offset().left + $('#grad-color-droplet').width() / 2
                pct = Math.floor(left / $('#target-div').width() * 100)
                if styling.gradient_type is "right-left"
                    pct = 100 - pct
            when "top-bottom", "bottom-top"
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

    # TRANSFORM #############################################################################
    # Shear
    $("#transf-skew").slider({min: -89, max: 89, step: 1, value: 0})
    $("#transf-skew").on "slide", (event, ui) ->
            styling.transformation_skew = -ui.value
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
        $("#transf-skew").slider {value: -styling.transformation_skew}
        $("#shadow-darkness").slider {value: 255 - styling.shadow_darkness}
        $("#shadow-blur").slider {value: styling.shadow_blur}
        if styling.shadows_on
            $("#lbl-shadow-on").html('<i class="fa fa-toggle-on fa-3x" aria-hidden="true"></i>')
        else
            $("#lbl-shadow-on").html('<i class="fa fa-toggle-off fa-3x" aria-hidden="true"></i>')
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

    # SHADOW ############################################################################
    # Shadows on?
    $("input[name=shadow-on]").change () ->
        styling.shadows_on = !styling.shadows_on
        if styling.shadows_on
            $("#lbl-shadow-on").html('<i class="fa fa-toggle-on fa-3x" aria-hidden="true"></i>')
        else
            $("#lbl-shadow-on").html('<i class="fa fa-toggle-off fa-3x" aria-hidden="true"></i>')
        applyStyles()
    # Darkness
    $("#shadow-darkness").slider({min: 0, max: 255, step: 5, value: 255})
    $("#shadow-darkness").on "slide", (event, ui) ->
            styling.shadow_darkness = 255 - ui.value
            applyStyles()
    # Blur
    $("#shadow-blur").slider({min: 0, max: 100, step: 1, value: 50})
    $("#shadow-blur").on "slide", (event, ui) ->
            styling.shadow_blur = ui.value
            applyStyles()

    # Tabs
    tabswitcher = (event, ui) ->
        new_id = ui.newPanel[0].id
        old_id = ui.oldPanel[0].id
        # Clear bindings on the target div
        $("#target-div").off().removeClass()
        # Apply bindings as appropriate
        # Shadow dragger
        if new_id is "tab-shadow"
            dragging_cursor = false
            x_start = y_start = 0
            $("#target-div").addClass("dragcursor")
            $("#target-div").mousedown (event, ui) ->
                dragging_cursor = true
                x_start = event.pageX
                y_start = event.pageY
            $("#target-div").mousemove (event, ui) ->
                if dragging_cursor
                    x = event.pageX
                    y = event.pageY
                    delta_x = x - x_start
                    delta_y = y - y_start
                    x_start = x
                    y_start = y
                    if Math.abs(styling.shadow_offset_x + delta_x) < 25
                        styling.shadow_offset_x += delta_x
                    if Math.abs(styling.shadow_offset_y + delta_y) < 25 
                        styling.shadow_offset_y += delta_y
                    applyStyles()
            $("#target-div").mouseup (event, ui) ->
                dragging_cursor = false
            $("#target-div").mouseleave (event, ui) ->
                dragging_cursor = false
        # Transformation rotater
        if new_id is "tab-transform"
            $("#target-div").addClass("dragcursor")
            dragging_cursor = false
            x_start = y_start = 0
            $("#target-div").addClass("dragcursor")
            $("#target-div").mousedown (event, ui) ->
                dragging_cursor = true
                x_start = event.pageX - center_x
                y_start = center_y - event.pageY
            $("#target-div").mousemove (event, ui) ->
                if dragging_cursor
                    x = event.pageX
                    y = event.pageY
                    y = center_y - y
                    x = x - center_x
                    y_term = y - y_start
                    x_term = x - x_start
                    angle = Math.atan2(y_term, x_term) * 180 / Math.PI
                    angle = (angle + 360) % 360
                    angle = ((360 - angle) * 2) % 360
                    styling.transformation_angle = angle
                    styling.transformation_angle = styling.transformation_angle % 360
                    applyStyles()
            $("#target-div").mouseup (event, ui) ->
                dragging_cursor = false
            $("#target-div").mouseleave (event, ui) ->
                dragging_cursor = false

    $("#toolbar").tabs({active: 0, activate: tabswitcher});
    $("#generated-css").dialog {autoOpen: false, modal: true, width: "80%", title: "Copy & Paste CSS for Your Project", \
        buttons: [{text: "Done!", click: () -> $(this).dialog("close")}]}
    $("#generate-css").click () ->
        css = def.completeCSS() + "\n\n"
        css += hover.completeCSS() + "\n\n"
        css += active.completeCSS()
        $("#generated-css").text(css)
        $("#generated-css").dialog "open"
    $("#reset-all").click () ->
        location.reload()