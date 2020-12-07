const startButton = document.querySelector("button[id='start']");
const stopButton = document.querySelector("button[id='stop']");
const tempo = document.querySelector("select[id='tempo']");
const sequencer = document.querySelectorAll(".sequencer div");
const noteLength = document.querySelector("select[id='note-length']");
let pulse;
let count = -1;

sequencer.forEach((step) => {
  step.addEventListener("click", () => {
    step.classList.toggle("active");
  });
});

startButton.addEventListener("click", () => {
  runSequence(true);
});

stopButton.addEventListener("click", () => {
  runSequence(false);
});

tempo.addEventListener("change", runSequence);
noteLength.addEventListener("change", runSequence);

function runSequence(play) {
  if (play) {
    if (pulse) {
      clearInterval(pulse);
    }
    pulse = setInterval(() => {
      count++;

      if (count > sequencer.length - 1) {
        count = 0;
      }

      blink(sequencer[count]);

      console.log(count);
    }, bpmToMil(tempo.value, noteLength.value));
  } else {
    clearInterval(pulse);
  }
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

function blink(step) {
  if (step.classList.contains("active") || step.classList.contains("pulse")) {
    step.classList.toggle("blink");
    setTimeout(() => {
      step.classList.toggle("blink");
    }, bpmToMil(tempo.value, noteLength.value) / 1.5);
  }
}
