var GravityField = function(options) {

  options = options || {};

  options.width = options.width || 100;
  options.height = options.height || 100;
  options.isMobile = options.isMobile || false;

  if (!options.canvas) {
    console.error("canvas element required for cops and robbas :/");
    return;
  }

  if (!options.reqAnimationFrame) {
    console.error("window.requestAnimationFrame required for cops and robbas :/");
    return;
  }

  var canvas = options.canvas,
    width = options.width,
    height = options.height,
    reqFrame = options.reqAnimationFrame,
    context = canvas.getContext('2d'),
    initialSetup = true,
    isMobile = options.isMobile,
    bodies = [],
    vecField = null,
    run = false,
    scale = 10,
    maxRadius = 10,
    maxWeight = 1000;

  var setup = function() {
    //heuristic value of each node can
    // be calculate once because we are using
    // a static bodies
    // heuristic of each node is dependent
    // on start and stop location of path

    //so let's randomly select the start and
    // stop locations

    bodies = [],
      run = false;

    $(canvas).attr('width', width).attr('height', height);

    vecField = new VectorField({
      xRes: ~~(width / scale),
      yRes: ~~(height / scale),
      type: 'line'
    });

    for (var i = 0; i < 10; i++) {
      bodies.push(new Body({
        pos: getRandomPoint(2, [
          [0, width],
          [0, height]
        ]),
        r: ~~(Math.random() * maxRadius),
        mass: ~~(Math.random() * maxWeight)
      }));
    }

    if (initialSetup) {
      updateSystem();
      initialSetup = false;
    }
  };


  function drawSystem() {
    context.clearRect(0, 0, width, height);
    for (var i = 0; i < bodies.length; i++) {
      bodies[i].draw(context);
    }
    vecField.draw(context);
  };

  function updateSystem() {
    updateBodies();
    updateField();
    drawSystem();
    reqFrame(updateSystem);
  };

  function updateBodies() {

  };

  function updateField() {

  };

  function onMouseMove(mouse) {
    if (mouse.mouseDown1) {
      //  addWallToNode([mouse.x, mouse.y]);
    } else if (mouse.mouseDown2) {
      //  removeWallToNode([mouse.x, mouse.y]);
    }
  }

  function onKeyPress(e) {
    if (e.keyCode == 0 || e.keyCode == 32) {
      run = !run;
    } else if (e.keyCode == 114) {
      //reset
      setup();
    }
  }

  function resize(size) {
    width = size.width;
    height = size.height;
    setup();
  }

  //dim = dimension
  //range = [[min1,max2],[min2,max2],..]
  function getRandomPoint(dim, range) {
    var ret = [],
      val;
    for (var i = 0; i < dim; i++) {
      val = range[i][0] + Math.random() * Math.abs(range[i][1] - range[i][0])
      ret = ret.concat(Number(val.toPrecision(3)));
    }
    return ret;
  }

  return {
    begin: setup,
    resize: resize,
    onMouseMove: onMouseMove,
    onKeyPress: onKeyPress
  }
};
