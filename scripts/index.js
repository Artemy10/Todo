const todoList = document.getElementById("root");
const createNote = document.forms["create-note"];

const btnConfigurates = document.querySelectorAll("button[data-switch]");
const btnClearCompleted = document.getElementById("clear-completed");
const btnChangeTheme = document.getElementById("change-theme");

const html = document.documentElement;
const imgTheme = document.getElementById("img-theme");


const View = {
    renderNote(note) {
        const className = `note-container${ !note.completed ? "" : " note-complete" }`;

        return `
            <li id=${ note.id } draggable=true class="${ className }">
                <span onclick=Controller.handleCheck(${ note.id }) class="span-checkbox">
                    <span class="span-hover">
                        <span class="sub-span-hover"></span>
                    </span>
                    <img class="img-check" src="./images/icon-check.svg" alt="arrow-done" />
                    ${ +note.completed ? '<input class="checkbox-hidden" type="checkbox" checked />' : '<input class="checkbox-hidden" type="checkbox" />' }
                </span>
                <span class="inp-event">${ note.text }</span>
                <button class="btn-del-note" onclick=Controller.handleDelete(${ note.id })>
                    <img src="./images/icon-cross.svg" />
                </button>
            </li>
        `;
    },

    renderCountNotes() {
        const countNotes = document.getElementById("count-notes");
        const count = Controller.state.notes.filter(el => !el.completed).length;

        countNotes.innerHTML = `${ count } items left`;
    },

    render({notes, activeNotes, theme}) {
        html.setAttribute("theme", `${ theme }`);
        (theme === "light") ? imgTheme.src = "./images/icon-sun.svg" : imgTheme.src = "./images/icon-moon.svg";

        [...btnConfigurates].map(btn => {
            if (btn.dataset.switch == Controller.state.activeNotes) btn.classList.add("active");
            else {
                btn.classList.remove("active")
            }
        });

        if (activeNotes === "all") {
            todoList.innerHTML = `
                <ul id="task-list">
                    ${ notes.map(note => this.renderNote(note)).join("") }
                </ul>
            `;
        }
        else if (+activeNotes) {
            todoList.innerHTML = `
                <ul id="task-list">
                    ${ notes.filter(note => note.completed).map(note => this.renderNote(note)).join("") }
                </ul>
            `;
        }
        else if (!+activeNotes) {
            todoList.innerHTML = `
                <ul id="task-list">
                    ${ notes.filter(note => !note.completed).map(note => this.renderNote(note)).join("") }
                </ul>
            `;
        }

        this.renderCountNotes();

        Controller.dragElements();
    },

};

const Controller = {
    state: {
        notes: [],
        theme: "dark",
        activeNotes: "all",
    },

    init(state) {
        this.state = state;
        this.listen();

        View.render(this.state);
    },

    listen() {
        const inpCheck = createNote.querySelector("input[type='checkbox']");

        inpCheck.addEventListener("change", (e) => {
            const { target } = e;
    
            target.checked ? createNote.classList.add("checked") : createNote.classList.remove("checked");
        });

        for (let i = 0; i < btnConfigurates.length; i++) {
            btnConfigurates[i].addEventListener("click", (e) => {
                const { target } = e;

                Controller.state.activeNotes = target.dataset.switch;

                this.localStorage(this.state);

                View.render(Controller.state);
            })
        }

        createNote.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const { target : form } = e;
            const data = new FormData(form);
            const dataObject = Object.fromEntries(data.entries());
            
            if (dataObject.text.length !== 0) {
                this.addNote(dataObject);

                createNote.classList.remove("checked");
            }

            form.reset();
        })

        btnClearCompleted.addEventListener("click", (e) => this.handleClearCompleted());

        btnChangeTheme.addEventListener("click", (e) => {
            if (html.getAttribute("theme") === "dark") {
                imgTheme.src = "./images/icon-sun.svg";
                html.setAttribute("theme", "light");

                this.state.theme = "light";
                this.localStorage(this.state);
            }
            else {
                imgTheme.src = "./images/icon-moon.svg";
                html.setAttribute("theme", "dark");
                
                this.state.theme = "dark";
                this.localStorage(this.state);
            }
        })
    },

    addNote(note) {
        this.state.notes.push({
            id: Date.now().toString(), 
            text: note.text,
            completed: note.checkbox ? true : false 
        });

        this.localStorage(this.state);

        View.render(this.state)
    },

    localStorage(state) {
        localStorage.todo = JSON.stringify(state);
    },

    handleCheck(id) {
        const { notes } = this.state;
        
        const index = this.state.notes.findIndex(el => el.id === `${ id }`);
        
        notes[index].completed = !notes[index].completed;
        
        this.localStorage(this.state);
        
        View.render(this.state);
    },
    
    handleDelete(id) {
        this.state.notes.splice(this.state.notes.findIndex(el => el.id === `${ id }`),1);
        
        this.localStorage(this.state);
        
        View.render(this.state);
    },
    
    handleClearCompleted() {
        const { notes } = this.state;

        this.state.notes = notes.filter(el => el.completed === false);
        
        this.localStorage(this.state);
        
        View.render(this.state);
    },

    swapNote({ id : current }, { id : next }) {
        const array = this.state.notes;
        
        let currEl = {};
        let currEle = {};
        let nextEl = {};

        for (let i = 0; i < array.length; i++) {
            if (array[i].id === current) {
                currEl = array[i];
                currEl.index = i;
            }
            
            if (array[i].id === next) {
                nextEl = array[i];
                nextEl.index = i;
            }
        }

        if (Object.keys(currEl).length && Object.keys(nextEl).length) {
            array[currEl.index] = nextEl;
            array[nextEl.index] = currEl;
        }

        this.state.notes = array;

        this.localStorage(this.state);
    },

    dragElements() {
        const taskList = document.getElementById("task-list");

        taskList.addEventListener(`dragstart`, (e) => {
            e.target.classList.add(`selected`);
        })

        taskList.addEventListener(`dragend`, (e) => {
            e.target.classList.remove(`selected`);  
        });

        taskList.addEventListener(`dragover`, (e) => {
            e.preventDefault();

            const { target } = e;
            const activeElement = taskList.querySelector(`.selected`);
            
            const isMoveable = activeElement !== target &&
            target.classList.contains(`note-container`);

            if (!isMoveable) {
                return;
            }

            const nextElement = (target === activeElement.nextElementSibling) ?
                target.nextElementSibling :
                target;

            this.swapNote(activeElement, target);

            taskList.insertBefore(activeElement, nextElement);
        });
    }
};

(async () => {
    const local = localStorage.length ? JSON.parse(localStorage.todo) : Controller.state;

    Controller.init(local);
})();
