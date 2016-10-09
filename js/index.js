var powerOn = false;
var strict = false;
var start = false;
var locked = false;
var count = 0;
var round = 0;
var dur = 420;

// create web audio api context, Oscillator, and Gain
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var oscillator;
var gainNode;

var tones = [392, 330, 262, 196, 64];  // value in hertz
var sequence = [];

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

function playTone(tone, gain) {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination)
  oscillator.frequency.value = tone;
  gainNode.gain.value = gain;
  oscillator.start();
}

function playGreen () {
  $("#btnGreen").css("background", "#4EDD60");
  $("#btnGreen").css("border-color", "#7f7f7f");
  playTone(tones[0],1);
}

function playRed () {
  $("#btnRed").css("background", "'#CC7070'");
  $("#btnRed").css("border-color", "#7f7f7f");
  playTone(tones[1],1);
}

function playYellow () {
  $("#btnYellow").css("background", "#CCCC80");
  $("#btnYellow").css("border-color", "#7f7f7f");
  playTone(tones[2],1);
}

function playBlue () {
  $("#btnBlue").css("background", "#7090CC");
  $("#btnBlue").css("border-color", "#7f7f7f");
  playTone(tones[3],1);
}

function releaseGreen() {
  $("#btnGreen").css("background", "#2ECC40");
  $("#btnGreen").css("border-color", "#000000");
  oscillator.stop();
}

function releaseRed() {
  $("#btnRed").css("background", "#CC5050");
  $("#btnRed").css("border-color", "#000000");
  oscillator.stop();
}

function releaseYellow() {
  $("#btnYellow").css("background", "#CCCC40");
  $("#btnYellow").css("border-color", "#000000");
  oscillator.stop();
}

function releaseBlue() {
  $("#btnBlue").css("background", "#5070CC");
  $("#btnBlue").css("border-color", "#000000");
  oscillator.stop();
}

function zonk() {
  playTone(tones[4], 4);
  oscillator.stop(1.5);
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

  var done = false;

  $("#btnGreen").on("mousedown", function() {
    if (!locked) {
      if (sequence[count] === 0) {
        playGreen();
      } else {
        zonk();
      }
    }
  });

  $("#btnGreen").on("mouseup", function() {
    if (!locked) {
      if (sequence[count] === 0) {
        releaseGreen();
      }
      count++;
    }
  });

  $("#btnRed").on("mousedown", function() {
    if (!locked) {
      if (sequence[count] === 1) {
        playRed();
      } else {
        zonk();
      }
    }
  });

  $("#btnRed").on("mouseup", function() {
    if (!locked) {
      if (sequence[count] === 1) {
        releaseRed();
      }
      count++;
    }
  });

  $("#btnYellow").on("mousedown", function() {
    if (!locked) {
      if (sequence[count] === 2) {
        playYellow();
      } else {
        zonk();
      }
    }
  });

  $("#btnYellow").on("mouseup", function() {
    if (!locked) {
      if (sequence[count] === 2) {
        releaseYellow;
      }
      count++;
    }
  });

  $("#btnBlue").on("mousedown", function() {
    if (!locked) {
      if (sequence[count] === 3) {
        playBlue();
      } else {
        zonk();
      }
    }
 });

  $("#btnBlue").on("mouseup", function() {
    if (!locked) {
      if (sequence[count] === 3) {
        releaseBlue();
      }
      count++;
    }
  });

  round += 1;
  count = 0;
  playSequence(round, dur);

  done = false;

});

