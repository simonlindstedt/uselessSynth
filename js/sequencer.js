const sequenceLength = document.querySelector("#sequence-length");
const sequencer = document.querySelector(".sequencer");
const sequencerNotes = document.querySelector(".sequencer-notes");

editSequencer(sequenceLength.value);

sequenceLength.addEventListener("change", (e) => {
  editSequencer(e.target.value);
});

function editSequencer(max) {
  sequencer.innerHTML = "";
  sequencerNotes.innerHTML = "";

  let notes = ["A", "B", "C", "D", "E", "F", "G"];
  let pitches = [440, 494, 523, 587, 659, 699, 785];

  for (let i = 0; i < max; i++) {
    let step = document.createElement("div");
    let noteSelect = document.createElement("select");
    step.className = "step active";

    let x = 0;

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
