TRUMP.sounds = (function(){
  var trumpetS = [],
      soundCounter = 0,
      playCounter = 0,
      clapSound,
      soundTimer,
      isAndroid = /(android)/i.test(navigator.userAgent);

  function soundInit(){
    for(var sI = 0; sI< 6; sI++){
      var objCounter = sI;
      trumpetS[sI] = {};
      trumpetS[sI] = new buzz.sound("assets/sounds/sound-"+(sI+1), {
          formats: [ "ogg", "mp3", "wav", "m4a" ],
          preload: true,
          webAudioApi: (/(android)/i.test(navigator.userAgent)) ? true: false
      });
      trumpetS[sI].load();
      trumpetS[sI].bind('canplaythrough', function(e){
          TRUMP.main.soundLoadCounter++;
          if(TRUMP.main.soundLoadCounter == 6){
            TRUMP.main.soundsLoaded = true;
            console.log('soundsLoaded = '+TRUMP.main.soundsLoaded);
          }
      })
      trumpetS[sI].bind('playing', function(e){
        forwardSequence();
        soundTimer = setTimeout(function () {
          TRUMP.main.flags.waitingMouseUp = true;
          backSequence();
        }, 5000);
      })
    }
  }
  function clapSoundInit(){
    clapSound = new buzz.sound("assets/sounds/con-sound", {
        formats: [ "ogg", "mp3", "wav"],
        preload: true,
        webAudioApi: (/(android)/i.test(navigator.userAgent)) ? true: false,
        volume: 64
    });
    clapSound.load();
    clapSound.bind('playing', function(e){
      Confetti.show(100, false, false);
    })
  }
  function soundRandomizer() {
    trumpetS[soundCounter].play();
    soundCounter++;
    if(soundCounter === 6){
      soundCounter = 0;
    }
    TRUMP.sounds.sC = soundCounter;
  }
  function stopSound(){
    buzz.all().stop();
    clearTimeout(soundTimer);
  }
  function forwardSequence() {
    TRUMP.hair.sS();
    TRUMP.hair.hL();

    TweenLite.to($('.trump .body-cont .body'), 0, {x: '0%'});
    TweenLite.to($('.trumpet .trumpet-inner-wrapper'), 0.2, {x: '3%', y: '3%', ease: Elastic.easeOut});

    setTimeout(function () {
      TRUMP.main.flags.sequenceStarted = false;
    }, 500);
  }
  function backSequence() {
    if(TRUMP.main.flags.sequenceStarted){
      setTimeout(function(){
        backSequence();
      }, 50)
    } else {
      TRUMP.main.flags.backSequenceStarted = true;

      stopSound();

      TRUMP.hair.hB();

      TweenLite.to($('.trump .body-cont .body'), 0, {x: '-50%'});
      TweenMax.to($('.trumpet .trumpet-inner-wrapper'), 0.2, {x: '0%', y: '0%', ease: Power4.easeOut});
    }
  }
    soundInit();
    clapSoundInit();

  return {
    tA: trumpetS,
    sC: soundCounter,
    sR: soundRandomizer,
    sS: stopSound,
    cSI: clapSoundInit,
    clS: clapSound,
    bS: backSequence
  }
})();
