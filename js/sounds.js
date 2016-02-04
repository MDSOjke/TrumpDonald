TRUMP.sounds = (function(){
  var trumpetS = [],
      soundCounter = 0,
      playCounter = 0,
      clapSound,
      soundTimer;

  function soundInit(){
    for(var sI = 0; sI< 6; sI++){
      var objCounter = sI;
      trumpetS[sI] = {};
      trumpetS[sI] = new buzz.sound("assets/sounds/sound-"+(sI+1), {
          formats: [ "ogg", "mp3", "wav", "m4a" ],
          preload: true,
          webAudioApi: false
      });
      trumpetS[sI].load();
      trumpetS[sI].bind('canplaythrough', function(e){
          TRUMP.main.soundLoadCounter++;
          // TRUMP.loader.uP();
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
        webAudioApi: false,
        volume: 64
    });
    clapSound.load();
    // trumpetS[sI].aud.bind('canplaythrough', function(e){
    //     TRUMP.main.soundLoadCounter++;
    //     // TRUMP.loader.uP();
    //     if(TRUMP.main.soundLoadCounter == 6){
    //       TRUMP.main.soundsLoaded = true;
    //       console.log('soundsLoaded = '+TRUMP.main.soundsLoaded);
    //     }
    // })
    clapSound.bind('playing', function(e){
      Confetti.show(100, false, false);
    })
  }

  // function soundInit(){
  //   // for(var sI = 0; sI< 6; sI++){
  //     var sI = 0
  //         objCounter = sI;
  //     trumpetS[sI] = {};
  //     trumpetS[sI] = new Howl({
  //         urls: [ "assets/sounds/sound-"+(sI+1)+".ogg", "assets/sounds/sound-"+(sI+1)+".mp3", "assets/sounds/sound-"+(sI+1)+".wav", "assets/sounds/sound-"+(sI+1)+".m4a"],
  //         sprite: {
  //           0: [0,2000],
  //           1: [2000,4000]
  //         },
  //         volume: 1,
  //         onplay: function () {
  //           forwardSequence();
  //           soundTimer = setTimeout(function () {
  //             TRUMP.main.flags.waitingMouseUp = true;
  //             backSequence();
  //           }, 5000);
  //         }
  //     });
  //   // }
  // }
  // function clapSoundInit(){
  //   clapSound = new Howl({
  //       urls: [ "assets/sounds/con-sound.ogg", "assets/sounds/con-sound.mp3", "assets/sounds/con-sound.wav"],
  //       onplay: function () {
  //         Confetti.show(100, false, false);
  //       }
  //   });
  // }

  //
  // function soundInit(){
  //   lowLag.init({'urlPrefix': 'assets/sounds/', 'sm2url':'/js/vendor/sm2/swf/'})
  //
  //   for(var sI = 0; sI< 6; sI++){
  //     lowLag.load(['sound-'+(sI+1)+'.mp3','sound-'+(sI+1)+'.ogg', 'sound-'+(sI+1)+'.m4a', 'sound-'+(sI+1)+'.wav'],'sound-'+(sI+1));
  //   }
  // }
  // function clapSoundInit(){
  //     lowLag.load(['con-sound.mp3','con-sound.ogg', 'con-sound.m4a', 'con-sound.wav'],'con-sound');
  // }


  function soundRandomizer() {
    trumpetS[soundCounter].play();
    // trumpetS[0].play(soundCounter.toString());
    // lowLag.play('sound-'+soundCounter);
    // soundTimer = setTimeout(function () {
    //   TRUMP.main.flags.waitingMouseUp = true;
    //   backSequence();
    // }, 5000)
    // trumpetS[soundCounter].playing = true;
    soundCounter++;
    if(soundCounter === 6){
      soundCounter = 0;
    }
    TRUMP.sounds.sC = soundCounter;
    // forwardSequence();
  }
  function stopSound(){
    // for(var i = 0, j = trumpetS.length; i<j; i++){
    //   // if(trumpetS[i].playing){
    //     var sndP = i;
    //     // trumpetS[sndP].aud.fade(1, 0, 0.5, function () {
    //       trumpetS[sndP].aud.stop();
    //       // trumpetS[sndP].aud.pause();
    //       // trumpetS[sndP].aud.pos(0);
    //       // trumpetS[sndP].aud.volume(1);
    //       trumpetS[sndP].playing = false;
        // });
        console.log('BS');
        buzz.all().stop();
        // trumpetS[0].stop(playCounter.toString());
        // playCounter++;
        // if(playCounter === 2){
        //   playCounter = 0;
        // }
        clearTimeout(soundTimer);
    //   // }
    // }
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
      console.log('fire');
      TRUMP.main.flags.backSequenceStarted = true;

      stopSound();

      TRUMP.hair.hB();

      TweenLite.to($('.trump .body-cont .body'), 0, {x: '-50%'});
      TweenMax.to($('.trumpet .trumpet-inner-wrapper'), 0.2, {x: '0%', y: '0%', ease: Power4.easeOut});
    }
  }


  if(!TRUMP.main.crios){
    soundInit();
    clapSoundInit();
  }

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
