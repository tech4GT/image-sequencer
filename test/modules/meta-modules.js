var test = require('tape');
require('../../src/ImageSequencer.js');

var sequencer1 = ImageSequencer({ ui: false });
var sequencer2 = ImageSequencer({ ui: false });
var red = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABgj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABykX//Z";

test('Load ndvi-colormap meta module', function(t) {
    sequencer1.loadImages('image1', red);
    sequencer1.addSteps('ndvi-colormap');
    sequencer2.addSteps(['ndvi', 'colormap']);
    t.deepEqual(sequencer1.steps, sequencer2.steps, "Steps were expanded correctly");
    t.end();
});