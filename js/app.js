TRUMP.app = {
  init: function() {
    TweenMax.to($('.hair .idle-cont'), 0, {y: 0});
    this.bindUI();
  },
  bindUI: function() {
    var that = this;
    $('#can').on(['tap', 'taphold', 'swipe'],function (e) {
        e.preventDefault();
    });
    $(window).on('load', function () {
      var loadInt = setInterval(function() {
        if(TRUMP.main.flags.imagesLoaded && TRUMP.main.flags.imagesDrawn && TRUMP.main.flags.soundsLoaded){
          TRUMP.main.flags.loadState = true;
          console.log('loadState = '+TRUMP.main.flags.loadState);
        }
        if(TRUMP.main.flags.loadState){
          clearInterval(loadInt);
          that.loadHandler();
          $(window).on('resize orientationchange', function () {
            that.resizeHandler();
          });
        }
      }, 100);
    });
  },
  loadHandler: function() {
    var tM = TRUMP.main;
    TweenMax.to($('.loader'), 1, {opacity: 0 , ease: Power4.easeOut, delay: 0.25, onComplete: function () {
      $('.loader').hide();
      TRUMP.trumpet.crF();
      TweenMax.to([$(".socials-container"), $(".counter-cont")], 0.5, {y:0, ease: Power4.easeOut})
      TweenMax.to([$(".trump .trump-inner"), $(".text")], 0.5, {x: 0, y:0, delay:0.5, ease: Power4.easeOut, onComplete: function () {
        TRUMP.eyes.eI();
        TRUMP.trumpet.dF();
        TRUMP.trumpet.re(1000000,(TRUMP.main.props.pageWidth < 768) ? -1000000 : 0);
        TweenMax.to($(".trumpet"), 0.5, {x: 0, y:0, ease: Elastic.easeOut.config(0.008,0.01), onComplete: function () {
          //wiggle timer
          if(TRUMP.main.touch){
            var angle = (TRUMP.main.props.screenSize >= 768) ? -45 : -90,
                wiggleTimer = setInterval(function () {
              TweenMax.to($(".trumpet"), 0, {rotation: angle-3});
              TweenMax.to($('.trumpet'), 2.5, {rotation: angle, ease: Elastic.easeOut.config(10,0.1)});
            },3000)
          }
          //tap-click event
          $('#can').on(tM.events[0], function (e) {
            e.preventDefault();
            TRUMP.counter.uNC();
            if(wiggleTimer){
              clearInterval(wiggleTimer);
            }
            if(e.target == $('a')[0] || e.target == $('a')[1] || e.target == $('a')[2] || e.target == $('a')[3]){
              $(e.target).trigger('tap');
              return;
            }
            if (tM.touch) {
              TRUMP.trumpet.re(e.originalEvent.changedTouches[0].pageX, e.originalEvent.changedTouches[0].pageY);
            }
            if(TRUMP.main.sC > 8){
              TRUMP.sounds.clS.play();
              TRUMP.main.sC = 0;
            }
            TRUMP.main.sC++
            if(tM.flags.backSequenceStarted || tM.flags.sequenceStarted){
              return;
            }
            if(!tM.flags.mouseDown){
              tM.flags.mouseDown = true;
              tM.flags.sequenceStarted = true;
            }
            TRUMP.sounds.sR();
            ga('send', {
              hitType: 'event',
              eventCategory: 'Clicks',
              eventAction: 'click',
              eventLabel: 'trump'
            });
          })
          //move event
          $('#can').on(tM.events[1], function (e) {
            e.preventDefault();
            requestAnimationFrame(function(){
              TRUMP.trumpet.re((TRUMP.main.touch) ? e.originalEvent.changedTouches[0].pageX : e.pageX,(TRUMP.main.touch) ? e.originalEvent.changedTouches[0].pageY : e.pageY);
            });
          })
          //button-touch release event
          $('#can').on(tM.events[2], function (e) {
            e.preventDefault();
            if(TRUMP.main.flags.mouseDown){
              TRUMP.main.flags.mouseDown = false;
            }
            if(TRUMP.main.flags.waitingMouseUp){
              TRUMP.main.flags.waitingMouseUp = false;
              return;
            }
            if(!TRUMP.main.flags.backSequenceStarted){
              TRUMP.sounds.bS();
            }
          })
        }});
      }});
    }});
    if(!TRUMP.main.touch){
      $('a').hover(function () {
        $(this).parent().siblings().css('background-position', '66.666666% 0');
      }, function () {
        $(this).parent().siblings().removeAttr('style');
      });
    }
    $('.counter-ref a').on('click', function (e){
      TRUMP.main.linkS();
      ga('send', {
        hitType: 'event',
        eventCategory: 'Clicks',
        eventAction: 'click to animal',
        eventLabel: 'animal.cc'
      });
    })
    setTimeout(function () {
      TRUMP.main.props.pageHeight =  window.innerHeight;
      TRUMP.main.props.pageWidth = window.innerWidth;
      TRUMP.main.props.screenSize = $('body').width();
      TRUMP.main.crF();
      TRUMP.hair.crF();
      TRUMP.eyes.crF();
      TRUMP.trumpet.crF();
      TRUMP.trumpet.dF();
      TRUMP.trumpet.tI();
      TRUMP.eyes.eI();
      TRUMP.hair.hCR();
    },1000)
  },
  resizeHandler: function() {
    TRUMP.main.props.pageHeight =  window.innerHeight;
    TRUMP.main.props.pageWidth = window.innerWidth;
    TRUMP.main.props.screenSize = $('body').width();
    TRUMP.main.crF();
    TRUMP.hair.crF();
    TRUMP.eyes.crF();
    TRUMP.trumpet.crF();
    TRUMP.trumpet.dF();
    TRUMP.trumpet.tI();
    TRUMP.eyes.eI();
    TRUMP.hair.hCR();
    setTimeout(function () {
      TRUMP.main.props.pageHeight =  window.innerHeight;
      TRUMP.main.props.pageWidth = window.innerWidth;
      TRUMP.main.props.screenSize = $('body').width();
      TRUMP.main.crF();
      TRUMP.hair.crF();
      TRUMP.eyes.crF();
      TRUMP.trumpet.crF();
      TRUMP.trumpet.dF();
      TRUMP.trumpet.tI();
      TRUMP.eyes.eI();
      TRUMP.hair.hCR();
      TRUMP.trumpet.re(1000000, TRUMP.main.props.pageHeight/2)
    },1000)
  }
}

TRUMP.app.init();
