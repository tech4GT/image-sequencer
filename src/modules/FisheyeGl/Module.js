/*
 * Resolves Fisheye Effect
 */
module.exports = function DoNothing(options, UI) {

  var output;

  function draw(input, callback) {

    var step = this;
    var distorter;

    if (!options.inBrowser) { // This module is only for browser
      // this.output = input;
      // callback();

      const { createCanvas, loadImage } = require('canvas')

      var FisheyeGl = function FisheyeGl(options) {

        // Defaults:
        options = options || {};

        options.width = options.width || 800;
        options.height = options.height || 600;

        var model = options.model || {
          vertex: [
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0
          ],
          indices: [
            0, 1, 2,
            0, 2, 3,
            2, 1, 0,
            3, 2, 0
          ],
          textureCoords: [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
          ]
        };

        var lens = options.lens || {
          a: 1.0,
          b: 1.0,
          Fx: 0.0,
          Fy: 0.0,
          scale: 1.5
        };
        var fov = options.fov || {
          x: 1.0,
          y: 1.0
        }
        var image = options.image || "./images/grid.png";

        var canvas = options.canvas || "#canvas";
        var gl = getGLContext(canvas);

        var shaders = require('./shaders');

        var vertexSrc = loadFile(options.vertexSrc || "vertex");
        var fragmentSrc = loadFile(options.fragmentSrc || "fragment3");

        var program = compileShader(gl, vertexSrc, fragmentSrc)
        gl.useProgram(program);

        var aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
        var aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
        var uSampler = gl.getUniformLocation(program, "uSampler");
        var uLensS = gl.getUniformLocation(program, "uLensS");
        var uLensF = gl.getUniformLocation(program, "uLensF");
        var uFov = gl.getUniformLocation(program, "uFov");

        var vertexBuffer,
          indexBuffer,
          textureBuffer;

        function createBuffers() {

          vertexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.vertex), gl.STATIC_DRAW);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);

          indexBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

          textureBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model.textureCoords), gl.STATIC_DRAW);
          gl.bindBuffer(gl.ARRAY_BUFFER, null);

        }

        createBuffers();

        function getGLContext(canvas) {
          // var canvas = document.querySelector(selector);

          if (canvas == null) {
            throw new Error("there is no canvas on this page");
          }

          var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
          for (var i = 0; i < names.length; ++i) {
            var gl;
            try {
              gl = canvas.getContext(names[i], { preserveDrawingBuffer: true });
            } catch (e) {
              continue;
            }
            if (gl) return gl;
          }

          throw new Error("WebGL is not supported!");
        }

        function compileShader(gl, vertexSrc, fragmentSrc) {
          var vertexShader = gl.createShader(gl.VERTEX_SHADER);
          gl.shaderSource(vertexShader, vertexSrc);
          gl.compileShader(vertexShader);

          _checkCompile(vertexShader);

          var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
          gl.shaderSource(fragmentShader, fragmentSrc);
          gl.compileShader(fragmentShader);

          _checkCompile(fragmentShader);

          var program = gl.createProgram();

          gl.attachShader(program, vertexShader);
          gl.attachShader(program, fragmentShader);

          gl.linkProgram(program);

          return program;

          function _checkCompile(shader) {
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
              throw new Error(gl.getShaderInfoLog(shader));
            }
          }
        }

        function loadFile(url, callback) {

          if (shaders.hasOwnProperty(url)) {
            return shaders[url];
          }

          var ajax = new XMLHttpRequest();

          if (callback) {
            ajax.addEventListener("readystatechange", on)
            ajax.open("GET", url, true);
            ajax.send(null);
          } else {
            ajax.open("GET", url, false);
            ajax.send(null);

            if (ajax.status == 200) {
              return ajax.responseText;
            }
          }

          function on() {
            if (ajax.readyState === 4) {
              //complete requset
              if (ajax.status === 200) {
                //not error
                callback(null, ajax.responseText);
              } else {
                callback(new Error("fail to load!"));
              }
            }
          }
        }

        function loadImages(gl, img, callback, texture) {
          texture = texture || gl.createTexture();

          gl.bindTexture(gl.TEXTURE_2D, texture);

          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).
          //gl.generateMipmap(gl.TEXTURE_2D);
          gl.bindTexture(gl.TEXTURE_2D, null);

          if (callback) callback(null, texture);
          return texture;
        }

        function loadImageFromUrl(gl, url, callback) {
          var texture = gl.createTexture();

          var Canvas = require('canvas');

          var img = new Canvas.Image; // Create a new Image
          img.src = url;

          // Initialiaze a new Canvas with the same dimensions
          // as the image, and get a 2D drawing context for it.
          var canvas = createCanvas(img.width, img.height);
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);

          loadImages(gl, canvas.getContext('2d').createImageData(img.width, img.height), callback, texture);
          options.width = img.width;
          options.height = img.height;
          resize(
            options.width,
            options.height
          )

          return texture;
        }

        function run(animate, callback) {
          // var current = null;
          // if (!current) current = t;
          // var dt = t - current;
          // current = t;
          options.runner();
          if (callback) callback();
          // if (animate === true) f(on);
        }

        function resize(w, h) {
          gl.viewport(0, 0, w, h);
          var ext = gl.getExtension('STACKGL_resize_drawingbuffer')
          ext.resize(20, 5)
        }

        options.runner = options.runner || function runner(dt) {

          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.enable(gl.DEPTH_TEST);

          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

          gl.enableVertexAttribArray(aVertexPosition);

          gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
          gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);

          gl.enableVertexAttribArray(aTextureCoord);

          gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
          gl.vertexAttribPointer(aTextureCoord, 2, gl.FLOAT, false, 0, 0);

          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.uniform1i(uSampler, 0);

          gl.uniform3fv(uLensS, [lens.a, lens.b, lens.scale]);
          gl.uniform2fv(uLensF, [lens.Fx, lens.Fy]);
          gl.uniform2fv(uFov, [fov.x, fov.y]);

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
          gl.drawElements(gl.TRIANGLES, model.indices.length, gl.UNSIGNED_SHORT, 0);
        }

        var texture;

        function setImage(imageUrl, callback) {
          texture = loadImageFromUrl(gl, imageUrl, function onImageLoad() {
            if (callback) callback();
            // run(false, callback);
          });
        }

        setImage(image);

        // asynchronous!
        function getImage(format) {

          var img = new Image();

          img.src = gl.canvas.toDataURL(format || 'image/jpeg');

          return img;

        }

        function getSrc(format) {

          return canvas.toDataURL(format || 'image/jpeg');

        }

        // external API:
        var rv = {
          options: options,
          gl: gl,
          lens: lens,
          fov: fov,
          run: run,
          getImage: getImage,
          setImage: setImage,
          getSrc: getSrc
        }

        return rv;

      }

      var gl = require('gl')(200, 200, { preserveDrawingBuffer: true })
      const canvas = createCanvas(200, 200)
      // data = canvas.getContext('2d').createImageData(10, 10);
      var x = canvas.getContext;
      canvas.getContext = function(param) {
        if (param === 'webgl')
          return gl;
        else x(param);
      }

      distorter = FisheyeGl({
        canvas: canvas
      });

    }
    else {
      // Create a canvas, if it doesn't already exist.
      if (!document.querySelector('#image-sequencer-canvas')) {
        var canvas = document.createElement('canvas');
        canvas.style.display = "none";
        canvas.setAttribute('id', 'image-sequencer-canvas');
        document.body.append(canvas);
      }
      else var canvas = document.querySelector('#image-sequencer-canvas');

      distorter = FisheyeGl({
        selector: "#image-sequencer-canvas"
      });
    }


    // Parse the inputs
    options.a = parseFloat(options.a) || distorter.lens.a;
    options.b = parseFloat(options.b) || distorter.lens.b;
    options.Fx = parseFloat(options.Fx) || distorter.lens.Fx;
    options.Fy = parseFloat(options.Fy) || distorter.lens.Fy;
    options.scale = parseFloat(options.scale) || distorter.lens.scale;
    options.x = parseFloat(options.x) || distorter.fov.x;
    options.y = parseFloat(options.y) || distorter.fov.y;

    // Set fisheyegl inputs
    distorter.lens.a = options.a;
    distorter.lens.b = options.b;
    distorter.lens.Fx = options.Fx;
    distorter.lens.Fy = options.Fy;
    distorter.lens.scale = options.scale;
    distorter.fov.x = options.x;
    distorter.fov.y = options.y;


    // generate fisheyegl output
    distorter.setImage(input.src, function() {

      step.output = { src: distorter.getSrc(), format: input.format };
      callback();

    });

  }

  return {
    options: options,
    draw: draw,
    output: output,
    UI: UI
  }
}
