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

VectorField.prototype.updateField = function(rbf, bodies){
  //node.val will equal the magnitude
  //you have to new get the unit vector components
  //to do this, you have to get all vectors to
  // every body from the field point
  _.forEach(this.nodes, function(node){
    node.val = rbf.getValue(node.pos);
    var vec = [node.vec[0],node.vec[1]];
    var max = [-1e-9,-1e-9], min = [1e9,1e9];
    _.forEach(bodies, function(body){
      vec[0] += body.pos[0] - node.pos[0];
      if(min[0] > vec[0]) min[0] = vec[0];
      else if(max[0] < vec[0]) max[0] = vec[0];
      vec[1] += body.pos[1] - node.pos[1];
      if(min[1] > vec[1]) min[1] = vec[1];
      else if(max[1] < vec[1]) max[1] = vec[1];
    });



    node.vec[0] = vec[0]/(Math.abs(max[0])+Math.abs(min[0]));
    node.vec[1] = vec[1]/(Math.abs(max[1])+Math.abs(min[1]));
  });

  //dont have node.vec

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
  this.vec = params.vec || [0,0];
};

FieldNode.prototype.draw = function(context, max){
  var pnt = this.pos;
  var scaled = Math.abs(this.val/max);
  var color = this.getColor(scaled);
  //*********************
  context.beginPath();

  context.fillStyle = color;
  context.strokeStyle = color;
  // context.arc(pnt[0] - this.vec[0], pnt[1] - this.vec[1],
  //   Math.sqrt(this.vec[0]*this.vec[0]+this.vec[1]*this.vec[1]), 0, 2 * Math.PI, false);
  //
  var mag = Math.sqrt(this.vec[0]*this.vec[0]+this.vec[1]*this.vec[1]);
  context.moveTo(pnt[0], pnt[1]);
  context.lineTo(pnt[0]+this.vec[0] * scaled * this.width, pnt[1]+this.vec[1] * this.height);
  //context.rect(pnt[0], pnt[1], this.width, this.height);
  //context.font="12px Georgia";
  //context.fillText(this.val.toPrecision(1),pnt[0],pnt[1]);
  context.closePath();
  context.fill();
  context.stroke();
  //  context.stroke();
};

FieldNode.prototype.getColor = function(max){
  return chroma.interpolate('blue', 'red', max);
};
