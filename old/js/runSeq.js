const start = document.querySelector("button[id='start']");
const stop = document.querySelector("button[id='stop']");
const pulse = document.querySelector(".pulse");
const bpm = document.querySelector("input[id='bpm']");
const noteLength = document.querySelector("select[id='note-length']");
const noteValues = document.querySelectorAll(".note-selection select");
const volume = document.querySelector("input[id='volume']");
const sequencer = document.querySelectorAll(".sequencer div");
let metro = undefined;
let i = 0;

// Audio

const audioCtx = new AudioContext();
audioCtx.suspend();

const masterVol = audioCtx.createGain();
masterVol.connect(audioCtx.destination);
masterVol.gain.value = volume.value;

const osc = audioCtx.createOscillator();
const badOsc = audioCtx.createOscillator();
const oscEnv = audioCtx.createGain();
const badOscEnv = audioCtx.createGain();
osc.type = "sawtooth";
badOsc.type = "sawtooth";
osc.connect(oscEnv);
badOsc.connect(badOscEnv);
oscEnv.connect(masterVol);
badOscEnv.connect(masterVol);

osc.start(0);
badOsc.start(0);

//

sequencer.forEach((sequence) => {
  sequence.addEventListener("click", () => {
    sequence.classList.toggle("active");
  });
});

volume.addEventListener("change", () => {
  masterVol.gain.value = volume.value;
});

start.addEventListener("click", () => {
  audioCtx.resume();
  setRunSequence(true);
});

stop.addEventListener("click", () => {
  audioCtx.suspend();
  setRunSequence(false);
});

bpm.addEventListener("change", setRunSequence);

noteLength.addEventListener("change", setRunSequence);

function setRunSequence(play) {
  if (play) {
    if (metro) {
      clearInterval(metro);
    }

    metro = setInterval(() => {
      blink(pulse);

      i++;

      if (i > sequencer.length) {
        i = 1;
      }

      blink(sequencer[i - 1]);

      playNote(sequencer[i - 1], noteValues[i - 1].value);
    }, bpmToMil(bpm.value, noteLength.value));
  } else {
    clearInterval(metro);
  }
}

function blink(step) {
  step.classList.toggle("blink");
  setTimeout(() => {
    step.classList.toggle("blink");
  }, bpmToMil(bpm.value, noteLength.value) / 1.1);
}

function playNote(step, pitch) {
  if (step.classList.contains("active")) {
    osc.frequency.value = pitch;
    badOsc.frequency.value = pitch;
    badOsc.detune.value = 100;
    oscEnv.gain.value = 0.4;
    badOscEnv.gain.value = 0.4;
    setTimeout(() => {
      oscEnv.gain.value = 0;
      badOscEnv.gain.value = 0;
    }, bpmToMil(bpm.value, noteLength.value) / 1.1);
  }
}

function bpmToMil(bpm, note = 4) {
  note = 1 / note;
  return (60000 / bpm) * note;
}
