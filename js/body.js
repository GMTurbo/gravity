var Body = function(params) {
  params = params || {};

  this.pos = params.pos || [0, 0];
  this.r = params.r || 10;
  this.mass = params.mass || 100 * this.r;
  this.dx = params.dx || -1 + Math.random() * 2 ;
  this.dy = params.dy || -1 + Math.random() * 2 ;
};

Body.prototype.draw = function(context) {
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

Body.prototype.step = function() {
  this.pos[0]+=this.dx;
  this.pos[1]+=this.dy;
};

Body.prototype.getColor = function() {
  return 'rgb(255,255,255)';
};

Body.prototype.getShadowColor = function() {
  return 'rgba(0,0,0,10)';
};
