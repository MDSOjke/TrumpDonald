var body = $('.trump'),
    pageHeight = window.innerHeight,
    rotCenter = [],
    pi = Math.PI,
    center = [],
    curPos = [],
    trumPos = [],
    parPos = [],
    leftEye = {},
    rightEye = {},
    mouseDown = false,
    sequenceStarted = false,
    backSequenceStarted = false,
    dropOffTimer,
    waitingMouseUp = false,
    iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    touchTest = 'ontouchstart' in window || navigator.maxTouchPoints,
    eventList = [],
    loadCounter = 0,
    loadState = false;

// Canvas

var canvas,
    ctx,
    particles = [],
    particlesNum = 8,
    startArea = [],
    endArea;

// Head

var hairAngle = 1,
    hairImgPool = [],
    canvasPool = [],
    screenSize = window.screen.width,
    gtx = document.getElementById('hair-canvas').getContext('2d'),
    imgRes;

function bodyClasses(){
  (touchTest)?$('body').addClass('touch'):0;
}

function init(){
  debugFlick();
  center[0] = body.offset().left;
  center[1] = body.find('.body-cont').offset().top + body.height()/5*1.4;
  $('.trumpet').css('left', center[0]+'px');
  $('.trumpet').css('top', center[1]+'px');
  rotCenter = [center[0], center[1]];
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  endArea = [rotCenter[0]-100, rotCenter[1]-100, rotCenter[0]+100, rotCenter[1]+100];
  eyePropSet(leftEye, '.left-eye');
  eyePropSet(rightEye, '.right-eye');
}
function debugFlick() {
  body.removeAttr('style');
  TweenLite.to(body, 0, {y:0 ,left: Math.round(body.offset().left/2)*2});
}
function hairCanvasesInit() {
  var canMP = /*(screenSize > 768) ? 4 : */2,
      cW = canMP*parseInt($('.idle-cont img').css('width')),
      cH = 6*parseInt($('.idle-cont img').css('height'));

  function createCanvas(w, h) {
      var canvas = document.createElement('canvas');
      canvas.setAttribute('width', cW);
      canvas.setAttribute('height', cH);
      return canvas;
  }
  $('#hair-canvas').prop('width', cW);
  $('#hair-canvas').prop('height', cH);
  imgRes = (screenSize > 768) ? '-safari-08' : '-safari-05';
  for (var iCr = 0; iCr < 16; iCr++) {
    hairImgPool[iCr] = new Image();
    hairImgPool[iCr].onload = function () {
      if(screenSize > 768){
        var iNum = hairImgPool.indexOf(this);
        canvasPool[iNum] = createCanvas(cW,cH);
        canvasPool[iNum].getContext('2d').drawImage(this,0,0,canvasPool[iNum].width,canvasPool[iNum].height);
        gtx.clearRect(0,0,$('#hair-canvas').attr('width'),$('#hair-canvas').attr('height'));
        gtx.drawImage(canvasPool[iNum],0,0);
      }
      loadCounter++;
      if(loadCounter === 16 && loadState){
        loadSequence();
      }
    }
    hairImgPool[iCr].src = 'assets/hair'+imgRes+'/angle_'+((iCr<9)?'0':'')+(iCr+1)+'.png';
  }
}

/****************************
Hair and eyes movement functions
*****************************/

function eyePropSet(eyeObj, eyeQueryString){
  eyeObj.width = $(eyeQueryString).width();
  eyeObj.height = $(eyeQueryString).height()/2+5;
  eyeObj.centerX = $(eyeQueryString).offset().left + eyeObj.width/2;
  eyeObj.centerY = $(eyeQueryString).offset().top + eyeObj.height/2;
  eyeObj.iris = $(eyeQueryString).find('.iris')[0];
}
function irisPos(eyeObj, angle) {
  var edX = trumPos[0] - eyeObj.centerX,
      edY = trumPos[1] - eyeObj.centerY,
      eAtan = (eyeObj == leftEye) ? Math.atan2(-edY, -edX) : Math.atan2(-edY, edX),
      res = {};

  //1400w 1030h
  res.x = -(eyeObj.width-28*(pageHeight/1080)) * Math.cos(eAtan) / 2;
  res.y = -(eyeObj.height-12*(pageHeight/1080)) * Math.sin(eAtan) / 2;
  (eyeObj == rightEye) ? res.x = -res.x : 0 ;
  return res
}

function hairAngleChangeHandler(angle) {
    if (hairAngle != Math.floor((angle+45-11.25)/22.5)+2) {
      //TweenMax.to($('.hair .angle-cont.angle-'+hairAngle), 0, {y: -10000})
      hairAngle = Math.floor((angle+45-11.25)/22.5)+2;
      if(hairAngle<2 || hairAngle>16){
        hairAngle = 1;
      };
      var hDims = [$('#hair-canvas').attr('width'),$('#hair-canvas').attr('height')];
      gtx.clearRect(0,0,hDims[0],hDims[1]);
      if(screenSize > 768){
        gtx.drawImage(canvasPool[hairAngle-1],0,0);
      } else {
        gtx.drawImage(hairImgPool[hairAngle-1],0,0,hDims[0],hDims[1]);
      }
      // if(mouseDown || sequenceStarted || backSequenceStarted){
      //
      // }
    }
}

function repos(){
  var dX = center[0]-curPos[0],
      dY = center[1]-curPos[1],
      atan = Math.atan2(dY, dX),
      angle = 180 + 180/pi*(atan - pi/4),
      pointDist = 500*(pageHeight/1080),
      trumWrapper = $('.trumpet');

  trumPos[0] = -pointDist*Math.cos(atan);
  trumPos[1] = -pointDist*Math.sin(atan);
  parPos[0] = -330*(pageHeight/1080)*Math.cos(atan) + center[0];
  parPos[1] = -330*(pageHeight/1080)*Math.sin(atan) + center[1];
  trumPos[0] = (Math.abs(trumPos[0]) > 1) ? trumPos[0] : 0;
  trumPos[1] = (Math.abs(trumPos[1]) > 1) ? trumPos[1] : 0;
  trumPos[0] = trumPos[0] + center[0];
  trumPos[1] = trumPos[1] + center[1];
  startArea = [parPos[0]+70-30, parPos[1]+40*(pageHeight/1080)-30, parPos[0]+70+30, parPos[1]+40*(pageHeight/1080)+30]

  //Trumpet movement

  if(angle+45 > 270 || angle+45 < 90){
    trumWrapper.addClass('flipped');
  } else {
    trumWrapper.removeClass('flipped');
  }
  TweenMax.to(trumWrapper, 0, {
    rotation: angle
  });

  //Eyes movement

  var lIrisPos = irisPos(leftEye, angle),
      rIrisPos = irisPos(rightEye, angle);

  TweenMax.to($('.left-eye .iris'), 0, {
      x: lIrisPos.x,
      y: lIrisPos.y
  });
  TweenMax.to($('.right-eye .iris'), 0, {
      x: rIrisPos.x,
      y: rIrisPos.y
  });
  TweenMax.to($('.left-eye .reflection'), 0, {
      x: rIrisPos.x/10,
      y: rIrisPos.y/10
  });
  TweenMax.to($('.right-eye .reflection'), 0, {
      x: rIrisPos.x/10,
      y: rIrisPos.y/10
  });

  //Hair movement

  hairAngleChangeHandler(angle);
}

/****************************
Trumpet particles
*****************************/

canvas = document.getElementById('can');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext( '2d' );

function randomIt(min, max){
  return Math.floor(Math.random()*(max-min)+min)+1;
}
function propSet(p){
  p.startPoint = {
    x: randomIt(startArea[0], startArea[2]),
    y: randomIt(startArea[1], startArea[3])
  }
  p.endPoint = {
    x: randomIt(endArea[0], endArea[2]),
    y: randomIt(endArea[1], endArea[3])
  }
  p.x = p.startPoint.x;
  p.y = p.startPoint.y;
  p.size = 1;
  p.speed = randomIt(100,200)/1000;
  p.delay = randomIt(0, 100)/1000;
  p.opacity = randomIt(5,20)/100;
}
function resetProp(p) {
  p.x = -1000;
  p.y = -1000;
  p.delay = 0;
}
function tweenRun(p){
  TweenMax.to(p, p.speed, {
    delay: p.delay,
    x: p.endPoint.x,
    y: p.endPoint.y,
    ease: Power0.easeNone,
    onComplete: function(){
     resetProp(p);
     propSet(p);
     tweenRun(p);
    }
  });
}
function loop(){
  ctx.clearRect(0, 0, canvas.attr('width'), canvas.attr('height'));
  for(var o = 0; particlesNum > o; o++){
    ctx.beginPath();
    ctx.arc(particles[o].x, particles[o].y, particles[o].size, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(225,225,225,'+particles[o].opacity+')';
    ctx.fill();
  }
}
function tweenInit() {
  for (var i = 0; particlesNum > i; i++){
    p = particles[i] = {};

    propSet(p);

    tweenRun(p);
  }

  TweenMax.ticker.addEventListener('tick', loop);
}
function tweenStop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  TweenLite.ticker.removeEventListener("tick", loop);
}

/****************************
Sounds setup
*****************************/

var trumpetS = [],
    soundCounter = 0;

function getPoint(num) {
  var pointPos;
  switch (num+1) {
    case 1:
      pointPos = 5;
      break;
    case 2:
      pointPos = 5;
      break;
    case 3:
      pointPos = 5;
      break;
    case 4:
      pointPos = 5;
      break;
    case 5:
      pointPos = 5;
      break;
    case 6:
      pointPos = 5;
      break;
    default:
  }
  return pointPos;
}
for(var sI = 0; sI< 6; sI++){
  var objCounter = sI;
  trumpetS[sI] = {};
  trumpetS[sI].pToBS = getPoint(sI);
  trumpetS[sI].aud = new Howl({
    urls: ['assets/sounds/sound-'+(sI+1)+'.mp3','assets/sounds/sound-'+(sI+1)+'.m4a ','assets/sounds/sound-'+(sI+1)+'.ogg','assets/sounds/sound-'+(sI+1)+'.wav'],
    volume: 1,
    onload: function(){
      console.log(objCounter);
    },
    onplay: function () {
      forwardSequence();
      trumpetS[this.objN].timer = setTimeout(function () {
        waitingMouseUp = true;
        backSequence();
      }, trumpetS[this.objN].pToBS*1000);
    }
  });
  trumpetS[sI].aud.objN = sI;
}

/****************************
Hair movement animation and functions
*****************************/

var hair = $('.hair #hair-canvas'),
    counter = 0,
    tlUp = new TimelineMax({
      onComplete: hairBlow,
      onCompleteParams:['{self}'],
      onReverseComplete: classDrop,
      onCompleteParams:['{self}'],
      paused:true
    }),
    tlBlow = new TimelineMax({paused:true}),
    xMax = /*(screenSize > 768)? '-75%' : */'-50%',
    stepsNum = /*(screenSize > 768)? 3 :*/ 1;

tlUp.to(hair, 0.5/12*1,
    {
      x: '0%',
      y: '0%',
      ease: SteppedEase.config(1)
    })
  .to(hair, 0.5/12*stepsNum,
    {
      x: xMax,
      y: '0%',
      ease: SteppedEase.config(stepsNum)
    })
  .to(hair, 0.5/12*1,
    {
      x: '0%',
      y: -100/6*1+'%',
      ease: SteppedEase.config(1)
    }
  )
  .to(hair, 0.5/12*stepsNum,
    {
      x: xMax,
      y: -100/6*1+'%',
      ease: SteppedEase.config(stepsNum)
    }
  )
  .to(hair, 0.5/12*1,
    {
      x: '0%',
      y: -100/6*2+'%',
      ease: SteppedEase.config(1)
    }
  )
  .to(hair, 0.5/12*stepsNum,
    {
      x: xMax,
      y: -100/6*2+'%',
      ease: SteppedEase.config(stepsNum)
    }
  )
for(var seq = 0; seq < 50; seq++){
  var x = (Math.random() < 0.5) ? ['0%',xMax] : [xMax,'0%'],
      y = -Math.floor(Math.random()*3+3)*100/6;
  tlBlow.to(hair, 0.5/12*1,
      {
        x: x[0],
        y: y+'%',
        ease: SteppedEase.config(1)
      }
    )
    .to(hair, 0.5/12*stepsNum,
      {
        x: x[1],
        y: y+'%',
        ease: SteppedEase.config(stepsNum)
      }
    )
}
function hairLift() {
  tlUp.timeScale(2).play();
}
function hairBlow() {
  tlBlow.play().repeat(-1);
}
function hairBack() {
  tlBlow.pause();
  tlUp.timeScale(1).reverse();
}

/****************************
Init functions
*****************************/

// if(touchTest){
//   $(function() {
//     FastClick.attach(document.body);
//   });
// }

bodyClasses();

hairCanvasesInit();

/****************************
Event functions and listeners
*****************************/

function loadSequence(){
  var hDims = [$('#hair-canvas').attr('width'),$('#hair-canvas').attr('height')];
  gtx.clearRect(0,0,hDims[0],hDims[1]);
  if(screenSize > 768){
    gtx.drawImage(canvasPool[hairAngle-1],0,0);
  } else {
    gtx.drawImage(hairImgPool[hairAngle-1],0,0,hDims[0],hDims[1]);
  }
  var trumpetTl = new TimelineLite();
  trumpetTl.to($(".container"), 0.5, {opacity: 0, ease: Power0.easeIn, onComplete: function () {
    $(".container").hide();
  }})
  .to([$(".trump"), $(".text")], 1, {x: 0, y:0, ease: Power4.easeOut, onComplete: function () {
    curPos[0] = 1000000;
    curPos[1] = (window.innerWidth < 768) ? -1000000 : 0;
    init();
    repos();
    TweenMax.to($(".trumpet"), 0.5, {x: 0, y:0, ease: Elastic.easeOut.config(1.5,0.2), onComplete: function () {
      $('body').on(eventList[1], function(e){
        e.preventDefault();
        requestAnimationFrame(function(){
          curPos[0] = (touchTest) ? e.originalEvent.changedTouches[0].pageX : e.pageX;
          curPos[1] = (touchTest) ? e.originalEvent.changedTouches[0].pageY : e.pageY;
          repos();
        });
      });
    }});
  }});
  $('a').hover(function () {
    $(this).parent().siblings().css('background-position', '66.666666% 0');
  }, function () {
    $(this).parent().siblings().removeAttr('style');
  });
  $(window).on('orientationchange resize', function(e){
    resizeHandler();
  })
}
function classDrop(){
  backSequenceStarted = false;
  TweenMax.to($('.hair .angle-cont-can'), 0, {y: -10000});
  TweenMax.to($('.hair .idle-cont'), 0, {y: 0});
}
function forwardSequence() {
  TweenLite.to($('.hair .idle-cont'), 0, {y: -10000});
  TweenLite.to($('.hair .angle-cont-can'), 0, {y: 0});

  hairLift();

  //tweenInit();

  TweenLite.to($('.trump .body-cont .body'), 0, {x: '0%'});

  TweenLite.to($('.trumpet .trumpet-inner-wrapper'), 0.2, {x: '3%', y: '3%', ease: Elastic.easeOut});

  setTimeout(function () {
    sequenceStarted = false;
  }, 500);
}
function backSequence() {
  if(sequenceStarted){
    setTimeout(function (argument) {
      backSequence();
    }, 50)
  } else {
    backSequenceStarted = true;

    stopSound();

    hairBack();

    setTimeout(function () {
      tweenStop();
    }, 200);

    TweenLite.to($('.trump .body-cont .body'), 0, {x: '-50%'});

    TweenMax.to($('.trumpet .trumpet-inner-wrapper'), 0.2, {x: '0%', y: '0%', ease: Power4.easeOut});
  }
}
function soundRandomizer() {
  for(var i = 0, j = trumpetS.length; i<j; i++){
      var sndP = i;
      trumpetS[sndP].aud.pause();
      trumpetS[sndP].aud.pos(0);
  }
  trumpetS[soundCounter].aud.play();
  trumpetS[soundCounter].playing = true;
  soundCounter++;
  if(soundCounter === 6){
    soundCounter = 0;
  }
}
function stopSound(){
  for(var i = 0, j = trumpetS.length; i<j; i++){
    // if(trumpetS[i].playing){
      var sndP = i;
      // trumpetS[sndP].aud.fade(1, 0, 0.5, function () {
        // trumpetS[sndP].aud.stop();
        trumpetS[sndP].aud.pause();
        trumpetS[sndP].aud.pos(0);
        // trumpetS[sndP].aud.volume(1);
        trumpetS[sndP].playing = false;
      // });
      clearTimeout(trumpetS[sndP].timer);
    // }
  }
}
function resizeHandler(){
  var canMP = /*(screenSize > 768) ? 4 : */2,
      cW = canMP*parseInt($('.idle-cont img').css('width')),
      cH = 6*parseInt($('.idle-cont img').css('height'));

  pageHeight = window.innerHeight;

  init();

  document.getElementById('hair-canvas').setAttribute('width',cW);
  document.getElementById('hair-canvas').setAttribute('height',cH);
  if(screenSize > 768){
    for(var iRes = 0; iRes < 16; iRes++){
      var outerCan = canvasPool[iRes];
      outerCan.getContext('2d').clearRect(0,0, outerCan.width, outerCan.height);
      outerCan.setAttribute('width', cW);
      outerCan.setAttribute('height', cH);
      outerCan.getContext('2d').drawImage(hairImgPool[iRes], 0, 0, outerCan.width, outerCan.height);
    }
  }
}

TweenMax.to($('.hair .idle-cont'), 0, {y: 0});

// Event listeners

if(touchTest){
  eventList = ['touchstart','touchmove','touchend vmouseup']
} else {
  eventList = ['mousedown','mousemove','mouseup']
}

$(document).on(eventList[0], function (e) {
  e.preventDefault();

  if(e.target == $('a')[0] || e.target == $('a')[1] || e.target == $('a')[2]){
    window.open($(e.target).attr('href'), '_blank');
    return;
  }

  if (touchTest) {
    curPos[0] = e.originalEvent.changedTouches[0].pageX;
    curPos[1] = e.originalEvent.changedTouches[0].pageY;
    repos();
  }

  if(backSequenceStarted || sequenceStarted){
    return;
  }

  if(!mouseDown){
    mouseDown = true;
    sequenceStarted = true;
  }

  soundRandomizer();
})
$(document).on(eventList[2], function (e) {
  e.preventDefault();

  if(mouseDown){
    mouseDown = false;
  }
  if(waitingMouseUp){
    waitingMouseUp = false;
    return;
  }

  if(!backSequenceStarted){
    backSequence();
  }
});
$('body').on(['tap', 'taphold', 'swipe'],function (e) {
    e.preventDefault();
});
$(window).load(function () {
  loadState = true;
  if(loadState && loadCounter === 16){
    setTimeout(loadSequence, 3000);
  }
})
// $(window).on('orientationchange resize', function(e){
//   resizeHandler();
// })
