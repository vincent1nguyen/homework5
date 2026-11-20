class StickyNotes extends HTMLElement {
  static get observedAttributes() {
    return ["compact"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "compact") {
      this.updateStatus();
    }
  }

  constructor() {
    super();

    this.notes = [
      "Finish cse134B homework today",
      "Study for final exam next week",
    ];

    this.currentIndex = 0;
  }

  connectedCallback() {
    const heading = document.createElement("h2");
    heading.textContent = "Sticky Notes Board";
    this.appendChild(heading);

    this.board = document.createElement("div");
    this.board.className = "notes-board";
    this.appendChild(this.board);

    this.notes.forEach((note, index) => {
      this.createStickyNote(note, index);
    });

    // Create and add behavior for Next Button
    const nextButton = document.createElement("button");
    nextButton.className = "next-note-button";
    nextButton.type = "button";
    nextButton.textContent = "Next Note";
    nextButton.addEventListener("click", () => this.nextNote());
    this.appendChild(nextButton);

    // Create and add behavior for Fact Button
    this.factButton = document.createElement("button");
    this.factButton.className = "fact-button";
    this.factButton.type = "button";
    this.factButton.textContent = "Get Cat Fact";
    this.factButton.addEventListener("click", () => this.getCatFact());
    this.appendChild(this.factButton);

    // Create loading message
    this.apiStatus = document.createElement("p");
    this.apiStatus.setAttribute("role", "status");
    this.apiStatus.textContent = "Ready to load a cat fact.";

    this.appendChild(this.apiStatus);

    // Create status message
    this.status = document.createElement("p");
    this.status.textContent = `Note ${this.currentIndex + 1} of ${this.notes.length}`;
    this.appendChild(this.status);
  }

  createStickyNote(note, index) {
    const stickyNote = document.createElement("div");
    stickyNote.className = "sticky-note";

    if (index == this.currentIndex) {
      stickyNote.classList.add("selected");
    }

    const textInput = document.createElement("textarea");
    textInput.value = note;
    textInput.setAttribute("aria-label", `Note ${index + 1}`);
    textInput.placeholder = "Write on this note...";

    textInput.addEventListener(
      "input",
      () => (this.notes[index] = textInput.value),
    );

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "Add Note";
    addButton.addEventListener("click", () => this.addNote());

    stickyNote.appendChild(textInput);
    stickyNote.appendChild(addButton);
    this.board.appendChild(stickyNote);
  }

  addNote(note = "") {
    const index = this.notes.length;

    // Remove highlight from the currently selected note
    const stickyNotes = this.board.querySelectorAll(".sticky-note");
    stickyNotes[this.currentIndex].classList.remove("selected");

    // Update the selected index
    this.currentIndex = index;

    // Create the new note
    this.notes.push(note);
    this.createStickyNote(note, index);
    this.updateStatus();
  }

  nextNote() {
    const stickyNotes = this.board.querySelectorAll(".sticky-note");

    stickyNotes[this.currentIndex].classList.remove("selected");

    this.currentIndex = (this.currentIndex + 1) % this.notes.length;

    stickyNotes[this.currentIndex].classList.add("selected");

    this.updateStatus();
  }

  updateStatus() {
    const mode = this.hasAttribute("compact") ? "Compact" : "Normal";

    this.status.textContent = `Note ${this.currentIndex + 1} of ${this.notes.length} — ${mode} View`;
  }

  async getCatFact() {
    this.factButton.disabled = true;
    this.apiStatus.textContent = "Loading cat fact...";

    try {
      const response = await fetch("https://catfact.ninja/fact");

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();

      if (typeof data?.fact !== "string") {
        throw new Error("Invalid cat fact response");
      }

      this.addNote(data.fact);
      this.apiStatus.textContent = "Cat fact added";
    } catch (error) {
      console.error("Could not load cat fact:", error);
      this.apiStatus.textContent = "Could not load cat fact. Please try again.";
    } finally {
      this.factButton.disabled = false;
    }
  }
}

customElements.define("sticky-notes", StickyNotes);
const toggleButton = document.querySelector("#toggle-compact");
const stickyNotes = document.querySelector("sticky-notes");
toggleButton.hidden = false;

// Restore saved preference when the page loads
let savedMode = "normal";

try {
  const storedValue = localStorage.getItem("hw5-sticky-notes-mode");

  if (storedValue === "compact" || storedValue === "normal") {
    savedMode = storedValue;
  }
} catch (error) {
  console.error("Could not load sticky notes preference:", error);
}

stickyNotes.toggleAttribute("compact", savedMode === "compact");

toggleButton.textContent =
  savedMode === "compact" ? "Switch to Normal View" : "Switch to Compact View";

// Save the preference when the button is clicked
toggleButton.addEventListener("click", () => {
  stickyNotes.toggleAttribute("compact");

  const mode = stickyNotes.hasAttribute("compact") ? "compact" : "normal";

  toggleButton.textContent =
    mode === "compact" ? "Switch to Normal View" : "Switch to Compact View";

  try {
    localStorage.setItem("hw5-sticky-notes-mode", mode);
  } catch (error) {
    console.error("Could not save sticky notes preference:", error);
  }
});
