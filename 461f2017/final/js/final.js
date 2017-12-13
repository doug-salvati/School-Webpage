// Generated by CoffeeScript 2.0.3
(function() {
  //   Douglas Salvati
  //   Douglas_Salvati@student.uml.edu
  //   Computer Science Department, UMass Lowell
  //   COMP.4610 GUI Programming 1
  //   File: /usr/cs/2018/dsalvati/public_html/comp4610/final/js/final.coffee
  //   Created: 9 December 2017
  //   Modified: 9 December 2017

  //   Description: This script manages the CSS Code generator by
  //   storing the code in an object, manipulating it on button presses,
  //   and generating the CSS.
  var Style;

  Style = class Style {
    constructor(selector) {
      this.selector = selector;
      this.gradient_type = "left-right";
      this.gradient = [];
      this.transition_speed = 0;
      this.transformation_skew = 0;
      this.shadows_on = false;
      this.shadow_darkness = 0;
      this.shadow_blur = 50;
      this.shadow_offset_x = 10;
      this.shadow_offset_y = 10;
    }

    resetAll() {
      this.gradient_type = "left-right";
      this.gradient = [];
      this.transition_speed = 0;
      return this.transformation_skew = 0;
    }

    resetGradient() {
      return this.gradient = [];
    }

    addGradientStop(color, pct) {
      var new_stop;
      new_stop = [color, pct];
      this.gradient.push(new_stop);
      return this.gradient.sort(function(a, b) {
        if (a[1] < b[1]) {
          return -1;
        }
        if (a[1] > b[1]) {
          return 1;
        }
        return 0;
      });
    }

    generateCSS(no_x = "") {
      var css, grad_color_list, grad_type_firefox, grad_type_opera, grad_type_safari, grad_type_std, i, len, no_transf, no_transi, ref, stop;
      // INITIALIZE
      css = "";
      no_transi = no_x === "no-transi";
      no_transf = no_x === "no-transf";
      // SIZE
      css += "height: 300px; ";
      css += "width: 300px; ";
      // GRADIENT
      if (this.gradient.length > 0) {
        // Direction
        switch (this.gradient_type) {
          case "left-right":
            grad_type_safari = "left";
            grad_type_opera = "right";
            grad_type_firefox = "right";
            grad_type_std = "to right";
            break;
          case "right-left":
            grad_type_safari = "right";
            grad_type_opera = "left";
            grad_type_firefox = "left";
            grad_type_std = "to left";
            break;
          case "top-bottom":
            grad_type_safari = "top";
            grad_type_opera = "bottom";
            grad_type_firefox = "bottom";
            grad_type_std = "to bottom";
            break;
          case "bottom-top":
            grad_type_safari = "bottom";
            grad_type_opera = "top";
            grad_type_firefox = "top";
            grad_type_std = "to top";
        }
        // Color list
        grad_color_list = "";
        ref = this.gradient;
        for (i = 0, len = ref.length; i < len; i++) {
          stop = ref[i];
          grad_color_list += ", " + stop[0] + " " + stop[1] + "%";
        }
        // Code
        if (this.gradient_type === "radial") {
          css += "background: " + this.gradient[0][0] + "; "; // No gradient support
          css += "background: -webkit-radial-gradient(circle" + grad_color_list + "); "; // Safari
          css += "background: -o-radial-gradient(circle" + grad_color_list + "); "; // Opera
          css += "background: -moz-radial-gradient(circle" + grad_color_list + "); "; // Firefox
          css += "background: radial-gradient(circle" + grad_color_list + "); "; // Standard
        } else {
          css += "background: " + this.gradient[0][0] + "; "; // No gradient support
          css += "background: -webkit-linear-gradient(" + grad_type_safari + grad_color_list + "); "; // Safari
          css += "background: -o-linear-gradient(" + grad_type_opera + grad_color_list + "); "; // Opera
          css += "background: -moz-linear-gradient(" + grad_type_firefox + grad_color_list + "); "; // Firefox
          css += "background: linear-gradient(" + grad_type_std + grad_color_list + "); "; // Standard
        }
      } else {
        css += "background: white; ";
      }
      // TRANSFORMATIONS
      // Skew
      if (!no_transf) {
        css += "-ms-transform: skewX(" + this.transformation_skew + "deg); "; // IE
        css += "-webkit-transform: skewX(" + this.transformation_skew + "deg); "; // Safari
        css += "transform: skewX(" + this.transformation_skew + "deg); "; // Standard
      }
      
      // SHADOWS
      if (this.shadows_on) {
        css += "box-shadow: " + this.shadow_offset_x + "px " + this.shadow_offset_y + "px " + this.shadow_blur + "px " + "rgb(" + this.shadow_darkness + "," + this.shadow_darkness + "," + this.shadow_darkness + "); ";
      }
      // TRANSITIONS
      if (!((this.transition_speed === 0) || no_transi)) {
        css += "-webkit-transition: all " + this.transition_speed + "s; "; // Safari
        css += "transition: all " + this.transition_speed + "s; "; // Standard\
      }
      return css;
    }

    readableCSS(no_x = "") {
      var readable;
      readable = "\t" + this.generateCSS(no_x).replace(/; /g, ";\n\t");
      return readable.substr(0, readable.length - 1);
    }

    completeCSS(selector = "", no_x = "") {
      if (selector.length > 0) {
        return selector + " {\n" + this.readableCSS(no_x) + "}";
      } else {
        return this.selector + " {\n" + this.readableCSS(no_x) + "}";
      }
    }

  };

  $(document).ready(function() {
    var active, applyStyles, def, hover, picker, preview_mode, styling, tabswitcher;
    // Global CSS objects
    def = new Style("#target-div");
    hover = new Style("#target-div:hover");
    active = new Style("#target-div:active");
    styling = def;
    preview_mode = false;
    applyStyles = function() {
      var css;
      if (preview_mode) {
        $('#target-div').text("TRANSITION PREVIEW IS ON");
        css = def.completeCSS() + '\n' + hover.completeCSS() + '\n' + active.completeCSS();
        return $('#dynamic_stylesheet').html(css);
      } else {
        $('#target-div').text("");
        return $("#dynamic_stylesheet").html(styling.completeCSS("#target-div", "no-transi"));
      }
    };
    // GRADIENT ############################################################################
    // Color picker
    picker = new CP(document.getElementById("grad-color-droplet"), false);
    picker.on("change", function(color) {
      return $(this.target).css("background-color", '#' + color);
    });
    // Customize color picker, based on example from the distro
    picker.picker.classList.add('static');
    picker.enter(document.getElementById("grad-colorpicker"));
    $('#grad-color-droplet').draggable({
      revert: "invalid",
      revertDuration: 200,
      scroll: false,
      helper: "clone",
      cursorAt: {
        top: 25,
        left: 25
      }
    });
    $('#grad-color-droplet').on('dragstart', function() {
      return $("#dynamic_stylesheet").html(styling.completeCSS("#target-div", "no-transf"));
    });
    $('#grad-color-droplet').on('dragstop', function() {
      return applyStyles();
    });
    $('#target-div').droppable({
      accept: ".droplet-and-clone",
      drop: function(event, ui) {
        var cnr_x, cnr_y, ctr_x, ctr_y, dist, dist_max, left, pct, top, x, y;
        // Percentage depends on direction of gradient
        switch (styling.gradient_type) {
          case "left-right":
          case "right-left":
            left = ui.offset.left - $('#target-div').offset().left + $('#grad-color-droplet').width() / 2;
            pct = Math.floor(left / $('#target-div').width() * 100);
            if (styling.gradient_type === "right-left") {
              pct = 100 - pct;
            }
            break;
          case "top-bottom":
          case "bottom-top":
            top = ui.offset.top - $('#target-div').offset().top + $('#grad-color-droplet').height() / 2;
            pct = Math.floor(top / $('#target-div').height() * 100);
            if (styling.gradient_type === "bottom-top") {
              pct = 100 - pct;
            }
            break;
          case "radial":
            x = ui.offset.left - $('#target-div').offset().left + $('#grad-color-droplet').width() / 2;
            y = top = ui.offset.top - $('#target-div').position().top + $('#grad-color-droplet').height() / 2;
            ctr_x = $('#target-div').width() / 2;
            ctr_y = $('#target-div').height() / 2;
            cnr_x = ctr_x * 2;
            cnr_y = ctr_y * 2;
            // Max distance (center to corner)
            dist_max = Math.sqrt(Math.pow(cnr_x - ctr_x, 2) + Math.pow(cnr_y - ctr_y, 2));
            // Actual distance from center
            dist = Math.sqrt(Math.pow(x - ctr_x, 2) + Math.pow(y - ctr_y, 2));
            pct = Math.floor(dist / dist_max * 100);
        }
        
        // Add the CSS
        styling.addGradientStop($("#grad-color-droplet").css('backgroundColor'), pct);
        return applyStyles();
      }
    });
    // Direction
    $("input[name=grad-direction]").change(function() {
      styling.gradient_type = $("input[name=grad-direction]:checked").val();
      return applyStyles();
    });
    // Reset
    $('#grad-reset').click(function() {
      styling.resetGradient();
      return applyStyles();
    });
    // TRANSFORM #############################################################################
    // Shear
    $("#transf-skew").slider({
      min: -89,
      max: 89,
      step: 1,
      value: 0
    });
    $("#transf-skew").on("slide", function(event, ui) {
      styling.transformation_skew = -ui.value;
      return applyStyles();
    });
    // TRANSITION ############################################################################
    // Which state editing?
    $("input[name=transi-state]").change(function() {
      var currently_editing;
      currently_editing = $("input[name=transi-state]:checked").val();
      switch (currently_editing) {
        case "default":
          styling = def;
          break;
        case "hover":
          styling = hover;
          break;
        case "click":
          styling = active;
      }
      $("#" + styling.gradient_type).prop('checked', true);
      $("#transf-skew").slider({
        value: -styling.transformation_skew
      });
      $("#shadow-darkness").slider({
        value: 255 - styling.shadow_darkness
      });
      $("#shadow-blur").slider({
        value: styling.shadow_blur
      });
      if (styling.shadows_on) {
        $("#lbl-shadow-on").html('<i class="fa fa-toggle-on fa-3x" aria-hidden="true"></i>');
      } else {
        $("#lbl-shadow-on").html('<i class="fa fa-toggle-off fa-3x" aria-hidden="true"></i>');
      }
      return applyStyles();
    });
    // View a preview of state effects
    $("input[name=transi-preview]").change(function() {
      preview_mode = !preview_mode;
      if (preview_mode) {
        $("#lbl-preview-mode").html('<i class="fa fa-toggle-on fa-3x" aria-hidden="true"></i>');
      } else {
        $("#lbl-preview-mode").html('<i class="fa fa-toggle-off fa-3x" aria-hidden="true"></i>');
      }
      return applyStyles();
    });
    // Choosing duration
    $("select#transi-duration").on("change", function() {
      def.transition_speed = parseFloat(this.value);
      return applyStyles();
    });
    // SHADOW ############################################################################
    // Shadows on?
    $("input[name=shadow-on]").change(function() {
      styling.shadows_on = !styling.shadows_on;
      if (styling.shadows_on) {
        $("#lbl-shadow-on").html('<i class="fa fa-toggle-on fa-3x" aria-hidden="true"></i>');
      } else {
        $("#lbl-shadow-on").html('<i class="fa fa-toggle-off fa-3x" aria-hidden="true"></i>');
      }
      return applyStyles();
    });
    // Darkness
    $("#shadow-darkness").slider({
      min: 0,
      max: 255,
      step: 5,
      value: 255
    });
    $("#shadow-darkness").on("slide", function(event, ui) {
      styling.shadow_darkness = 255 - ui.value;
      return applyStyles();
    });
    // Blur
    $("#shadow-blur").slider({
      min: 0,
      max: 100,
      step: 1,
      value: 50
    });
    $("#shadow-blur").on("slide", function(event, ui) {
      styling.shadow_blur = ui.value;
      return applyStyles();
    });
    // Tabs
    tabswitcher = function(event, ui) {
      var dragging_cursor, new_id, old_id, x_start, y_start;
      new_id = ui.newPanel[0].id;
      old_id = ui.oldPanel[0].id;
      // Clear bindings on the target div
      $("#target-div").off().removeClass();
      // Apply bindings as appropriate
      // Shadow dragger
      if (new_id === "tab-shadow") {
        dragging_cursor = false;
        x_start = y_start = 0;
        $("#target-div").addClass("dragcursor");
        $("#target-div").mousedown(function(event, ui) {
          dragging_cursor = true;
          x_start = event.pageX;
          return y_start = event.pageY;
        });
        $("#target-div").mousemove(function(event, ui) {
          var delta_x, delta_y, x, y;
          if (dragging_cursor) {
            x = event.pageX;
            y = event.pageY;
            delta_x = x - x_start;
            delta_y = y - y_start;
            x_start = x;
            y_start = y;
            if (Math.abs(styling.shadow_offset_x + delta_x) < 25) {
              styling.shadow_offset_x += delta_x;
            }
            if (Math.abs(styling.shadow_offset_y + delta_y) < 25) {
              styling.shadow_offset_y += delta_y;
            }
            return applyStyles();
          }
        });
        $("#target-div").mouseup(function(event, ui) {
          return dragging_cursor = false;
        });
        return $("#target-div").mouseleave(function(event, ui) {
          return dragging_cursor = false;
        });
      }
    };
    $("#toolbar").tabs({
      active: 0,
      activate: tabswitcher
    });
    $("#generated-css").dialog({
      autoOpen: false,
      modal: true,
      width: "80%",
      title: "Copy & Paste CSS for Your Project",
      buttons: [
        {
          text: "Done!",
          click: function() {
            return $(this).dialog("close");
          }
        }
      ]
    });
    $("#generate-css").click(function() {
      var css;
      css = def.completeCSS() + "\n\n";
      css += hover.completeCSS() + "\n\n";
      css += active.completeCSS();
      $("#generated-css").text(css);
      return $("#generated-css").dialog("open");
    });
    return $("#reset-all").click(function() {
      return location.reload();
    });
  });

}).call(this);
