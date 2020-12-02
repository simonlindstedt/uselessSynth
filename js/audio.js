const startButton = document.querySelector("button[id='start']");
const stopButton = document.querySelector("button[id='stop']");
const volume = document.querySelector("input[id='volume']");
const freq = document.querySelector("input[id='freq']");

const audioCtx = new AudioContext();
audioCtx.suspend();
const masterVolume = audioCtx.createGain();
const oscs = [];
const numberOfOscs = 16;

for (let i = 0; i < numberOfOscs; i++) {
  let osc = audioCtx.createOscillator();
  let oscGain = audioCtx.createGain();
  oscGain.gain.value = 0.5 / numberOfOscs;
  osc.connect(oscGain);
  oscGain.connect(masterVolume);
  oscs[i] = [osc, oscGain];
}

masterVolume.connect(audioCtx.destination);
masterVolume.gain.value = volume.value;

startOscillators(oscs);
setFrequency(oscs, freq.value);

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
  oscs.forEach((oscItem) => {
    oscItem[0].start(0);
  });
}

function setFrequency(oscs, freq) {
  let baseFreq = freq;
  let semitone = 0;

  for (let i = 0; i < oscs.length; i++) {
    if (i === 0) {
      console.log("baseFreq:", baseFreq);
      oscs[i][0].frequency.value = baseFreq;
    } else {
      if (semitone === 0) {
        semitone = 3;
        console.log(intervalToFrequency(baseFreq, semitone));
        oscs[i][0].frequency.value = intervalToFrequency(baseFreq, semitone);
      } else {
        semitone += 3;
        console.log(intervalToFrequency(baseFreq, semitone));
        oscs[i][0].frequency.value = intervalToFrequency(baseFreq, semitone);
      }
    }
  }
}

function intervalToFrequency(baseFrequency, semitone) {
  return baseFrequency * Math.pow(2, semitone / 12);
}
