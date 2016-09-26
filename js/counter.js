TRUMP.counter =(function(){
  var countNumber = 0,
      requestCount = 0;

  function requestSend(){
    $.ajax({
      url: window.location.protocol+"//trumpdonald.org/counter.json"
    })
      .then(function(data) {
        requestCallback(data);
      },
      function() {
        if(requestCount < 100){
            requestSend();
        }
        requestCount++;
      });
  }
  function requestCallback(data) {
    if ( console && console.log ) {
      console.log( data);
    }
    countNumber = data.counter;
    if(data){
        setNumber();
        updateNumberTimeout();
        TweenMax.to([$(".counter-cont .counter-numbers"), $(".counter-cont .counter-text")], 0.5, {opacity:1});
    }
  }
  function setNumber(){
    $('.counter-numbers').html(countNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
  }
  function updateNumberClick(){
    countNumber++;
    setNumber();
  }
  function updateNumberInterval() {
    setInterval(function(){
      countNumber += Math.floor(Math.random()*50*2)+1;
      setNumber();
    }, 5000)
  }
  function updateNumberTimeout() {
    setTimeout(function(){
      requestSend();
    }, 60000)
  }
  requestSend();
  return{
    uNC: updateNumberClick
  }
})();
