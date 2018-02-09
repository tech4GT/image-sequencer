/*
 * Detect Edges in an Image
 */
module.exports = function edgeDetect(options,UI) {

    options = options || {};
    options.title = "Detect Edges";
    options.description = "Detects the edges in an image";
  
    // Tell UI that a step has been set up.
    UI.onSetup(options.step);
    var output;
  
    // The function which is called on every draw.
    function draw(input,callback) {
  
      // Tell UI that a step is being drawn.
      UI.onDraw(options.step);
  
      var step = this;
  
      function changePixel(r, g, b, a) {
        return [(r+g+b)/3, (r+g+b)/3, (r+g+b)/3, a];
      }
  
      function output(image,datauri,mimetype){
  
        // This output is accessible by Image Sequencer
        step.output = {src:datauri,format:mimetype};
  
        // This output is accessible by UI
        options.step.output = datauri;
  
        // Tell UI that step has been drawn.
        UI.onComplete(options.step);
      }
  
      return require('../_nomodule/PixelManipulation.js')(input, {
        output: output,
        changePixel: changePixel,
        format: input.format,
        image: options.image,
        callback: callback
      });
  
    }
  
    return {
      options: options,
      draw:  draw,
      output: output,
      UI: UI
    }
  }