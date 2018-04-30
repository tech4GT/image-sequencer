/*
 * Image Cropping module
 * Usage:
 *    Expected Inputs:
 *      options.x : x-coordinate of image where the modules starts cropping | default : 0
 *      options.y : y-coordinate of image where the modules starts cropping | default : 0
 *      options.w : width of the resulting cropped image | default : 50% of input image width
 *      options.h : height of the resulting cropped image | default : 50% of input image height
 *    Output:
 *      The cropped image, which is essentially a rectangle bounded by the lines:
 *          x = options.x
 *          x = options.x + options.w
 *          y = options.y
 *          y = options.y + options.h
 */
module.exports = function CropModule(options,UI) {

  // TODO: we could also set this to {} if nil in AddModule.js to avoid this line:
  options = options || {};

  // Tell the UI that a step has been added
  UI.onSetup(options.step);
  if (options.step.inBrowser) onSetupUi();
  var output;

  // This function is caled everytime the step has to be redrawn
  function draw(input,callback) {

    // Tell the UI that the step has been triggered
    UI.onDraw(options.step);
    var step = this;

    require('./Crop')(input,options,function(out,format){

      // This output is accessible to Image Sequencer
      step.output = {
        src: out,
        format: format
      }

      // This output is accessible to the UI
      options.step.output = out;

      // Tell the UI that the step has been drawn
      UI.onComplete(options.step);

      // Tell Image Sequencer that step has been drawn
      callback();

    });

  }

  function onSetupUi(imgSelector) {
    imgSelector = imgSelector || ".img-thumbnail";
 
    let images = $(imgSelector).get();
 
    let newImage = images.pop(),
      prevImage = images.pop();
 
    // display with 50%/50% default crop
    $(newImage).imgAreaSelect({
      handles: true,
      x1: 0,
      y1: 0,
      x2: Math.floor($(prevImage).width() / 2),
      y2: Math.floor($(prevImage).height() / 2),
      onSelectEnd: function onSelectEnd(img, selection) {
        let options = $($(newImage).parents()[2]).find("input");
        options[0].value = selection.x1;
        options[1].value = selection.y1;
        options[2].value = selection.x2 - selection.x1;
        options[3].value = selection.y2 - selection.y1;
        $(imgSelector).last().imgAreaSelect({
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
 
  function showOriginal(imgSelector) {
    imgSelector = imgSelector || ".img-thumbnail";
    var currentImage = $(imgSelector).get().slice(-2)[1];
    var previousImage = $(imgSelector).get().slice(-2)[0];
    currentImage.src = previousImage.src; // replace the image with the original when you start re-cropping
  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}
