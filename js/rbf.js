var RBF = function() {
  var centers, ws, ys;
  //var sigma = 0.01;
  var distance = function(pnt1, pnt2) {
    var sum = 0;
    if (!pnt1.length)
      return Math.sqrt(Math.pow(pnt1 - pnt2, 2));
    for (var i = 0; i < pnt1.length; i++) {
      sum += (Math.pow(pnt1[i] - pnt2[i], 2));
    }
    return Math.sqrt(sum);
  };

  //gaussian
  var kernel = function(pnt1, pnt2) {
    var r = distance(pnt1, pnt2);
    if (r === 0) return 0;
    var val = 1e-6/(r*r)
    return val;
  };

  this.compileSync = function(cents, y_vals) {
    if (!cents || cents.length === 0) {
      console.error('bad centers array :/');
      return [];
    }

    if (!cents.every(function(element) {
        return element.length === cents[0].length;
      })) {
      console.error('centers must have same dimensions :/');
      return [];
    }

    centers = cents.slice();
    ys = y_vals.slice();
    ws = [];

    var matrix = [],
      matRow = [];
    var P = [],
      pRow = [];
    for (var i = 0; i < centers.length; i++) {

      matRow = [];
      pRow = [1];
      for (var k = 0; k < centers[i].length; k++) {
        pRow.push(centers[i][k]);
      }

      for (var j = 0; j < centers.length; j++) {
        matRow.push(kernel(centers[i], centers[j]));
      }
      P.push(pRow);
      matrix.push(matRow.concat(pRow));

    }

    var pT = $M(P).transpose();

    var newRows = pT.elements.map(function(row) {
      for (var i = row.length; i < matrix[0].length; i++) {
        row.push(0);
      }
      return row;
    });

    for (var i = 0; i < newRows.length; i++) {
      matrix.push(newRows[i]);
      ys.push(0);
    }

    ws = this._solve(ys, matrix);

    return ws !== undefined;
  };

  this.compile = function(cents, y_vals, cb) {

    setTimeout(function() {
      if (!cents || cents.length === 0) {
        cb('bad centers array :/');
        return;
      }

      if (!cents.every(function(element) {
          return element.length === cents[0].length;
        })) {
        cb('centers must have same dimensions :/');
        return;
      }

      centers = cents.slice();
      ys = y_vals.slice();
      ws = [];

      var matrix = [],
        matRow = [];
      for (var i = 0; i < centers.length; i++) {
        matRow = [];
        for (var j = 0; j < centers.length; j++) {
          matRow.push(kernel(centers[i], centers[j]));
        }
        matrix.push(matRow);
      }

      ws = this._solve(ys, matrix);

      if (!ws) {
        cb('rbf failed to compile with given centers./nCenters must be unique :/');
        return;
      }

      cb();

    }.bind(this), 0);

  };

  this._solve = function(b, x) {
    //a*x = b
    //a = b * x^-1
    //L = [K p]
    //    [pT 0]
    //L (W | a1 a2 a3) = Y
    var X = $M(x);
    var B = $V(b);
    X = X.inverse();
    if (!X) {
      return;
    }
    return X.multiply(B);
  };

  this.getValue = function(pnt) {
    var result = 0,
      i = 0;
    for (i = 0; i < centers.length; i++) {
      result += Number(ws.elements[i]) * kernel(pnt, centers[i]);
    }
    result += Number(ws.elements[centers.length]);
    for (i = 0; i < pnt.length; i++) {
      result += pnt[i] * Number(ws.elements[centers.length + (i + 1)]);
    }
    return result;
  };

  this.getValues = function(pnts, cb) {
    setTimeout(function() {
      var resultArr = pnts.map(function(pnt) {
        return this.getValue(pnt);
      }, this);
      cb(null, {
        points: pnts,
        ys: resultArr
      });
    }.bind(this), 0);
  };

  this.getValuesSync = function(pnts) {
    var resultArr = pnts.map(function(pnt) {
      return this.getValue(pnt);
    }, this);
    return {
      points: pnts,
      ys: resultArr
    };
  };
};
