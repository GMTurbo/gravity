//first get all the forces
// foreach body1 in space
//  foreach body2 in space
//

var _ = require('lodash');

var Gravity = function(params) {
  params = params || {};
  params = _.defaults(params, {
    gravity: 6.67e-11,
    bodies: {}
  });

  this.gravity = params.gravity;
  this.bodies = params.bodies;
};

Gravity.prototype.start = function() {

  var inc = 0;

  _.forEach(this.bodies, function(b) {
    b.f = {x:0, y:0};
  });

  for (var i = 0, length = this.bodies.length; i < length; i++) {
    for (var j = 0; j < length; j++) {
      if (i == j) continue;
      inc = this.step(this.bodies[i], this.bodies[j]);
      this.bodies[i].f.x += inc.x;
      this.bodies[i].f.y += inc.y;
    }
  }

  console.dir(this.bodies);
};

Gravity.prototype.step = function(b1, b2) {
  var f = this.gravity * (b1.m * b2.m) / this.getDistance(b1.pos, b2.pos);
  var angle = Math.atan2(b1.pos.x - b2.pos.x, b1.pos.y - b2.pos.y);
  return {
    x: f * Math.cos(angle),
    y: f * Math.sin(angle)
  };
};

Gravity.prototype.getDistance = function(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
};

var Body = function(params) {
  params = params || {};
  params = _.defaults(params, {
    pos: {
      x: 0,
      y: 0
    },
    m: 1,
    f: {
      x: 0,
      y: 0
    },
    v: {
      x: 0,
      y: 0
    }
  });
  this.pos = params.pos,
    this.m = params.m,
    this.f = params.f,
    this.v = params.v;
};


(new Gravity({
  bodies: [
    new Body({m:100000}),
    new Body({
      pos: {
        x: 100,
        y: 100
      },
      m: 100000
    }),
    new Body({
      pos: {
        x: 0,
        y: 50
      },
      m: 200000
    })
  ]
})).start();
