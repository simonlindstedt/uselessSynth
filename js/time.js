const start = document.querySelector("button[id='start']");
const stop = document.querySelector("button[id='stop']");
const pulse = document.querySelector(".pulse");
const bpm = document.querySelector("input[id='bpm']");
const note = document.querySelector("select[id='note-value']");
const sequencer = document.querySelectorAll(".sequencer div");
let metro = undefined;
let i = 0;

start.addEventListener("click", () => {
  setRunSequence(true);
});
stop.addEventListener("click", () => {
  setRunSequence(false);
});
bpm.addEventListener("change", setRunSequence);
note.addEventListener("change", setRunSequence);

setRunSequence(true);

function bpmToMil(bpm, note = 4) {
  note = 1 / note;
  return (60000 / bpm) * note;
}

function setRunSequence(play) {
  if (play) {
    if (metro) {
      clearInterval(metro);
    }

    metro = setInterval(() => {
      blink(pulse);

      i = counter(i, sequencer.length - 1);

      stepSelect(i, sequencer);
    }, bpmToMil(bpm.value, note.value));
  } else {
    clearInterval(metro);
  }
}

function blink(step) {
  step.classList.toggle("blink");
  setTimeout(() => {
    step.classList.toggle("blink");
  }, bpmToMil(bpm.value, note.value) / 1.1);
}

function playNote(step) {
  step.classList.toggle("play");
  setTimeout(() => {
    step.classList.toggle("play");
  }, bpmToMil(bpm.value, note.value));
}

function stepSelect(stepIndex, steps) {
  blink(steps[stepIndex - 1]);
  playNote(steps[stepIndex - 1]);
}

function counter(count, max) {
  if (count > max) {
    count = 0;
  }
  return (count += 1);
}
