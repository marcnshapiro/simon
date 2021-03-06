var powerOn = false;
var strict = false;
var start = false;
var locked = false;
var count = 0;
var round = 0;
var dur = 420;
var pause = 50;

var tones = ["G4", "E4", "C4", "G3", "Zonk"];  // value in hertz
var volume = 0.90;
var sequence = [];

var G3 = new Audio('audio/G3.mp3');
var C4 = new Audio('audio/C4.mp3');
var E4 = new Audio('audio/E4.mp3');
var G4 = new Audio('audio/G4.mp3');
var Zonk = new Audio('audio/Zonk.mp3');

var maxTones = 20;

// Fix bug where each sound does not play on first call (on mobile), but is fine on subsequent calls.
G3.play();
G3.pause();
C4.play();
C4.pause();
E4.play();
E4.pause();
G4.play();
G4.pause();

/*
This is not used any more since I found a better way to deal with finickiness in touchstart/touchend
but I am keeping it in comments for future reference until I set up a good tip sheet for myself
var hasTouchCapabilities = 'ontouchstart' in window || navigator.maxTouchPoints || navigator.msMaxTouchPoints;
var isTouchDevice = hasTouchCapabilities ? 'maybe':'no';
*/

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function lock() {
  locked = true;
}

function unlock() {
  locked = false;
  count = 0;
}

function playGreen () {
  $("#btnGreen").css("background", "#4FFF4F");
  G4.currentTime = 0;
  G4.loop = true;
  G4.volume = volume;
  G4.play();
}

function playRed () {
  $("#btnRed").css("background", "#FF4F4F");
  E4.currentTime = 0;
  E4.loop = true;
  E4.volume = volume;
  E4.play();
}

function playYellow () {
  $("#btnYellow").css("background", "#FFFF4F");
  C4.currentTime = 0;
  C4.loop = true;
  C4.volume = volume;
  C4.play();
}

function playBlue () {
  $("#btnBlue").css("background", "#1F8FFF");
  G3.currentTime = 0;
  G3.loop = true;
  G3.volume = volume;
  G3.play();
}

function releaseGreen() {
  $("#btnGreen").css("background", "#1FCC1F");
  G4.pause();;
}

function releaseRed() {
  $("#btnRed").css("background", "#CC1F1F");
  E4.pause();
}

function releaseYellow() {
  $("#btnYellow").css("background", "#CCCC1F");
  C4.pause();
}

function releaseBlue() {
  $("#btnBlue").css("background", "#1F1FCC");
  G3.pause();
}

function playZonk() {
  Zonk.currentTime = 0;
  Zonk.loop = false;
  Zonk.volume = volume;
  Zonk.play();

  count = 0;

  if (strict) {
    $("#start").click();
  }

  playSequence(round);
}

// Play a portion of the sequence
function playSequence(num) {
  var time = 2000;

  if (num > maxTones) {
    playVictory();
    return;
  }

  lock();

  $("#round").html(num);
  if (num >= 14) {
    dur = 220;
  } else if (num >= 6) {
    dur = 320;
  } else {
    dur = 420;
  }

  pause = 50;

  for (let i = 0; i < num; i++) { 
    switch (sequence[i]) {
      case 0:
        setTimeout(function() {playGreen();}, time)
        setTimeout(function() {releaseGreen();}, time + dur)
        break;
      case 1:
        setTimeout(function() {playRed();}, time)
        setTimeout(function() {releaseRed();}, time + dur)
        break;
      case 2:
        setTimeout(function() {playYellow();}, time)
        setTimeout(function() {releaseYellow();}, time + dur)
        break;
      case 3:
        setTimeout(function() {playBlue();}, time)
        setTimeout(function() {releaseBlue();}, time + dur)
        break;
    }
    time += dur + pause;
  }
  setTimeout(function() {unlock();}, time);
}

// Play victory sequence
function playVictory() {
  var time = 100;
  var d = [20, 70, 70, 70, 70, 70];

  lock();

  pause = 20;

  for (let i = 0; i < 6; i++) { 
    dur = d[i];
    switch (sequence[maxTones - 1]) {
      case 0:
        setTimeout(function() {playGreen();}, time)
        setTimeout(function() {releaseGreen();}, time + dur)
        break;
      case 1:
        setTimeout(function() {playRed();}, time)
        setTimeout(function() {releaseRed();}, time + dur)
        break;
      case 2:
        setTimeout(function() {playYellow();}, time)
        setTimeout(function() {releaseYellow();}, time + dur)
        break;
      case 3:
        setTimeout(function() {playBlue();}, time)
        setTimeout(function() {releaseBlue();}, time + dur)
        break;
    }
    time += dur + pause;
  }
  setTimeout(function() {$("#start").click();}, time);
  setTimeout(function() {unlock();}, time + 5);
}

$(document).ready( function() {
  "use strict";
  /*
  This is not used any more since I found a better way to deal with finickiness in touchstart/touchend
  but I am keeping it in comments for future reference until I set up a good tip sheet for myself
  $(window).one('touchstart mousemove click',function(e){
    if ( isTouchDevice === 'maybe' && e.type === 'touchstart' ) {
      isTouchDevice = "yes";
    }
  });
 */

  $( "#volume" ).on("change", function() {
    volume = document.getElementById("volume").value/100;
  });

  $("#strict").on("click", function() {
    strict = !strict;
    if (strict) {
      $("#strictLED").css("background", "#FF1F1F");
    } else {
      $("#strictLED").css("background", "#4F1F1F");
    }
    $("#start").click();
  });

  $("#start").on("click", function() {
    round = 1;
    count = 0;

    sequence = [];

    for (let i = 0; i < maxTones; i++) {
      sequence.push(getRandomIntInclusive(0, 3));
    }

    playSequence(round, dur);
  });

  
  $("#btnGreen").on("mousedown touchstart", function(e) {
      e.preventDefault();
      if (!locked) {
        if (sequence[count] === 0) {
          playGreen();
        } else {
          playZonk();
        }
      }
  });

  $("#btnGreen").on("mouseup touchend", function() {
    if (!locked) {
      if (sequence[count] === 0) {
        releaseGreen();
      }
      count++;
      if (count === round) {
        round++;
        count = 0;
        playSequence(round, dur);
      }
    }
  });

  $("#btnRed").on("mousedown touchstart", function(e) {
    e.preventDefault();
    if (!locked) {
      if (sequence[count] === 1) {
        playRed();
      } else {
        playZonk();
      }
    }
  });

  $("#btnRed").on("mouseup touchend", function() {
    if (!locked) {
      if (sequence[count] === 1) {
        releaseRed();
      }
      count++;
      if (count === round) {
        round++;
        count = 0;
        playSequence(round, dur);
      }
    }
  });

  $("#btnYellow").on("mousedown touchstart", function(e) {
    e.preventDefault();
    if (!locked) {
      if (sequence[count] === 2) {
        playYellow();
      } else {
        playZonk();
      }
    }
  });

  $("#btnYellow").on("mouseup touchend", function() {
    if (!locked) {
      if (sequence[count] === 2) {
        releaseYellow();
      }
      count++;
      if (count === round) {
        round++;
        count = 0;
        playSequence(round, dur);
      }
    }
  });

  $("#btnBlue").on("mousedown touchstart", function(e) {
    e.preventDefault();
    if (!locked) {
      if (sequence[count] === 3) {
        playBlue();
      } else {
        playZonk();
      }
    }
 });

  $("#btnBlue").on("mouseup touchend", function() {
    if (!locked) {
      if (sequence[count] === 3) {
        releaseBlue();
      }
      count++;
      if (count === round) {
        round++;
        count = 0;
        playSequence(round, dur);
      }
    }
  });
});
