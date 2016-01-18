var body = $('.trump .body-cont'),
    pageHeight = window.innerHeight,
    rotCenter = [$('.trumpet').offset().left, $('.trumpet').offset().top],
    pi = Math.PI,
    center = [],
    curPos = [],
    trumPos = [],
    parPos = [],
    leftEye = {},
    rightEye = {},
    mouseDown = false,
    sequenceStarted = false,
    backSequenceStarted = false;

// Canvas

var canvas,
    ctx,
    particles = [],
    particlesNum = 8,
    startArea = [],
    endArea = [rotCenter[0]-100, rotCenter[1]-100, rotCenter[0]+100, rotCenter[1]+100];

// Head

var hairAngle = 1;

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

function init(){
  center[0] = body.offset().left + body.width()/2;
  center[1] = body.offset().top + body.height()/5;

  rotCenter = [$('.trumpet').offset().left, $('.trumpet').offset().top];

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  endArea = [rotCenter[0]-100, rotCenter[1]-100, rotCenter[0]+100, rotCenter[1]+100];

  eyePropSet(leftEye, '.left-eye');
  eyePropSet(rightEye, '.right-eye');
}

function hairAngleChangeHandler(angle) {

    if (hairAngle != Math.floor((angle+45-11.25)/22.5)+2) {
      TweenMax.to($('.hair .angle-cont.angle-'+hairAngle), 0, {y: -10000})
      hairAngle = Math.floor((angle+45-11.25)/22.5)+2;
      if(hairAngle<2 || hairAngle>16){
        hairAngle = 1;
      }
      if(mouseDown || sequenceStarted || backSequenceStarted){
        TweenMax.to($('.hair .angle-cont.angle-'+hairAngle), 0, {y: 0})
      }
    }

}

function repos(e){

  curPos[0] = e.pageX;
  curPos[1] = e.pageY;

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
    rotation: angle/*-135/*,
    width: 700*(1-(quater/Math.PI)/2),
    height: 700*(1-(quater/Math.PI)/2)*/
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

  // if (hairAngle != Math.floor((angle+45-11.25)/22.5)+2) {
  //   $('.hair').removeClass('angle-'+hairAngle);
  //   hairAngle = Math.floor((angle+45-11.25)/22.5)+2;
  //   if(hairAngle<2 || hairAngle>16){
  //     hairAngle = 1;
  //   }
  //   $('.hair').addClass('angle-'+hairAngle)
  // }

}



// Trumpet particles

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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

var trumpetS = [],
    contTimer;

trumpetS[0] = new Audio('assets/trumpet_f_fade.mp3');

// trumpetS[0] = new Audio('assets/trumpet_1.mp3');
// trumpetS[1] = new Audio('assets/trumpet_2.mp3');
// trumpetS[2] = new Audio('assets/trumpet_3.mp3');

//trumpetS[1].loop = true;

trumpetS[0].loop = true;

// trumpetS[0].addEventListener('ended', function () {
//   trumpetS[1].play();
// });
//
// trumpetS[1].addEventListener('pause', function () {
//   trumpetS[2].play();
// })

//Hair

var hair = $('.hair .angle-cont .hair-sprite'),
    counter = 0,
    tlUp = new TimelineMax({
      onComplete: hairBlow,
      onCompleteParams:['{self}'],
      onReverseComplete: classDrop,
      onCompleteParams:['{self}'],
      paused:true
    }),
    tlBlow = new TimelineMax({paused:true});

// tlUp.fromTo(hair, 0.5/3,
//   {backgroundPosition: '0 0'},
//   {
//     backgroundPosition: '100% 0',
//     ease: SteppedEase.config(3)
//   })
//     .fromTo(hair, 0.5/3,
//   {backgroundPosition: '0 20%'},
//   {
//     backgroundPosition: '100% 20%',
//     ease: SteppedEase.config(3)
//   })
//     .fromTo(hair, 0.5/3,
//   {backgroundPosition: '0 40%'},
//   {
//     backgroundPosition: '100% 40%',
//     ease: SteppedEase.config(3)
//   })

    tlUp.to(hair, 0.5/12*1,
          {
            x: '0%',
            y: '0%',
            ease: SteppedEase.config(1)
          })
        .to(hair, 0.5/12*3,
          {
            x: '-75%',
            y: '0%',
            ease: SteppedEase.config(3)
          })
        .to(hair, 0.5/12*1,
          {
            x: '0%',
            y: -100/6*1+'%',
            ease: SteppedEase.config(1)
          }
        )
        .to(hair, 0.5/12*3,
          {
            x: '-75%',
            y: -100/6*1+'%',
            ease: SteppedEase.config(3)
          }
        )
        .to(hair, 0.5/12*1,
          {
            x: '0%',
            y: -100/6*2+'%',
            ease: SteppedEase.config(1)
          }
        )
        .to(hair, 0.5/12*3,
          {
            x: '-75%',
            y: -100/6*2+'%',
            ease: SteppedEase.config(3)
          }
        )

    // tlBlow.to(hair, 0.5/12*1,
    //     {
    //       x: '0%',
    //       y: -100/6*3+'%',
    //       ease: SteppedEase.config(1)
    //     }
    //   )
    //   .to(hair, 0.5/12*3,
    //     {
    //       x: '-75%',
    //       y: -100/6*3+'%',
    //       ease: SteppedEase.config(3)
    //     }
    //   )
    //   .to(hair, 0.5/12*1,
    //     {
    //       x: '0%',
    //       y: -100/6*4+'%',
    //       ease: SteppedEase.config(1)
    //     }
    //   )
    //   .to(hair, 0.5/12*3,
    //     {
    //       x: '-75%',
    //       y: -100/6*4+'%',
    //       ease: SteppedEase.config(3)
    //     }
    //   )
    //   .to(hair, 0.5/12*1,
    //     {
    //       x: '0%',
    //       y: -100/6*5+'%',
    //       ease: SteppedEase.config(1)
    //     }
    //   )
    //   .to(hair, 0.5/12*3,
    //     {
    //       x: '-75%',
    //       y: -100/6*5+'%',
    //       ease: SteppedEase.config(3)
    //     }
    //   )

for(var seq = 0; seq < 50; seq++){
  var x = (Math.random() < 0.5) ? ['0%','-75%'] : ['-75%','0%'],
      y = -Math.floor(Math.random()*3+3)*100/6;
  tlBlow.to(hair, 0.5/12*1,
      {
        x: x[0],
        y: y+'%',
        ease: SteppedEase.config(1)
      }
    )
    .to(hair, 0.5/12*3,
      {
        x: x[1],
        y: y+'%',
        ease: SteppedEase.config(3)
      }
    )
}


function hairLift() {
  tlUp.timeScale(2).play();
}

function hairBlow() {

  // tlBlow.fromTo(hair, 0.5/3,
  //     {backgroundPosition: '0 60%'},
  //     {
  //       backgroundPosition: '100% 60%',
  //       ease: SteppedEase.config(3)
  //     })
  //   .fromTo(hair, 0.5/3,
  //     {backgroundPosition: '0 80%'},
  //     {
  //       backgroundPosition: '100% 80%',
  //       ease: SteppedEase.config(3)
  //     })
  //   .fromTo(hair, 0.5/3,
  //     {backgroundPosition: '0 100%'},
  //     {
  //       backgroundPosition: '100% 100%',
  //       ease: SteppedEase.config(3)
  //     }).yoyo(true).repeat(-1);


  tlBlow.play().repeat(-1);
}

function hairBack() {
  tlBlow.pause();
  tlUp.timeScale(1).reverse();
}

function classDrop(){
  // hair.removeClass('angle');

  backSequenceStarted = false;
  TweenMax.to($('.hair .angle-cont'), 0, {y: -10000});
  TweenMax.to($('.hair .idle-cont'), 0, {y: 0});
}

function backSequence() {
  if(sequenceStarted){
    setTimeout(function (argument) {
      backSequence();
    }, 50)
  } else {
    backSequenceStarted = true;
    hairBack();

    var mp = 1,
        fadeOut = setInterval(function () {
      if (trumpetS[0].volume > 0.1) {
        trumpetS[0].volume -= 0.1*mp;
      }
      if (trumpetS[0].volume <= 0.1) {
        trumpetS[0].pause;
        clearInterval(fadeOut);
      }
      mp+=0.5
    }, 25);

    setTimeout(function () {
      tweenStop();
    }, 200);

    //trumpetS[1].pause();

    TweenLite.to($('.trump .body-cont .body'), 0, {x: '-50%'});

    TweenMax.to($('.trumpet .trumpet-inner-wrapper'), 0.2, {x: '0%', y: '0%', ease: Power4.easeOut});
  }
}

TweenMax.to($('.hair .idle-cont'), 0, {y: 0});

$(document).on('mousedown', function (e) {
  e.preventDefault();

  if(!mouseDown){
    mouseDown = true;
    sequenceStarted = true;
  }

  // $('.trump .hair').addClass('angle');

  TweenLite.to($('.hair .idle-cont'), 0, {y: -10000});
  TweenLite.to($('.hair .angle-cont.angle-'+hairAngle), 0, {y: 0});

  hairLift();

  tweenInit();


  // trumpetS[0].currentTime = 0;
  // trumpetS[0].volume = 1;
  // trumpetS[0].play();
  TweenLite.to($('.trump .body-cont .body'), 0, {x: '0%'});

  TweenLite.to($('.trumpet .trumpet-inner-wrapper'), 0.2, {x: '3%', y: '3%', ease: Elastic.easeOut});

  setTimeout(function () {
    sequenceStarted = false;
  }, 500)
})


$(document).on('mouseup', function (e) {
  e.preventDefault();

  if(mouseDown){
    mouseDown = false;
  }

  backSequence();
});

$(window).load(function () {
  //TweenMax.to($('.hair .angle-cont'), 0, {y: -10000});
  //console.log('up')
})

init();

$('body').mousemove(function(e){
  requestAnimationFrame(function(){
    repos(e);
  });
})

$(window).resize(function(e){
  init();
})
