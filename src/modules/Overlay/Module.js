module.exports = function Dynamic(options, UI, util) {

    options.x = options.x || 0;
    options.y = options.y || 0;

    var output;

    // This function is called on every draw.
    function draw(input, callback, progressObj) {
    }

    return {
        options: options,
        draw: draw,
        output: output,
        UI: UI
    }
}
