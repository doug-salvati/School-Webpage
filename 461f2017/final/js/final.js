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

    generateCSS(no_trans = false) {
      var css, grad_color_list, grad_type_firefox, grad_type_opera, grad_type_safari, grad_type_std, i, len, ref, stop;
      // INITIALIZE
      css = "";
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
      // TRANSITIONS
      if (!((this.transition_speed === 0) || no_trans)) {
        css += "-webkit-transition: all " + this.transition_speed + "s; "; // Safari
        css += "transition: all " + this.transition_speed + "s; "; // Standard
      }
      return css;
    }

    readableCSS(no_trans = false) {
      var readable;
      readable = "\t" + this.generateCSS(no_trans).replace(/; /g, ";\n\t");
      return readable.substr(0, readable.length - 1);
    }

    completeCSS(selector = "", no_trans = false) {
      if (selector.length > 0) {
        return selector + " {\n" + this.readableCSS(no_trans) + "}";
      } else {
        return this.selector + " {\n" + this.readableCSS(no_trans) + "}";
      }
    }

  };

  $(document).ready(function() {
    var active, applyStyles, def, hover, picker, preview_mode, styling;
    // Global CSS objects
    def = new Style("#target-div");
    hover = new Style("#target-div:hover");
    active = new Style("#target-div:active");
    styling = def;
    preview_mode = false;
    applyStyles = function() {
      var css;
      if (preview_mode) {
        $('#target-div').text("TRANSITION PREVIEW");
        css = def.completeCSS() + '\n' + hover.completeCSS() + '\n' + active.completeCSS();
        return $('#dynamic_stylesheet').html(css);
      } else {
        $('#target-div').text("");
        return $("#dynamic_stylesheet").html(styling.completeCSS("#target-div", true));
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
            console.log(ui.position.top);
            console.log(ui.offset.top);
            console.log($('#target-div').offset().top);
            console.log($('#grad-color-droplet').height() / 2);
            console.log($('#target-div').height());
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
    // Tabs
    $("#toolbar").tabs({
      active: 0
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
    return $("#generate-css").click(function() {
      var css;
      css = def.completeCSS() + "\n\n";
      css += hover.completeCSS() + "\n\n";
      css += active.completeCSS();
      $("#generated-css").text(css);
      return $("#generated-css").dialog("open");
    });
  });

}).call(this);
