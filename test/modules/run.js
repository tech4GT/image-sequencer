'use strict';

var fs = require('fs');
var test = require('tape');

require('../../src/ImageSequencer.js');

var sequencer = ImageSequencer({ ui: false });
var red = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAABgj/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABykX//Z";

sequencer.loadImages('image1', red);
sequencer.addSteps('channel');
sequencer.addSteps('invert');
sequencer.addSteps('invert');
sequencer.addSteps('ndvi');

test('run() works with all possible argument combinations',function(t){
    sequencer.run();
    sequencer.run({index: 0});
    sequencer.run(function callback(out){
        t.end();
    });
    t.end();
});