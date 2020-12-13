// Controls
const playPauseButton = document.querySelector("button[id='play']");
const settingsButton = document.querySelector("button[id='settings']");
const closeButton = document.querySelector(".controls button");
const controls = document.querySelector(".controls");
const tempoSelect = document.querySelector("#tempo");
const noteLength = document.querySelector("#note-length");
const masterVol = document.querySelector("input[id='volume']");
let windowHeigth = window.innerHeight;
let windowWidth = window.innerWidth;

// Init-variables
let pulse;
let noteTime;
let count = 0;

// Audio
const audioCtx = new AudioContext();
audioCtx.suspend();

const master = audioCtx.createGain();
master.gain.value = masterVol.value;

// Oscs
const oscEnv = audioCtx.createGain();
oscEnv.gain.value = 0;
const oscGain = audioCtx.createGain();
oscGain.gain.value = 0.6;
const osc = audioCtx.createOscillator();
osc.type = "sawtooth";
const badOscGain = audioCtx.createGain();
badOscGain.gain.value = 0.4;
const badOsc = audioCtx.createOscillator();
badOsc.type = "sawtooth";

// Effects
const delay = audioCtx.createDelay();
delay.delayTime.value = 0.5;
const feedback = audioCtx.createGain();
const filter = audioCtx.createBiquadFilter();
filter.type = "lowpass";

// Connections
filter.connect(audioCtx.destination);
master.connect(filter);
oscEnv.connect(master);
oscGain.connect(oscEnv);
osc.connect(oscGain);
badOscGain.connect(oscEnv);
badOsc.connect(badOscGain);

oscEnv.connect(delay);
delay.connect(feedback);
feedback.connect(delay);
feedback.connect(master);

// Start Oscs
osc.start();
badOsc.start();

// Event listeners
playPauseButton.addEventListener("click", () => {
  switch (playPauseButton.id) {
    case "play":
      playPauseButton.id = "pause";
      playPauseButton.classList = "pause";
      playPauseButton.textContent = "Pause";
      audioCtx.resume();
      runSequencer(true);
      break;
    case "pause":
      playPauseButton.id = "play";
      playPauseButton.classList = "play";
      playPauseButton.textContent = "Play";
      audioCtx.suspend();
      runSequencer(false);
      break;
  }
});

settingsButton.addEventListener("click", () => {
  controls.classList.toggle("active");
});

closeButton.addEventListener("click", () => {
  controls.classList.toggle("active");
});

masterVol.addEventListener("change", () => {
  // set value over time?
  master.gain.value = masterVol.value;
});

tempoSelect.addEventListener("change", () => {
  if (playPauseButton.id === "pause") {
    runSequencer(true);
  }
});

noteLength.addEventListener("change", () => {
  if (playPauseButton.id === "pause") {
    runSequencer(true);
  }
});

window.addEventListener("resize", () => {
  windowWidth = window.innerHeight;
  windowHeigth = window.innerWidth;
});

document.body.addEventListener("mousemove", (e) => {
  filter.frequency.value = scaleValueX(1000, 6000, e.x);
  osc.detune.value = scaleValueY(-50, 50, e.y);
});

function scaleValueX(min, max, xPosition) {
  let increment = (max - min) / windowWidth;
  return increment * xPosition + min;
}

function scaleValueY(max, min, yPosition) {
  let increment = (max - min) / windowHeigth;
  return increment * yPosition + min;
}

function bpmToMil(tempo, noteLength = 1) {
  if (tempo === "lento") {
    tempo = randomRange(45, 60);
  } else if (tempo === "andante") {
    tempo = randomRange(76, 108);
  } else if (tempo === "allegro") {
    tempo = randomRange(120, 156);
  } else if (tempo === "presto") {
    tempo = randomRange(168, 200);
  }
  noteLength = 1 / noteLength;
  return (60000 / tempo) * noteLength;
}

function randomRange(min, max) {
  let random = Math.floor(Math.random() * max + 1);
  if (random < min) {
    return min;
  }
  return random;
}

function playDrunkNote(step, pitch, time) {
  if (noteTime) {
    clearTimeout(noteTime);
  }

  let randomTime = Math.floor(Math.random() * time);

  if (randomTime < time * 0.2) {
    randomTime = time;
  }

  if (step.classList.contains("active")) {
    step.classList.toggle("pink");
    startNote(pitch);
    noteTime = setTimeout(() => {
      step.classList.toggle("pink");
      stopNote();
    }, randomTime * 0.9);
  }
}

function startNote(pitch) {
  let startTime = audioCtx.currentTime;
  let detuneValue = Math.floor(Math.random() * 100);
  if (detuneValue < 30) {
    detuneValue = 30;
  }
  osc.frequency.value = pitch;
  badOsc.frequency.value = osc.frequency.value;
  badOsc.detune.value = detuneValue;
  oscEnv.gain.setTargetAtTime(1, startTime, 0.1);
}

function stopNote() {
  let stopTime = audioCtx.currentTime;
  oscEnv.gain.setTargetAtTime(0, stopTime, 0.01);
}

function timeBlink(timeMarker, time) {
  timeMarker.classList.toggle("pink");
  setTimeout(() => {
    timeMarker.classList.toggle("pink");
  }, time * 0.9);
}

function runSequencer(play = true) {
  if (play) {
    if (pulse) {
      clearInterval(pulse);
    }

    let time = bpmToMil(tempoSelect.value, noteLength.value);
    let feedbackGain = 0.01;
    let length = steps.length - 1;

    pulse = setInterval(() => {
      timeBlink(timeMarkers[count], time);
      playDrunkNote(steps[count], stepNotes[count].value, time);
      count++;
      if (count > length) {
        count = 0;
      }
      feedbackGain = feedbackGain * 1.01;
      if (feedbackGain > 1) {
        feedbackGain = 0.99;
      }
      feedback.gain.value = feedbackGain;
      console.log(feedback.gain.value);
    }, time);
  } else if (!play) {
    clearInterval(pulse);
  }
}
