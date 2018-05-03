module.exports = function CropModuleUi(step, ui) {

  // problem is we don't have input image dimensions at the time of setting up the UI;
  // that comes when draw() is triggered...
  function setup() {
    // display original input image on initial setup
    var imgEl = step.imgElement //$(step.imgSelector);
// step.imgSelector is not defined, imgElement is
    imgEl.get().src = step.input;
    // display with 50%/50% default crop
    let width = Math.floor(imgEl.width() / 2),
        height = Math.floor(imgEl.height() / 2);
    imgEl.imgAreaSelect({
      handles: true,
      x1: 0,
      y1: 0,
      x2: width,
      y2: height,
      // when selection is complete
      onSelectEnd: function onSelectEnd(img, selection) {
        // assign crop values to module UI form inputs:
        let options = $(imgEl.get().parents()[2]).find("input");
        options[0].value = selection.x1;
        options[1].value = selection.y1;
        options[2].value = selection.x2 - selection.x1;
        options[3].value = selection.y2 - selection.y1;
        // then hide the draggable UI
        imgEl.imgAreaSelect({
          hide: true
        });
      }
    });
  }
 
  function reactivateDragToCrop(imgSelector) {
    imgSelector = imgSelector || ".img-thumbnail";
    // now hide the select, but re-activate when dragged upon
    $(imgSelector).last().imgAreaSelect({
      hide: true,
      onSelectStart: function() {
        showOriginal();
      }
    });
  }

  // replaces currently displayed output thumbnail with the input image, for ui dragging purposes
  function showOriginal() {
console.log('show original', step, step.input);
if (step.input)    step.imgElement.src = step.input;
//    let images = $(step.imgElement).get();
//    var currentImage = $(imgSelector).get().slice(-2)[1];
//    var previousImage = $(imgSelector).get().slice(-2)[0];
//    currentImage.src = previousImage.src; // replace the image with the original when you start re-cropping
  }

  return {
    reactivateDragToCrop: reactivateDragToCrop,
    setup: setup
  }
}
