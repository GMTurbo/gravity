var Satellite = function(params) {
  params = params || {};

  this.pos = params.pos || [0, 0];
  this.r = params.r || 10;
  this.dx = params.dx || -2 + Math.random() * 4;
  this.dy = params.dy || -2 + Math.random() * 4;
  this.maxX = params.maxX || 100;
  this.maxY = params.maxY || 100;
  this.velocity = ~~(Math.random() * 10);
  this.maxX -= this.r;
  this.maxY -= this.r;
};

Satellite.prototype.draw = function(context) {
  var pnt = this.pos;
  //*********************
  context.beginPath();
  context.lineWeight = this.wall ? 10 : 1;
  context.fillStyle = this.getColor();
  context.arc(pnt[0] - this.r, pnt[1] - this.r, this.r, 0, 2 * Math.PI, false);
  context.closePath();
  context.fill();
  context.stroke();
};

Satellite.prototype.step = function(rbf, bodies) {
  this.val = rbf.getValue(this.pos);
  var pos = this.pos;
  var vec = [0, 0];
  var max = [-1e-9, -1e-9],
    min = [1e9, 1e9];
  _.forEach(bodies, function(body) {
    vec[0] += body.pos[0] - pos[0];
    if (min[0] > vec[0]) min[0] = vec[0];
    else if (max[0] < vec[0]) max[0] = vec[0];
    vec[1] += body.pos[1] - pos[1];
    if (min[1] > vec[1]) min[1] = vec[1];
    else if (max[1] < vec[1]) max[1] = vec[1];
  });
  var mag = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
//  this.vec[0] = vec[0]/mag;
//  this.vec[1] = vec[1]/mag;
  this.pos[0] += this.velocity*(vec[0]/mag);
  this.pos[1] += this.velocity*(vec[1]/mag);
};

Satellite.prototype.getColor = function() {
  return 'rgb(255,128,128)';
};

Satellite.prototype.getShadowColor = function() {
  return 'rgba(0,0,0,10)';
};
