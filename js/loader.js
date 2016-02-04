TRUMP.loader = (function(){
  var loaderCont = $('.loader-container'),
      progressMarkers = 22,
      speed = 3,
      progressTween
      progressStatus = 0; //16 sprites + 6 sounds

  function updateProgress(){
    if(progressTween){
        progressTween.kill();
    }
    progressStatus += 100/progressMarkers;
    progressTween = new TweenMax.to($('.anim-shape'), speed, {x: progressStatus+'%'});
  }

  function updateFullLoad(){
    if(progressTween){
        progressTween.kill();
    }
    progressStatus = 100;
    progressTween = new TweenMax.to($('.anim-shape'), 0.5, {x: progressStatus+'%'});
  }

  return {
    uP: updateProgress,
    uFL: updateFullLoad
  }

})();
