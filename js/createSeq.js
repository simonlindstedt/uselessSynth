const sequenceLength = 8;

//Sequencer creation
const newSequencer = document.createElement("section");
newSequencer.className = "sequencer";

for (let i = 0; i < sequenceLength; i++) {
  let step = document.createElement("div");
  step.className = "step active";
  newSequencer.appendChild(step);
}

//Note selection creation
const noteSelection = document.createElement("section");
noteSelection.className = "note-selection";
let notes = ["A", "B", "C", "D", "E", "F", "G"];
let pitches = [440, 494, 523, 587, 659, 699, 785];

for (let i = 0; i < sequenceLength; i++) {
  let noteSelect = document.createElement("select");
  noteSelect.id = `note-${i}`;
  let x = 0;
  notes.forEach((note) => {
    let option = document.createElement("option");
    option.textContent = note;
    option.value = pitches[x];
    noteSelect.appendChild(option);
    x++;
  });
  noteSelection.appendChild(noteSelect);
}

// In main document
document.querySelector("main").appendChild(newSequencer);
document.querySelector("main").appendChild(noteSelection);
