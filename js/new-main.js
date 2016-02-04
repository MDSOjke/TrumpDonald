/*Made by MDSOjke for Animal*/

var TRUMP = TRUMP || {};

TRUMP.main = (function(){
  var clientProps = {
        pageHeight : window.innerHeight,
        pageWidth : window.innerWidth,
        screenSize : $('body').width()
        // tP: []
      },
      flags = {
        mouseDown : false,
        sequenceStarted : false,
        backSequenceStarted : false,
        waitingMouseUp : false,
        drawCounter: 0,
        loadCounter : 0,
        soundLoadCounter: 0,
        imagesDrawn: false,
        imagesLoaded: false,
        soundsLoaded: true, //!!!!
        loadState : false,
        confettiCounter: 7
      },
      tests = {
        iOS : /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
        touchTest : 'ontouchstart' in window || navigator.maxTouchPoints,
        crios : navigator.userAgent.match('CriOS')
      },
      events = {
        eventList : []
      },
      options = {
        fullFramesDesktop: false,
        fullFramesMobile: false
      }

  // if(tests.touchTest){
  //   pageHeight = window.screen.availHeight;
  //   pageWidth = window.screen.availWidth;
  // }

  /*Assign body classes*/

  function bodyClasses(){
    (tests.touchTest)?$('body').addClass('touch'):0;
    (tests.iOS)?$('body').addClass('iOS'):0;
    (tests.crios)?$('body').addClass('crios'):0;
  }

  /*Initialize*/

  function initialize(){
    bodyClasses();
  }

  function criosFix(){
    var size = (clientProps.pageWidth > clientProps.pageHeight) ? clientProps.pageWidth : clientProps.pageHeight;
    $('.gradient-bg').height(size*2).width(size*2);
    // alert('main')
    // alert(clientProps.pageHeight+'/'+clientProps.pageWidth+'/'+clientProps.screenSize)
  }

  if(tests.touchTest){
    eventList = ['touchstart','touchmove','touchend']
  } else {
    eventList = ['mousedown','mousemove','mouseup']
  }

  // if(!tests.crios){
    criosFix();
  // }
  // if(!tests.crios){
    initialize();
  // }

  return {
    crF: criosFix,
    touch: tests.touchTest,
    iOS: tests.iOS,
    crios: tests.crios,
    flags: flags,
    props: clientProps,
    events: eventList,
    sC: flags.confettiCounter
  }
})();
