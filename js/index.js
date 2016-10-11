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

function playTone(tone) {
  switch (tone) {
    case "G4":
      G4.currentTime = 0;
      G4.loop = true;
      G4.volume = volume;
      G4.play();
      break;
    case "E4":
      E4.currentTime = 0;
      E4.loop = true;
      E4.volume = volume;
      E4.play();
      break;
    case "C4":
      C4.currentTime = 0;
      C4.loop = true;
      C4.volume = volume;
      C4.play();
      break;
    case "G3":
      G3.currentTime = 0;
      G3.loop = true;
      G3.volume = volume;
      G3.play();
      break;
    case "Zonk":
      Zonk.currentTime = 0;
      Zonk.loop = false;
      Zonk.volume = volume;
      Zonk.play();
      break;
  }
}

function playGreen () {
  $("#btnGreen").css("background", "#4FFF4F");
  playTone(tones[0]);
}

function playRed () {
  $("#btnRed").css("background", "#FF4F4F");
  playTone(tones[1]);
}

function playYellow () {
  $("#btnYellow").css("background", "#FFFF4F");
  playTone(tones[2]);
}

function playBlue () {
  $("#btnBlue").css("background", "#1F8FFF");
  playTone(tones[3]);
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
  playTone(tones[4], 4);
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
  if (num === 14) {
    dur = 220;
  } else if (num === 6) {
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

  $("#btnGreen").on("mousedown touchstart", function() {
    if (!locked) {
      if (sequence[count] === 0) {
        playGreen();
      } else {
        playZonk();
      }
    }
  });

  $("#btnGreen").on("mouseup", function() {
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

  $("#btnRed").on("mousedown touchstart", function() {
    if (!locked) {
      if (sequence[count] === 1) {
        playRed();
      } else {
        playZonk();
      }
    }
  });

  $("#btnRed").on("mouseup", function() {
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

  $("#btnYellow").on("mousedown touchstart", function() {
    if (!locked) {
      if (sequence[count] === 2) {
        playYellow();
      } else {
        playZonk();
      }
    }
  });

  $("#btnYellow").on("mouseup", function() {
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

  $("#btnBlue").on("mousedown touchstart", function() {
    if (!locked) {
      if (sequence[count] === 3) {
        playBlue();
      } else {
        playZonk();
      }
    }
 });

  $("#btnBlue").on("mouseup", function() {
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

