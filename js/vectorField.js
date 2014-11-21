var VectorField = function(params){
  params = params || {};

  this.width = params.width || 100;
  this.height = params.height || 100;

  this.xRes = params.xRes || 10;
  this.yRes = params.yRes || 10;
  this.maxVal = params.maxVal || 10;
  this.fieldType = params.type || 'color';
  this.maxRange = 0;
  this.nodes = [];

  var stepX = ~~(this.width/this.xRes),
      stepY = ~~(this.height/this.yRes);

  for (var i = 0; i < this.width; i+=stepX) {
    for (var j = 0; j < this.height; j+=stepY) {
      this.nodes.push(new FieldNode({
        pos: [i,j],
        width: stepX,
        height: stepY,
        maxVal: this.maxVal
      }));
    }
  }
};

VectorField.prototype.updateField = function(rbf){
  _.forEach(this.nodes, function(node){
    node.val = rbf.getValue(node.pos);
  });
};

VectorField.prototype.draw = function(context){
  var max = -1e9, min = 1e9;

  _.forEach(this.nodes, function(node){
    if(node.val > max) max = node.val;
    else if(node.val < min) min = node.val;
  });

  for(var i = 0, length = this.nodes.length; i < length; i++){
    this.nodes[i].draw(context, Math.abs(max) + Math.abs(min));
  }
};

var FieldNode = function(params){
  params = params || {};
  this.pos = params.pos || [0,0];
  this.width = params.width || 10;
  this.maxVal = params.maxVal || 10;
  this.height = params.height || 10;
  this.fieldType = params.type || 'line';
  this.val = params.val || ~~(Math.random() * 100);
};

FieldNode.prototype.draw = function(context, max){
  var pnt = this.pos;
  //*********************
  context.beginPath();
  context.fillStyle = this.getColor(max);
  //context.arc(pnt[0] - r, pnt[1] - r, r, 0, 2 * Math.PI, false);
  context.rect(pnt[0], pnt[1], this.width, this.height);
  //context.font="12px Georgia";
  //context.fillText(this.val.toPrecision(1),pnt[0],pnt[1]);
  context.closePath();
  context.fill();
//  context.stroke();
};

FieldNode.prototype.getColor = function(max){
  return chroma.interpolate('blue', 'red', Math.abs(this.val/max));
};
