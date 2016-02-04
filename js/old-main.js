
// Canvas

var canvas,
    ctx,
    particles = [],
    particlesNum = 8,
    startArea = [],
    endArea;

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
