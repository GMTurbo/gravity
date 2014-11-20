var VectorField = function(params){
  params = params || {};

  this.xRes = params.xRes || 100;
  this.yRes = params.yRes || 100;
  this.fieldType = params.type || 'color';
  this.nodes = [];
};

VectorField.prototype.updateField = function(fieldData){

};

VectorField.prototype.draw = function(context){

  var pnt = [];

  for(var i = 0, length = this.nodes.length; i < length; i++){
    pnt = this.nodes[i].pos;
    context.beginPath();

    context.fillStyle = this.nodes[i].getColor();
    //context.shadowColor = this.nodes[i].getShadowColor();
    context.arc(pnt[0] - r, pnt[1] - r, r, 0, 2 * Math.PI, false);

    context.closePath();
    context.fill();
  }

};

var FieldNode = function(params){
  params = params || {};

  this.xRes = params.xRes || 100;
  this.yRes = params.yRes || 100;
  this.fieldType = params.type || 'line';
  this.val = params.val || ~~(Math.random() * 100);
};

FieldNode.prototype.interpolateColor = function(minColor,maxColor,maxDepth,depth){

  function d2h(d) {return d.toString(16);}
  function h2d(h) {return parseInt(h,16);}

  if(depth == 0){
    return minColor;
  }
  if(depth == maxDepth){
    return maxColor;
  }

  var color = "#";

  for(var i=1; i <= 6; i+=2){
    var minVal = new Number(h2d(minColor.substr(i,2)));
    var maxVal = new Number(h2d(maxColor.substr(i,2)));
    var nVal = minVal + (maxVal-minVal) * (depth/maxDepth);
    var val = d2h(Math.floor(nVal));
    while(val.length < 2){
      val = "0"+val;
    }
    color += val;
  }
  return color;
};

FieldNode.prototype.draw = function(context){
  var pnt = this.pos;
  //*********************
  context.beginPath();
  context.fillStyle = this.getColor();
  context.arc(pnt[0] - r, pnt[1] - r, r, 0, 2 * Math.PI, false);
  context.closePath();
  context.fill();
  context.stroke();
};

FieldNode.prototype.getColor = function(context){
  return this.interpolateColor("00EEDD","008000", 100, this.val);
};
