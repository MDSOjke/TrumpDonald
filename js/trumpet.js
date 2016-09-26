TRUMP.trumpet = (function(){
  var props = {
    body : $('.trump'),
    trumpet: $('.trumpet'),
    rotCenter : [],
    pi : Math.PI,
    center : [],
    curPos : [],
    trumPos : [],
    parPos : [],
    angle: 0
  }

  function trumpetInit(){
    props.center[0] = props.body.offset().left;
    props.center[1] = props.body.offset().top + props.body.height()/5*1.4;
    props.trumpet.css('left', props.center[0]+'px');
    props.trumpet.css('top', props.center[1]+'px');
    if(TRUMP.trumpet){
      TRUMP.trumpet.cP[0] = props.center[0];
      TRUMP.trumpet.cP[1] = props.center[1];
    }
  }

  function trumpetDraw() {
    if(props.angle+45 > 270 || props.angle+45 < 90){
      props.trumpet.addClass('flipped');
    } else {
      props.trumpet.removeClass('flipped');
    }
    TweenMax.to(props.trumpet, 0, {
      rotation: props.angle
    });
  }

  function debugFlick() {
    var tWidth = (TRUMP.main.props.screenSize > 768) ? TRUMP.main.props.pageHeight*103.888889/100 : TRUMP.main.props.pageHeight*88.305555/100;
    props.body.removeAttr('style');
    TweenLite.to(props.body, 0, {width: tWidth, y:0 ,left: Math.round(props.body.offset().left/2)*2});
  }

  function repos(){
    var dX = props.center[0]-props.curPos[0],
        dY = props.center[1]-props.curPos[1],
        atan = Math.atan2(dY, dX),
        angle = props.angle = 180 + 180/props.pi*(atan - props.pi/4),
        pointDist = 500*(TRUMP.main.props.pageHeight/1080);

    props.trumPos[0] = -pointDist*Math.cos(atan);
    props.trumPos[1] = -pointDist*Math.sin(atan);
    props.trumPos[0] = (Math.abs(props.trumPos[0]) > 1) ? props.trumPos[0] : 0;
    props.trumPos[1] = (Math.abs(props.trumPos[1]) > 1) ? props.trumPos[1] : 0;
    props.trumPos[0] = props.trumPos[0] + props.center[0];
    props.trumPos[1] = props.trumPos[1] + props.center[1];

    trumpetDraw();
    TRUMP.trumpet.tP = props.trumPos;
  }

  function reposCall(coordsX, coordsY) {
    props.curPos = [coordsX, coordsY];
    repos();
    TRUMP.eyes.eyesRepos();
    TRUMP.hair.hACH(props.angle);
  }

  function criosFix(){
    $('.trumpet').width(TRUMP.main.props.pageHeight*((TRUMP.main.props.screenSize > 767) ? 77.777778 : 74.074074)/100);
  }

    criosFix();
    trumpetInit();

  return {
    crF: criosFix,
    tP: props.trumPos,
    cP: props.center,
    an: props.angle,
    re: reposCall,
    dF: debugFlick,
    tI: trumpetInit
  }
})();
