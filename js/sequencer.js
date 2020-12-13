// Controls
const startButton = document.querySelector("button[id='start']");
const stopButton = document.querySelector("button[id='stop']");
const sequenceLength = document.querySelector("#sequence-length");
const sequencer = document.querySelector(".sequencer");
const sequencerNotes = document.querySelector(".sequencer-notes");
const tempoSelect = document.querySelector("#tempo");
const noteLength = document.querySelector("#note-length");
const masterVol = document.querySelector("input[id='volume']");

editSequencer(sequenceLength.value);
const steps = document.querySelectorAll(".step");
const stepNotes = document.querySelectorAll(".sequencer-notes select");

// Init-variables
let pulse;
let noteTime;
let count = -1;

// Audio

const audioCtx = new AudioContext();
audioCtx.suspend();
const master = audioCtx.createGain();
const oscEnv = audioCtx.createGain();
const osc = audioCtx.createOscillator();
oscEnv.gain.value = 0;
master.gain.value = masterVol.value;

master.connect(audioCtx.destination);
oscEnv.connect(master);
osc.connect(oscEnv);
osc.start();

// fix later
// sequenceLength.addEventListener("change", (e) => {
//   editSequencer(e.target.value);
// });

startButton.addEventListener("click", () => {
  audioCtx.resume();
  runSequencer(true);
});

stopButton.addEventListener("click", () => {
  audioCtx.suspend();
  runSequencer(false);
});

masterVol.addEventListener("change", () => {
  // e.target.value ?
  master.gain.value = masterVol.value;
});

tempoSelect.addEventListener("change", () => {
  runSequencer(true);
});

noteLength.addEventListener("change", () => {
  runSequencer(true);
});

function editSequencer(max = 8) {
  if (max > 16) {
    console.log("I saw that! Please reload the page.");
    return null;
  }

  sequencer.innerHTML = "";
  sequencerNotes.innerHTML = "";

  let notes = ["A", "B", "C", "D", "E", "F", "G"];
  let pitches = [440, 494, 523, 587, 659, 699, 785];

  for (let i = 0; i < max; i++) {
    let step = document.createElement("div");
    step.id = i;
    let noteSelect = document.createElement("select");
    let x = 0;

    step.className = "step active";
    step.addEventListener("click", (e) => {
      e.target.classList.toggle("active");
    });

    notes.forEach((note) => {
      let option = document.createElement("option");
      option.textContent = note;
      option.value = pitches[x];
      noteSelect.appendChild(option);
      x++;
    });

    sequencer.appendChild(step);
    sequencerNotes.appendChild(noteSelect);
  }
}

function runSequencer(play = true) {
  if (play) {
    if (pulse) {
      clearInterval(pulse);
    }

    let time = bpmToMil(tempoSelect.value, noteLength.value);
    let count = 0;
    let length = sequenceLength.value - 1;

    pulse = setInterval(() => {
      playNote(steps[count], time, stepNotes[count].value);
      count++;
      if (count > length) {
        count = 0;
      }
    }, time);
  } else if (!play) {
    clearInterval(pulse);
  }
}

function randomRange(min, max) {
  let random = Math.floor(Math.random() * max + 1);
  if (random < min) {
    return min;
  }
  return random;
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

function playNote(step, time, pitch) {
  if (noteTime) {
    clearTimeout(noteTime);
    console.log("hello clear");
  }
  if (step.classList.contains("active")) {
    step.classList.toggle("pink");
    startNote(pitch);
    noteTime = setTimeout(() => {
      step.classList.toggle("pink");
      stopNote();
    }, time * 0.9);
  }
}

function startNote(pitch) {
  osc.frequency.value = pitch;
  oscEnv.gain.value = 1;
}
function stopNote() {
  oscEnv.gain.value = 0;
}

// fix drunk later

// function drunkBlink(step, time) {
//   let randomTime = Math.floor(Math.random() * time);

//   if (step.classList.contains("active")) {
//     setTimeout(() => {
//       step.classList.toggle("blink");
//       console.log("start");
//       setTimeout(() => {
//         step.classList.toggle("blink");
//         console.log("stop");
//       }, randomTime * 0.9);
//     }, randomTime);
//   }
// }
