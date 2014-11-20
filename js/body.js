var Body = new function(options) {
  options = options || {};

  this.pos = options.pos || [0, 0];
  this.mass = options.mass || 100;
  this.r = options.r || 10;
};

Body.prototype.draw = function(context) {
  var pnt = this.getCenter();
  //*********************
  context.beginPath();
  context.lineWeight = this.wall ? 10 : 1;
  context.fillStyle = this.getColor();
  context.arc(pnt[0] - r, pnt[1] - r, r, 0, 2 * Math.PI, false);
  context.closePath();
  // context.shadowOffsetX = 0;
  // context.shadowOffsetY = 0;
  // context.shadowBlur = 10;
  context.fill();
  this.wall && context.stroke();
};

Body.prototype.getColor = function() {
  return 'rgba(255,200,0,' + 200 + ')';;
};

Body.prototype.getShadowColor = function() {
  return 'rgba(0,0,0,10)';
};
