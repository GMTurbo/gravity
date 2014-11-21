$(document).ready(function() {

  window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  var isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };

  var field = new GravityField({
    width: $('#space').width(),
    height: $('#space').height(),
    canvas: document.getElementById('space-content'),
    reqAnimationFrame: window.requestAnimationFrame,
    isMobile: isMobile.any()
  });

  field.begin();

  var mouseDown1 = 1,
    mouseDown2 = 0;

  $(window).on("mousemove", function(event) {
    if (mouseDown1 || mouseDown2) {
      field.onMouseMove({
        x: event.pageX,
        y: event.pageY,
        mouseDown1: mouseDown1,
        mouseDown2: mouseDown2
      });
    }
  });

  $(window).on("keypress", function(event) {
    field.onKeyPress({
      keyCode: event.keyCode
    });
  });
  //
  $(window).resize(function() {

    field.resize({
      width: $('#space').width(),
      height: $('#space').height()
    });

  });
});
