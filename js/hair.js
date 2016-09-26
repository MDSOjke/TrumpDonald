TRUMP.hair = (function() {
  var hairAngle = 1,
      hairCanvas = $('#hair-canvas'),
      idleImg = $('.idle-cont img'),
      desktop = TRUMP.main.props.screenSize > 768,
      hairImgPool = [],
      canvasPool = [],
      gtx = document.getElementById('hair-canvas').getContext('2d'),
      imgRes,
      tlUp = new TimelineMax({
            onComplete: hairBlow,
            onCompleteParams:['{self}'],
            onReverseComplete: sequenceEnd,
            onCompleteParams:['{self}'],
            paused:true
      }),
      tlBlow = new TimelineMax({paused:true});

  function hairImagesInit() {
    var canMP = 2,
        cW = canMP*parseInt(idleImg.css('width')),
        cH = 6*parseInt(idleImg.css('height'));

    hairCanvasSizeSet(cW,cH);
    imgRes = (desktop) ? '-safari-08' : '-safari-05';
    for (var iCr = 0; iCr < 16; iCr++) {
      hairImgPool[iCr] = new Image();
      hairImgPool[iCr].onload = function () {
        if(desktop){
          var iNum = hairImgPool.indexOf(this);
          canvasPool[iNum] = createCanvas(cW,cH);
          canvasPool[iNum].getContext('2d').drawImage(this,0,0,canvasPool[iNum].width,canvasPool[iNum].height);
          gtx.clearRect(0,0,$('#hair-canvas').attr('width'),$('#hair-canvas').attr('height'));
          gtx.drawImage(canvasPool[iNum],0,0);
          TRUMP.main.flags.drawCounter++;
        } else {
          TRUMP.main.flags.imagesDrawn = true;
          console.log('imgDrawn ='+TRUMP.main.flags.imagesDrawn);
        }
        if(TRUMP.main.flags.drawCounter === 16){
          TRUMP.main.flags.imagesDrawn = true;
          console.log('imgDrawn ='+TRUMP.main.flags.imagesDrawn);
        }
        TRUMP.main.flags.loadCounter++;
        if(TRUMP.main.flags.loadCounter === 16){
          TRUMP.main.flags.imagesLoaded = true;
          console.log('imgLoaded ='+TRUMP.main.flags.imagesLoaded);
        }
        if(TRUMP.main.flags.imagesLoaded){
          if(desktop){
            if(TRUMP.main.flags.imagesDrawn){
              hairCanvasInit();
            }
          } else {
            hairCanvasInit();
          }
        }
      }
      hairImgPool[iCr].src = 'http://d2xgoeeq7a4bfy.cloudfront.net/v1/hair'+imgRes+'/angle_'+((iCr<9)?'0':'')+(iCr+1)+'.png';
    }
  }

  function createCanvas(cW, cH) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', cW);
    canvas.setAttribute('height', cH);
    return canvas;
  }

  function hairCanvasSizeSet(cW, cH) {
    hairCanvas.prop('width', cW);
    hairCanvas.prop('height', cH);
  }

  function hairCanvasInit(){
    var hDims = [hairCanvas.attr('width'),hairCanvas.attr('height')];
    if(desktop){
      gtx.drawImage(canvasPool[hairAngle-1],0,0);
    } else {
      gtx.drawImage(hairImgPool[hairAngle-1],0,0,hDims[0],hDims[1]);
    }
  }

  function hairCanvasResize(){
    var canMP = 2,
        cW = canMP*parseInt(idleImg.css('width')),
        cH = 6*parseInt(idleImg.css('height'));

    hairCanvasSizeSet(cW, cH);
    if(desktop){
      for(var iRes = 0; iRes < 16; iRes++){
        var outerCan = canvasPool[iRes];
        outerCan.getContext('2d').clearRect(0,0, outerCan.width, outerCan.height);
        outerCan.setAttribute('width', cW);
        outerCan.setAttribute('height', cH);
        outerCan.getContext('2d').drawImage(hairImgPool[iRes], 0, 0, outerCan.width, outerCan.height);
      }
    }
    hairCanvasInit();
  }

  function hairAngleChangeHandler(angle) {
      if (hairAngle != Math.floor((angle+45-11.25)/22.5)+2) {
        hairAngle = Math.floor((angle+45-11.25)/22.5)+2;
        if(hairAngle<2 || hairAngle>16){
          hairAngle = 1;
        };
        var hDims = [hairCanvas.attr('width'),hairCanvas.attr('height')];
        gtx.clearRect(0,0,hDims[0],hDims[1]);
        if(desktop){
          gtx.drawImage(canvasPool[hairAngle-1],0,0);
        } else {
          gtx.drawImage(hairImgPool[hairAngle-1],0,0,hDims[0],hDims[1]);
        }
      }
  }

  function hairAnimInit() {
    var xMax = '-50%',
        stepsNum = 1;

    tlUp.to(hairCanvas, 0.5/12*1,
        {
          x: '0%',
          y: '0%',
          ease: SteppedEase.config(1)
        })
      .to(hairCanvas, 0.5/12*stepsNum,
        {
          x: xMax,
          y: '0%',
          ease: SteppedEase.config(stepsNum)
        })
      .to(hairCanvas, 0.5/12*1,
        {
          x: '0%',
          y: -100/6*1+'%',
          ease: SteppedEase.config(1)
        }
      )
      .to(hairCanvas, 0.5/12*stepsNum,
        {
          x: xMax,
          y: -100/6*1+'%',
          ease: SteppedEase.config(stepsNum)
        }
      )
      .to(hairCanvas, 0.5/12*1,
        {
          x: '0%',
          y: -100/6*2+'%',
          ease: SteppedEase.config(1)
        }
      )
      .to(hairCanvas, 0.5/12*stepsNum,
        {
          x: xMax,
          y: -100/6*2+'%',
          ease: SteppedEase.config(stepsNum)
        }
      )
    for(var seq = 0; seq < 50; seq++){
      var x = (Math.random() < 0.5) ? ['0%',xMax] : [xMax,'0%'],
          y = -Math.floor(Math.random()*3+3)*100/6;
      tlBlow.to(hairCanvas, 0.5/12*1,
          {
            x: x[0],
            y: y+'%',
            ease: SteppedEase.config(1)
          }
        )
        .to(hairCanvas, 0.5/12*stepsNum,
          {
            x: x[1],
            y: y+'%',
            ease: SteppedEase.config(stepsNum)
          }
        )
    }
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

  function sequenceStart() {
    TweenMax.to($('.hair .idle-cont'), 0, {y: -10000});
    TweenMax.to($('.hair .angle-cont-can'), 0, {y: 0});
  }

  function sequenceEnd(){
    TRUMP.main.flags.backSequenceStarted = false;
    TweenMax.to($('.hair .angle-cont-can'), 0, {y: -10000});
    TweenMax.to($('.hair .idle-cont'), 0, {y: 0});
  }

  function criosFix(){
    var proportion = (TRUMP.main.props.screenSize > 768) ? 103.888889 : 88.305555,
        size = TRUMP.main.props.pageHeight*proportion/100;
    $('.trump').width(size+'px');
  }
    criosFix();
    hairImagesInit();
    hairAnimInit();
  return {
    crF: criosFix,
    hACH: hairAngleChangeHandler,
    hL: hairLift,
    hB: hairBack,
    hBl: hairBlow,
    hCR: hairCanvasResize,
    sS: sequenceStart,
    sE: sequenceEnd
  }
})();
