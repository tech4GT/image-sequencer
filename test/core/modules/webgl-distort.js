var test = require('tape');
var base64Img = require('base64-img');
var looksSame = require('looks-same');

require('../../../src/ImageSequencer.js');

var sequencer = ImageSequencer({ ui: false });
var options = {
        nw: '0 100',
        ne: '1023 50',
        se: '1223 867',
        sw: '100 767'
    };
var target = 'test_outputs';
var red = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABlBMVEX+AAD///+KQee0AAAAAWJLR0QB/wIt3gAAAAd0SU1FB+EGHRIVAvrm6EMAAAAMSURBVAjXY2AgDQAAADAAAceqhY4AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDYtMjlUMTg6MjE6MDIrMDI6MDDGD83DAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA2LTI5VDE4OjIxOjAyKzAyOjAwt1J1fwAAAABJRU5ErkJggg==";
var benchmark = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAH0lEQVQ4T2NkoBAwUqifYdQAhtEwYBgNA1A+Gvi8AAAmmAARf9qcXAAAAABJRU5ErkJggg==";

// Test 1 to check webgl-distort module is getting loaded
test('Load distort module', function(t) {
  sequencer.loadImages(red);
  sequencer.addSteps('webgl-distort', options);
  t.equal(sequencer.steps[1].options.name, 'webgl-distort', 'Distort module is getting loaded');
  t.end();
});

// Test 2 to check options are correct
test('Check Options', function(t) {
  t.equal(sequencer.steps[1].options.nw, '0 100', 'Options are correct');
  t.equal(sequencer.steps[1].options.ne, '1023 50', 'Options are correct');
  t.equal(sequencer.steps[1].options.se, '1223 867', 'Options are correct');
  t.equal(sequencer.steps[1].options.sw, '100 767', 'Options are correct');
  t.end();
});

// Test 3 to check webgl-distort module works as expected
test('Distort module works correctly', function(t) {
  sequencer.run({ mode: 'test' }, function(out) {
    var result = sequencer.steps[1].output.src
    base64Img.imgSync(result, target, 'result')
    base64Img.imgSync(benchmark, target, 'benchmark')
    result = './test_outputs/result.png'
    benchmark = './test_outputs/benchmark.png'
    looksSame(result, benchmark, function(err, res) {
      if (err) console.log(err)
      t.equal(res.equal, true)
      t.end()
    })
  })
})