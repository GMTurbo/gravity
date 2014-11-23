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
    satellites = [],
    vecField = null,
    showField = true,
    run = true,
    scale = 10,
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
    showField && vecField.draw(context);
    if (satellites.length > 0) {
      _.forEach(satellites, function(sat) {
        sat.draw(context);
      });
    }
    for (var i = 0; i < bodies.length; i++) {
      bodies[i].draw(context);
    }

  }

  function updateSystem() {
    if (run) {
      updateBodies();
      updateField();
      //updateSats();
    }
    updateSats();
    drawSystem();
    reqFrame(updateSystem);
  }

  function updateBodies() {
    for (var i = 0; i < bodies.length; i++) {
      bodies[i].step();
    }
  }

  function updateField() {

    //First solve for the forces f = Gm1m2/r^2
    //then get all pointing vectors from field point to bodies
    // magnitude is force and next trajectory unit vector is
    // sum vx, sum vy
    var target = bodies.map(function(body) {
      return _.reduce(bodies, function(force, curr) {
        if (body.pos[0] != curr.pos[0] && body.pos[1] != curr.pos[1])
          return 6.67e-11 * (curr.mass * body.mass) /
            Math.abs(Math.pow(curr.pos[0] - body.pos[0], 2) + Math.pow(curr.pos[1] - body.pos[1], 2));
      }, 0);
    });
    var locations = bodies.map(function(body) {
      return [body.pos[0] - body.r, body.pos[1] - body.r];
    });
    if (rbf.compileSync(locations, target))
      vecField.updateField(rbf, bodies);
  }

  function updateSats() {
    _.forEach(satellites, function(sat) {
      sat.step(rbf, bodies);
    });
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
    }));
  }

  function addSat(pos) {
    satellites.push(new Satellite({
      pos: pos,
      r: 5 + ~~(Math.random() * 5),
      maxX: width,
      maxY: height
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
    } else if (e.keyCode == 102) {
      showField = !showField;
    } else if (e.keyCode == 115) {
      addSat(getRandomPoint(2, [
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
