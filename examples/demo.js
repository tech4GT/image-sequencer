window.onload = function() {
  sequencer = ImageSequencer();

  // Load information of all modules (Name, Inputs, Outputs)
  var modulesInfo = sequencer.modulesInfo();

  // Add modules to the addStep dropdown
  for (var m in modulesInfo) {
    $("#addStep select").append(
      '<option value="' + m + '">' + modulesInfo[m].name + "</option>"
    );
  }

  // Initial definitions
  var steps = document.querySelector("#steps");
  var parser = new DOMParser();
  var reader = new FileReader();

  // Set the UI in sequencer. This Will generate HTML based on
  // Image Sequencer events :
  // onSetup : Called every time a step is added
  // onDraw : Called every time a step starts draw
  // onComplete : Called every time a step finishes drawing
  // onRemove : Called everytime a step is removed
  // The variable 'step' stores useful data like input and
  // output values, step information.
  // See documetation for more details.
  sequencer.setUI({
    onSetup: function(step) {
      if (step.options && step.options.description)
        step.description = step.options.description;

      step.ui =
        '\
      <div class="row step">\
      <div class="col-md-4 details">\
      <h3>' +
        step.name +
        "</h3>\
      <p><i>" +
        (step.description || "") +
        '</i></p>\
      </div>\
      <div class="col-md-8">\
      <div class="load" style="display:none;"><i class="fa fa-circle-o-notch fa-spin"></i></div>\
      <a><img alt="" class=\'img-thumbnail dragable\' /></a>\
      </div>\
      </div>\
      ';

      var tools =
      '<div class="tools btn-group">\
         <button confirm="Are you sure?" class="remove btn btn btn-default">\
           <i class="fa fa-trash"></i>\
         </button>\
      </div>';

      step.ui = parser.parseFromString(step.ui, "text/html");
      step.ui = step.ui.querySelector("div.row");
      step.linkElement = step.ui.querySelector("a");
      step.imgElement = step.ui.querySelector("a img");

      if (sequencer.modulesInfo().hasOwnProperty(step.name)) {
        var inputs = sequencer.modulesInfo(step.name).inputs;
        var outputs = sequencer.modulesInfo(step.name).outputs;
        var merged = Object.assign(inputs, outputs); // combine outputs w inputs
        for (var paramName in merged) {
          var isInput = inputs.hasOwnProperty(paramName);
          var html = "";
          var inputDesc = (isInput)?inputs[paramName]:{};
          if (!isInput) {
            html += '<span class="output"></span>';
          } else if (inputDesc.type.toLowerCase() == "select") {
            html += '<select class="form-control" name="' + paramName + '">';
            for (var option in inputDesc.values) {
              html += '<option>' + inputDesc.values[option] + '</option>';
            }
            html += "</select>";
          } else {
            html = '<input class="form-control" type="' + inputDesc.type + '" name="' + paramName + '">';
          }
          var div = document.createElement('div');
          div.className = "row";
          div.setAttribute('name', paramName);
          var description = inputs[paramName].desc || paramName;
          div.innerHTML = "<div class='det'>\
                             <label for='" + paramName + "'>" + description + "</label>\
                             " + html + "\
                           </div>";
          step.ui.querySelector('div.details').appendChild(div);
        }
        $(step.ui.querySelector("div.details")).append(
          "<p><button class='btn btn-default btn-save'>Save</button></p>"
        );

	function saveOptions() {
          $(step.ui.querySelector('div.details')).find('input,select').each(function(i, input) {
            step.options[$(input).attr('name')] = input.value;
          });
          sequencer.run();
        }

        // on clicking Save in the details pane of the step
        $(step.ui.querySelector('div.details .btn-save')).click(saveOptions);
      }

      if (step.name != "load-image")
        step.ui
          .querySelector("div.details")
          .appendChild(
            parser.parseFromString(tools, "text/html").querySelector("div")
          );

      steps.appendChild(step.ui);
    },

    onDraw: function(step) {
      $(step.ui.querySelector(".load")).show();
      $(step.ui.querySelector("img")).hide();
    },

    onComplete: function(step) {
      $(step.ui.querySelector(".load")).hide();
      $(step.ui.querySelector("img")).show();

      step.imgElement.src = step.output;
      step.linkElement.href = step.output;

      function fileExtension(output) {
        return output.split("/")[1].split(";")[0];
      }

      step.linkElement.download = step.name + "." + fileExtension(step.output);
      step.linkElement.target = "_blank";

      if (sequencer.modulesInfo().hasOwnProperty(step.name)) {
        var inputs = sequencer.modulesInfo(step.name).inputs;
        var outputs = sequencer.modulesInfo(step.name).outputs;
        for (var i in inputs) {
          if (
            step.options[i] !== undefined &&
            inputs[i].type.toLowerCase() === "input"
          )
            step.ui.querySelector('div[name="' + i + '"] input').value =
              step.options[i];
          if (
            step.options[i] !== undefined &&
            inputs[i].type.toLowerCase() === "select"
          )
            step.ui.querySelector('div[name="' + i + '"] select').value =
              step.options[i];
        }
        for (var i in outputs) {
          if (step[i] !== undefined)
            step.ui.querySelector('div[name="' + i + '"] input').value =
              step[i];
        }
      }
    },

    onRemove: function(step) {
      step.ui.remove();
    }
  });

  sequencer.loadImage("images/tulips.png", function loadImageUI() {
    // look up needed steps from Url Hash:
    var hash = getUrlHashParameter("steps");

    if (hash) {
      var stepsFromHash = hash.split(",");
      stepsFromHash.forEach(function eachStep(step) {
        sequencer.addSteps(step);
      });
      sequencer.run();
    }
  });

  $("#addStep select").on("change", selectNewStepUI);

  function selectNewStepUI() {
    var m = $("#addStep select").val();
    $("#addStep .info").html(sequencer.modulesInfo(m).description);
  }

  function addStepUI() {
    // Adds the dragable class to the cropped image
    let dragToCropFlag = false;
    if ($("#selectStep")[0].value === "crop") dragToCropFlag = true;

    var options = {};
    var inputs = $("#options input, #options select");
    $.each(inputs, function() {
      options[this.name] = $(this).val();
    });
    if ($("#addStep select").val() == "none") return;
    // add to URL hash too
    var hash = getUrlHashParameter("steps") || "";
    if (hash != "") hash += ",";
    setUrlHashParameter("steps", hash + $("#addStep select").val());
    sequencer.addSteps($("#addStep select").val(), options).run();

    if (dragToCropFlag) {
      let images = $(".dragable").get();

      let newImage = $(images.pop());

      $(images.pop()).imgAreaSelect({
        handles: true,
        onSelectEnd: function(img, selection) {
          let options = $(newImage.parents()[2]).find("input");
          options[0].value = selection.x1;
          options[1].value = selection.y1;
          options[2].value = selection.x2 - selection.x1;
          options[3].value = selection.y2 - selection.y1;
        }
      });
    }
  }

  $("#addStep button").on("click", addStepUI);

  function removeStepUI() {
    var index = $("button.remove").index(this) + 1;
    sequencer.removeSteps(index).run();
    // remove from URL hash too
    var urlHash = getUrlHashParameter("steps").split(",");
    urlHash.splice(index - 1, 1);
    setUrlHashParameter("steps", urlHash.join(","));
  }

  $("body").on("click", "button.remove", removeStepUI);

  // image selection and drag/drop handling from examples/lib/imageSelection.js
  setupFileHandling(sequencer);
};
