var Body = function(params) {
  params = params || {};

  this.pos = params.pos || [0, 0];
  this.r = params.r || 10;
  this.mass = params.mass || 1e6;
  this.dx = params.dx || -2 + Math.random() * 4 ;
  this.dy = params.dy || -2 + Math.random() * 4 ;
  this.maxX = params.maxX || 100;
  this.maxY = params.maxY || 100;
  this.maxX -= this.r;
  this.maxY -= this.r;
  this.locked = false;
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
  //context.stroke();
};

Body.prototype.step = function() {
  if(this.pos[0] + this.dx > this.maxX || this.pos[0] + this.dx < 0)
    this.dx*=-1;
  if(this.pos[1] + this.dy > this.maxY || this.pos[1] + this.dy < 0)
    this.dy*=-1;
  if(this.locked)
    return;
  this.pos[0]+=this.dx;
  this.pos[1]+=this.dy;
};

Body.prototype.getColor = function() {
  return 'rgb(128,128,128)';
};

Body.prototype.getShadowColor = function() {
  return 'rgba(0,0,0,10)';
};
