const sequencer = document.querySelector(".sequencer");
const sequencerNotes = document.querySelector(".sequencer-notes");
const sequencerTime = document.querySelector(".sequencer-time");

editSequencer();
const steps = document.querySelectorAll(".step");
const stepNotes = document.querySelectorAll(".sequencer-notes select");
const timeMarkers = document.querySelectorAll(".time-marker");

function editSequencer(max = 8) {
  if (max > 16) {
    console.log("I saw that! Please reload the page.");
    return null;
  }

  sequencer.innerHTML = "";
  sequencerNotes.innerHTML = "";
  sequencerTime.innerHTML = "";

  let notes = ["A", "B", "C", "D", "E", "F", "G"];
  let pitches = [440, 494, 523, 587, 659, 699, 785];

  for (let i = 0; i < pitches.length; i++) {
    pitches[i] = pitches[i] / 2;
  }

  for (let i = 0; i < max; i++) {
    let step = document.createElement("div");
    let noteSelect = document.createElement("select");
    let timeMarker = document.createElement("div");
    let x = 0;

    if (i === 0) {
      step.classList.add("step", "active");
    } else if (Math.random() > 0.4) {
      step.classList.add("step", "active");
    } else {
      step.classList.add("step");
    }

    step.addEventListener("click", (e) => {
      e.target.classList.toggle("active");
    });

    timeMarker.classList.add("time-marker");

    notes.forEach((note) => {
      let option = document.createElement("option");
      option.textContent = note;
      option.value = pitches[x];
      if (x === Math.floor(Math.random() * 8)) {
        option.setAttribute("selected", "");
      }
      noteSelect.appendChild(option);
      x++;
    });

    sequencer.appendChild(step);
    sequencerNotes.appendChild(noteSelect);
    sequencerTime.appendChild(timeMarker);
  }
}

function interToFreq(frequency, semitone) {
  return frequency * Math.pow(2, semitone / 12);
}
