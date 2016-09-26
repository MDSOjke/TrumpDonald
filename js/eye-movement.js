TRUMP.eyes = (function(){
  var leftEye,
      rightEye;

  function eyeObjSetup(eyeQueryString){
    var eyeObj = {};
    eyeObj.width = $(eyeQueryString).width();
    eyeObj.height = $(eyeQueryString).height()/2+5;
    eyeObj.centerX = $(eyeQueryString).offset().left + eyeObj.width/2;
    eyeObj.centerY = $(eyeQueryString).offset().top + eyeObj.height/2;
    eyeObj.iris = $(eyeQueryString).find('.iris')[0];
    eyeObj.reflection = $(eyeQueryString).find('.reflection')[0];

    return eyeObj;
  }
  function irisPos(eyeObj) {
    var trumPos = TRUMP.trumpet.tP,
        pageHeight = TRUMP.main.props.pageHeight,
        edX = trumPos[0] - eyeObj.centerX,
        edY = trumPos[1] - eyeObj.centerY,
        eAtan = (eyeObj == leftEye) ? Math.atan2(-edY, -edX) : Math.atan2(-edY, edX),
        res = {};
    res.x = -(eyeObj.width-28*(pageHeight/1080)) * Math.cos(eAtan) / 2;
    res.y = -(eyeObj.height-12*(pageHeight/1080)) * Math.sin(eAtan) / 2;
    (eyeObj == rightEye) ? res.x = -res.x : 0 ;
    return res
  }
  function eyeMove(eyeObj, irisPos) {
    var tl = new TimelineLite;

    tl.to(eyeObj.iris, 0, {
        x: irisPos.x,
        y: irisPos.y
    }).to(eyeObj.reflection, 0, {
        x: irisPos.x/10,
        y: irisPos.y/10
    });
  }
  function bothEyesMove() {
    eyeMove(leftEye, irisPos(leftEye));
    eyeMove(rightEye, irisPos(leftEye))
  }
  function eyesInit() {
    leftEye = eyeObjSetup('.left-eye');
    rightEye = eyeObjSetup('.right-eye');
  }
  function criosFix(){
    var size = TRUMP.main.props.pageHeight*9/100;
    $('.iris').width(size);
    $('.iris').height(size);
    $('.iris').css({
      'margin-top': -size/2+'px',
      'margin-left': -size/2+'px'
    });
  }
    criosFix();
    eyesInit();
  return{
    crF: criosFix,
    eyesRepos: bothEyesMove,
    eI: eyesInit
  }
})();
