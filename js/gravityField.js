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
    rbf = new RBF(),
    initialSetup = true,
    isMobile = options.isMobile,
    bodies = [],
    vecField = null,
    run = false,
    scale = 15,
    maxRadius = 10,
    maxWeight = 100;

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
      width: width,
      height: height,
      xRes: ~~(width / scale),
      yRes: ~~(height / scale),
      type: 'line',
      maxVal: maxWeight
    });

    for (var i = 0; i < 10; i++) {
      bodies.push(new Body({
        pos: getRandomPoint(2, [
          [0, width],
          [0, height]
        ]),
        r: 5 + ~~(Math.random() * maxRadius),
      //mass: 10 + ~~(Math.random() * maxWeight)
          // dx: ~~(Math.random() * 5),
          // dy: ~~(Math.random() * 5)
      }));
    }

    if (initialSetup) {
      updateSystem();
      initialSetup = false;
    }
  };


  function drawSystem() {
    context.clearRect(0, 0, width, height);
    vecField.draw(context);
    for (var i = 0; i < bodies.length; i++) {
      bodies[i].draw(context);
    }

  };

  function updateSystem() {
    updateBodies();
    updateField();
    drawSystem();
    reqFrame(updateSystem);
  };

  function updateBodies() {
    for (var i = 0; i < bodies.length; i++) {
      bodies[i].step();
    }
  };

  function updateField() {
    var target = bodies.map(function(body) {
      return body.mass;
    });
    var locations = bodies.map(function(body) {
      return body.pos;
    });
    rbf.compileSync(locations, target);
    vecField.updateField(rbf);
  };

  function onMouseMove(mouse) {
    if (mouse.mouseDown1) {
      moveBody([mouse.x, mouse.y]);
    } else if (mouse.mouseDown2) {
      addBody([mouse.x, mouse.y]);
    }
  }

  function moveBody(pos) {
    var bs = getNearest(pos);

    if (bs.length > 0) {
      _.forEach(bodies, function(body) {
        body.pos = pos;
      });
    }
  }

  function addBody(pos) {
    bodies.push(new Body({
      pos: pos,
      r: 5 + ~~(Math.random() * maxRadius),
      //mass: 10 + ~~(Math.random() * maxWeight)
    }));
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

  function getNearest(pos) {
    return _.filter(bodies, function(body) {
      return Math.sqrt(Math.pow(pos[0] - body.pos[0], 2) +
        Math.pow(pos[1] - body.pos[1], 2)) < 25;
    });
  }

  return {
    begin: setup,
    resize: resize,
    onMouseMove: onMouseMove,
    onKeyPress: onKeyPress
  }
};
