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
    run = true,
    scale = 20,
    maxRadius = 30,
    maxWeight = 100;

  var setup = function() {

    bodies = [];
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

    for (var i = 0; i < 2; i++) {
      bodies.push(new Body({
        pos: getRandomPoint(2, [
          [0, width],
          [0, height]
        ]),
        r: 10 + ~~(Math.random() * maxRadius),
        maxX: width,
        maxY: height
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

  }

  function updateSystem() {
    if (run) {
      updateBodies();
      updateField();
      drawSystem();
    }
    reqFrame(updateSystem);
  }

  function updateBodies() {
    for (var i = 0; i < bodies.length; i++) {
      bodies[i].step();
    }
  }

  function updateField() {
    var target = bodies.map(function(body) {
      return body.mass;
    });
    var locations = bodies.map(function(body) {
      return [body.pos[0]- body.r, body.pos[1]- body.r];
    });
    if (rbf.compileSync(locations, target))
      vecField.updateField(rbf);
  }

  function onMouseMove(mouse) {
    if (mouse.mouseDown1) {
      moveBody([mouse.x, mouse.y]);
    }
  }

  function moveBody(pos) {
    var bs = getNearest(pos);

    if (bs.length > 0) {
      _.forEach(bs, function(body) {
        body.pos[0] = pos[0] + body.r;
        body.pos[1] = pos[1] + body.r;
        body.locked = true;
      });
    } else {
      _.forEach(bodies, function(body) {
        body.locked = false;
      });
    }
  }

  function addBody(pos) {
    bodies.push(new Body({
      pos: pos,
      r: 5 + ~~(Math.random() * maxRadius),
      maxX: width,
      maxY: height
        //mass: 10 + ~~(Math.random() * maxWeight)
    }));
  }

  function onKeyPress(e) {
    if (e.keyCode === 0 || e.keyCode == 32) { //space
      run = !run;
    } else if (e.keyCode == 114) { //r
      //reset
      setup();
    } else if (e.keyCode == 97) {
      addBody(getRandomPoint(2, [
        [0, width],
        [0, height]
      ]));
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
      val = range[i][0] + Math.random() * Math.abs(range[i][1] - range[i][0]);
      ret = ret.concat(Number(val.toPrecision(3)));
    }
    return ret;
  }

  function getNearest(mousePos) {
    return _.filter(bodies, function(body) {
      return Math.sqrt(Math.pow(mousePos[0] - body.pos[0], 2) +
        Math.pow(mousePos[1] - body.pos[1], 2)) < body.r * 2;
    });
  }

  return {
    begin: setup,
    resize: resize,
    onMouseMove: onMouseMove,
    onKeyPress: onKeyPress
  };
};
