module.exports = function Dynamic(options, UI, util) {
  // Tests for functions that are available inside modules only

  var output;

  // This function is called on every draw.
  function draw(input, callback) {

    var step = this;

    this.getPreviousStep();
    this.getNextStep();
    this.getInput(1);
    this.getOutput(1);
    this.getOptions();
    this.getFormat();
    this.setOptions({});
    this.getHeight((() => { }));
    this.getWidth(() => { });

    function output(image, datauri, mimetype) {
      step.output = input;
    }

  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}