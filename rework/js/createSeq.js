// let sequenceLength;
// const sequenceLengthSelector = document.querySelector(
//   "select[id='sequence-length']"
// );

// sequenceLength = sequenceLengthSelector.value;

document.querySelector("main").appendChild(createSequencer());
document.querySelector("main").appendChild(createNoteSelector());

// rewrite with objects!
function createSequencer(max = 8) {
  let newSequencer = document.createElement("section");
  newSequencer.className = "sequencer";

  for (let i = 0; i < max; i++) {
    let step = document.createElement("div");
    step.className = "step active";
    newSequencer.appendChild(step);
  }

  return newSequencer;
}

function createNoteSelector(max = 8) {
  let newNoteSelector = document.createElement("section");
  newNoteSelector.className = "note-selection";
  let notes = ["A", "B", "C", "D", "E", "F", "G"];
  let pitches = [440, 494, 523, 587, 659, 699, 785];

  for (let i = 0; i < max; i++) {
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
    newNoteSelector.appendChild(noteSelect);
  }

  return newNoteSelector;
}
