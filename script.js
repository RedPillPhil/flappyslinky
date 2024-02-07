$().ready(onReady);
function onReady(){
  configGame();
  bindings();
  $('.click').fadeOut(0);
  screen=0;
}
function configGame(){
  if(typeof pipe_base === "undefined"){
    pipe_base = $(".pipe_container").html();
  }
  $(".pipes").remove();
  bird = $(".bird");
  bird.attr('style','');
  flash = $(".flash");
  floor = 60;
  flapStrenght = 7;
  gravity = -15;
  accelVariation = .2;
  acceleration = 0;
  bottom = parseInt(bird.css('bottom'));
  space = 0
  tick = 0;
  points=0;
  $('.floor').addClass("slide_animation");
}
function startGame(){
  switch(screen){
      case 0:
        screen=1;
        $('.intro').fadeOut(400, function(){
          $('.click').fadeIn();
        });
      break;
      case 1:
      case 3:
        screen=2;
        if(!tick){
          $('.intro').fadeOut()
          $('.click').fadeOut();
          configGame();
          bird.attr('style','');
          tick = setInterval(onTick,10);
          $(".wrapper").click(flap);
          flap();
        }
      break;
      case 2:
        //game
      break;
  }
}
function bindings(){
  $(".fullscreen").click(toggleFullScreen);
  $(".wrapper").click(startGame);
}
function onTick(){
  acceleration -= accelVariation;
  bottom += acceleration;
  if(acceleration<gravity){
    acceleration = gravity;
  }
  if(bottom<floor){
    hit();
  }
  /**/
  $(".pipe").each(function(){
    if(collision(bird,$(this))){
      hit();
    }
  })
  $(".target").each(function(){
    if(collision(bird,$(this))){
      points++;
      $(this).removeClass("target");
      console.log(points);}
  })
  /**/
  if(space==350){
    space=0;
    var p = $(pipe_base).clone();
    var r = parseInt(100+Math.random()*150);
    //p.children(".top").css('margin-top',-400-Math.random()*150);
    p.children(".top").css({
      'height':r,
      'background-position':'270px '+(-(700-r))+'px'
    });
    p.css('left',$(window).width());
    $(".pipe_container").append(p);
  }
  space++;
  /**/
  bird.css('bottom',bottom);
  $('.pipes').css('left','-=1px');
}
function flap(){
  if(bird.offset().top>0){
    acceleration = flapStrenght;
    bird[0].classList.remove("flapp_animation");
    bird[0].offsetWidth = bird[0].offsetWidth;//MAGIC
    bird[0].classList.add("flapp_animation");
  }
}
function hit(){
  $('.wrapper').unbind('click',flap);
  flash.fadeIn(0).fadeOut(100);
  $('.floor').removeClass("slide_animation");
  bird.animate({bottom:floor});
  clearInterval(tick);
  tick = 0;
  screen = 3;
}
function toggleFullScreen(){
  var fullscreenElement = 
      document.fullscreenElement || 
      document.mozFullScreenElement ||
      document.webkitFullscreenElement;
  if(fullscreenElement){
    exitFullscreen();
  }else{
    launchFullscreen(document.documentElement);
  }
}
function launchFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
function collision($div1, $div2) {
  var x1 = $div1.offset().left;
  var y1 = $div1.offset().top;
  var h1 = $div1.outerHeight(true);
  var w1 = $div1.outerWidth(true);
  var b1 = y1 + h1;
  var r1 = x1 + w1;
  var x2 = $div2.offset().left;
  var y2 = $div2.offset().top;
  var h2 = $div2.outerHeight(true);
  var w2 = $div2.outerWidth(true);
  var b2 = y2 + h2;
  var r2 = x2 + w2;
  //
  if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
    return false;
  }
  return true;
}