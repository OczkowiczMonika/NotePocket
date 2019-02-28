let notes = new Set();



function addNote(header, noteText, transformValue) {

    let targetElement = document.querySelector(".container");



    let noteModel = new NoteModel(header, noteText, transformValue);

    let noteView = new NoteView(targetElement);

    let noteController = new NoteController(noteView, noteModel);



    notes.add(noteModel);

    noteController.showNote();

}



function save() {

    localStorage.setItem("notes", JSON.stringify([...notes]));

}



function load() {

    let localNotes = JSON.parse(localStorage.getItem("notes"));

    if(localNotes !== null) {

        for(let note of localNotes) {

            let header = note._header;

            let noteText = note._noteText;

            let transformValue = note._transformValue;



            addNote(header, noteText, transformValue);

        }

    }

}



function remove(note) {

    notes.delete(note);

}



function createEmptyNote() {

    let header = "Add header";

    let noteText = "Add note";

    let transformValue = "translateX(300px)";



    addNote(header, noteText, transformValue);

}



function addListeners() {

    document.getElementById("corner-button").addEventListener("click", createEmptyNote);

}



function init() {

    addListeners();

    load();

}



class NoteModel {

    constructor(header, noteText, transformValue) {

        this._header = header;

        this._noteText = noteText;

        this._transformValue = transformValue;

    }



    get header() {

        return this._header;

    }



    set header(header) {

        this._header = header;

    }



    get noteText() {

        return this._noteText;

    }



    set noteText(noteText) {

        this._noteText = noteText;

    }



    get transformValue() {

        return this._transformValue;

    }



    set transformValue(transformValue) {

        this._transformValue = transformValue;

    }

}



class NoteView {

    constructor(element) {

        this._element = element;



        this.handleGrab = null;

        this.handleClose = null;

        this.handleHeaderChange = null;

        this.handleNoteChange = null;

    }



    render(noteModel) {

        let note = document.createElement("div");

        let noteHeader = document.createElement("div");

        let headerTextarea = document.createElement("textarea");

        let closeButton = document.createElement("button");

        let noteTextarea = document.createElement("textarea");



        note.style.transform = noteModel.transformValue;



        note.addEventListener("mousedown", this.handleGrab);

        closeButton.addEventListener("click", this.handleClose);

        headerTextarea.addEventListener("input", this.handleHeaderChange);

        noteTextarea.addEventListener("input", this.handleNoteChange);

        closeButton.innerHTML = "x";

        headerTextarea.value = noteModel.header;

        noteTextarea.value = noteModel.noteText;



        headerTextarea.wrap = "off";



        note.classList.add("note");

        noteHeader.classList.add("note-header");

        headerTextarea.classList.add("header-textarea");

        closeButton.classList.add("close-button");

        noteTextarea.classList.add("note-textarea");



        noteHeader.appendChild(headerTextarea);

        noteHeader.appendChild(closeButton);

        note.appendChild(noteHeader);

        note.appendChild(noteTextarea);



        this._element.appendChild(note);

    }

}




let draggedElement;

let grabPointX;

let grabPointY;



class NoteController {

    constructor (noteView, noteModel) {

        this._noteView = noteView;

        this._noteModel = noteModel;

        console.log("CONST: ",this._noteModel)

        this.addListeners();

        this.initialize();

    }



    initialize() {

        this._noteView.handleGrab = this.handleGrab.bind(this);

        this._noteView.handleClose = this.handleClose.bind(this);

        this._noteView.handleHeaderChange = this.handleHeaderChange.bind(this);

        this._noteView.handleNoteChange = this.handleNoteChange.bind(this);

    }



    showNote() {

        this._noteView.render(this._noteModel);

    }



    isGrabbingHeader() {

        return draggedElement.className === "note-header";

    }



    moveActiveNoteOnTop() {

        let othernoteText = document.getElementsByClassName("note");



        for(let i = 0; i < othernoteText.length; i++) {

            othernoteText[i].style.zIndex = 0;

        }



        draggedElement.parentElement.style.zIndex = 1;

    }



    handleGrab(e) {

        draggedElement = e.target;



        if(!this.isGrabbingHeader()) {

            return;

        }



        this.moveActiveNoteOnTop();

        

        grabPointX = draggedElement.getBoundingClientRect().left - e.clientX;

        grabPointY = draggedElement.getBoundingClientRect().top - e.clientY;

    }



    handleDrag(e) {

        if(!draggedElement) {

            return;

        }



        if(draggedElement.className !== "note-header") {

            return;

        }



        let posX = e.clientX + grabPointX;

        let posY = e.clientY + grabPointY;

        let transformValuee = `translateX(${posX}px) translateY(${posY}px)`;

        

        draggedElement.parentElement.style.transform = transformValuee;

     

    }



    handleDrop(e) {

        draggedElement = null;

        grabPointX = null;

        grabPointY = null;

    }



    handleClose(e){

        let closeButton = e.target;

        closeButton.parentElement.parentElement.remove();

        remove(this._noteModel);

    }



    handleHeaderChange(e) {

        let headerText = e.target.value;

        this._noteModel.header = headerText;

    }



    handleNoteChange(e) {

        let noteText = e.target.value;

        this._noteModel.noteText = noteText;

    }



    addListeners() {

        document.addEventListener("mousemove", this.handleDrag);

        document.addEventListener("mouseup", this.handleDrop);

    }

}
