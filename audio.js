const startButton = document.querySelector("button[id='start']");
const stopButton = document.querySelector("button[id='stop']");
const volume = document.querySelector("input[id='volume']");
const freq = document.querySelector("input[id='freq']");
let h = window.innerHeight;
let w = window.innerWidth;

const audioCtx = new AudioContext();
audioCtx.suspend();

const masterVolume = audioCtx.createGain();
masterVolume.connect(audioCtx.destination);
masterVolume.gain.value = volume.value;

const filter = audioCtx.createBiquadFilter();
filter.type = "lowpass";
filter.connect(masterVolume);

const vibrato = audioCtx.createGain();
vibrato.gain.value = 50;

const lfo = audioCtx.createOscillator();
lfo.connect(vibrato);
lfo.frequency.value = 5;

const oscs = [];
const numberOfOscs = 8;

for (let i = 0; i < numberOfOscs; i++) {
  let random = Math.random();
  let osc = audioCtx.createOscillator();
  let oscGain = audioCtx.createGain();
  osc.type = "sawtooth";
  vibrato.connect(osc.detune);
  oscGain.gain.value = 0.5 / numberOfOscs;
  osc.detune.value = Math.floor(random * 100) + 1;
  osc.connect(oscGain);
  oscGain.connect(filter);
  oscs[i] = [osc, oscGain];
}

startOscillators(oscs);
setFrequency(oscs, freq.value);

window.addEventListener("resize", () => {
  w = window.innerHeight;
  h = window.innerWidth;
});

document.body.addEventListener("mousemove", (e) => {
  filter.frequency.value = setFilter(10000, e.x);
});

startButton.addEventListener("click", () => {
  audioCtx.resume();
});

stopButton.addEventListener("click", () => {
  audioCtx.suspend();
});

volume.addEventListener("change", () => {
  masterVolume.gain.value = volume.value;
});

freq.addEventListener("change", () => {
  setFrequency(oscs, freq.value);
});

function startOscillators(oscs) {
  lfo.start(0);

  oscs.forEach((oscItem) => {
    oscItem[0].start(0);
  });
}

function setFrequency(oscs, freq) {
  let baseFreq = freq;
  let semitone = 0;

  for (let i = 0; i < oscs.length; i++) {
    if (i === 0) {
      oscs[i][0].frequency.value = baseFreq;
    } else {
      if (semitone === 0) {
        semitone = 3;
        oscs[i][0].frequency.value = intervalToFrequency(baseFreq, semitone);
      } else {
        semitone += 3;
        oscs[i][0].frequency.value = intervalToFrequency(baseFreq, semitone);
      }
    }
  }
}

function intervalToFrequency(baseFrequency, semitone) {
  return baseFrequency * Math.pow(2, semitone / 12);
}

function setFilter(maxFreq, xPosition) {
  let incr = maxFreq / w;
  return xPosition * incr;
}
