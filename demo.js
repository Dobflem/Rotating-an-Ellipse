if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

var M = (function() {

  this.init = function() {
    this.center = { x: 200, y: 200 };
    this.circle = null;
    this.height = 40;
    this.index = 0;
    this.interval_speed = 100;
    this.paper = null;
    this.segments = 4;
    this.segment_angle = 360 / this.segments;
    this.state = 0;
    this.width = 80;
  };

  this.getCenterPoint = function() {
    return this.center;
  };

  this.getCircle = function() {
    return this.circle;
  };

  this.getHeight = function() {
    return this.height;
  };

  this.getIndex = function() {
    return this.index;
  };

  this.getIntervalSpeed = function() {
    return this.interval_speed;
  };

  this.getPaper = function() {
    return this.paper;
  };

  this.getSegmentAngle = function() {
    return this.segment_angle;
  };

  this.getSegments = function() {
    return this.segments;
  };

  this.getState = function() {
    return this.state;
  };

  this.getWidth = function() {
    return this.width;
  };

  this.incrementIndex = function(amount) {
    this.index += amount;
  };

  this.setCircle = function(circle) {
    this.circle = circle;
  };

  this.setPaper = function(paper) {
    this.paper = paper;
  };

  this.setSegments = function(amount) {
    this.segments = amount;
    this.segment_angle = 360 / this.segments;
    if (amount < 100) {
      this.interval_speed = 100;
    } else if (amount < 500) {
      this.interval_speed = 60;
    } else {
      this.interval_speed = 30;
    }
  };

  this.setState = function(state) {
    this.state = state;
  };

  return {
    getCenterPoint: this.getCenterPoint,
    getCircle: this.getCircle,
    getHeight: this.getHeight,
    getIndex: this.getIndex,
    getIntervalSpeed: this.getIntervalSpeed,
    getPaper: this.getPaper,
    getSegmentAngle: this.getSegmentAngle,
    getSegments: this.getSegments,
    getState: this.getState,
    getWidth: this.getWidth,
    incrementIndex: this.incrementIndex,
    init: this.init,
    setCircle: this.setCircle,
    setPaper: this.setPaper,
    setSegments: this.setSegments,
    setState: this.setState,
    STOPPED: 0,
    RUNNING: 1
  };

})();

var V = (function() {

  this.initCircle = function(point) {
    var paper = M.getPaper();
    M.setCircle(paper.ellipse(point.x, point.y, 10, 10));
  };

  this.initEllipse = function() {
    var paper = M.getPaper();
    var center = M.getCenterPoint();
    var width = M.getWidth();
    var height = M.getHeight();
    paper.ellipse(center.x, center.y, width, height);
  };

  this.setButtonText = function(txt) {
    $("#btnStart").html(txt);
  };

  this.updateCirclePosition = function(point) {
    var circle = M.getCircle();
    circle.attr({
      cx: point.x,
      cy: point.y
    });
  };

  return {
    initCircle: this.initCircle,
    initEllipse: this.initEllipse,
    setButtonText: this.setButtonText,
    updateCirclePosition: this.updateCirclePosition
  };

})();

var C = (function() {

  this.init = function() {
    M.init();
    M.setPaper(new Raphael("canvas", "100%", "100%"));
    V.initEllipse();
    V.initCircle(getXY());
    $("#inputSegments").val(4);
  };

  this.getXY = function() {
    var index = M.getIndex();
    var segment_angle = M.getSegmentAngle();
    var segments = M.getSegments();
    var angle = segment_angle * (index % segments);
    var width = M.getWidth();
    var height = M.getHeight();
    var center = M.getCenterPoint();

    return {
      x: (center.x + (width  * Math.cos(angle.toRad()))),
      y: (center.y + (height * Math.sin(angle.toRad())))
    }
  };

  this.start = function() {
    this.interval = setInterval(function() {
      this.updateCirclePosition();
    }, M.getIntervalSpeed());
    M.setState(M.RUNNING);
    V.setButtonText("Stop");
  };

  this.stop = function() {
    clearInterval(this.interval);
    M.setState(M.STOPPED);
    V.setButtonText("Start");
  };

  this.updateCirclePosition = function() {
    M.incrementIndex(1);
    V.updateCirclePosition(this.getXY(M.getIndex()));
  };

  return {
    init: this.init,
    start: this.start,
    stop: this.stop
  };

})();

// Run the script when the screen loads
window.onload = function() {

  $("#btnStart").on('click', function() {
    if (M.getState() === M.RUNNING) {
      C.stop();
    } else {
      C.start();
    }
  });

  $("#inputSegments").change(function() {
    M.setSegments(parseInt($(this).val()));
    C.stop();
    C.start();
  });

  // Create our paper
  C.init();

}
