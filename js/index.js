var powerOn = false;
var strict = false;
var start = false;
var locked = false;
var count = 0;
var round = 0;
var dur = 420;

var tones = ["G4", "E4", "C4", "G3", "Zonk"];  // value in hertz
var sequence = [];
var G3 = new Audio('audio/G3.mp3');
var C4 = new Audio('audio/C4.mp3');
var E4 = new Audio('audio/E4.mp3');
var G4 = new Audio('audio/G4.mp3');
var Zonk = new Audio('audio/Zonk.mp3');
for (let i = 0; i < 20; i++) {
  sequence.push(getRandomIntInclusive(0, 3));
}

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
      G4.play();
      break;
    case "E4":
      E4.currentTime = 0;
      E4.loop = true;
      E4.play();
      break;
    case "C4":
      C4.currentTime = 0;
      C4.loop = true;
      C4.play();
      break;
    case "G3":
      G3.currentTime = 0;
      G3.loop = true;
      G3.play();
      break;
    case "Zonk":
      Zonk.currentTime = 0;
      Zonk.loop = false;
      Zonk.play();
      break;
  }
}

function playGreen () {
  $("#btnGreen").css("background", "#4EDD60");
  $("#btnGreen").css("border-color", "#7f7f7f");
  playTone(tones[0]);
}

function playRed () {
  $("#btnRed").css("background", "'#CC7070'");
  $("#btnRed").css("border-color", "#7f7f7f");
  playTone(tones[1]);
}

function playYellow () {
  $("#btnYellow").css("background", "#CCCC80");
  $("#btnYellow").css("border-color", "#7f7f7f");
  playTone(tones[2]);
}

function playBlue () {
  $("#btnBlue").css("background", "#7090CC");
  $("#btnBlue").css("border-color", "#7f7f7f");
  playTone(tones[3]);
}

function releaseGreen() {
  $("#btnGreen").css("background", "#2ECC40");
  $("#btnGreen").css("border-color", "#000000");
  G4.pause();;
}

function releaseRed() {
  $("#btnRed").css("background", "#CC5050");
  $("#btnRed").css("border-color", "#000000");
  E4.pause();
}

function releaseYellow() {
  $("#btnYellow").css("background", "#CCCC40");
  $("#btnYellow").css("border-color", "#000000");
  C4.pause();
}

function releaseBlue() {
  $("#btnBlue").css("background", "#5070CC");
  $("#btnBlue").css("border-color", "#000000");
  G3.pause();
}

function playZonk() {
  playTone(tones[4], 4);
  //setTimeout(function() {zonk.pause();}, 1500);
  count = 0;
  playSequence(round, dur);
}

// Play a portion of the sequence
function playSequence(num, dur) {
  var time = 2000;

  lock();

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
    time += dur + 50;
  }
  setTimeout(function() {unlock();}, time);
}

$(document).ready( function() {
  "use strict";

  $("#btnGreen").on("mousedown", function() {
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

  $("#btnRed").on("mousedown", function() {
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

  $("#btnYellow").on("mousedown", function() {
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

  $("#btnBlue").on("mousedown", function() {
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

  round += 1;
  count = 0;
  playSequence(round, dur);
});

