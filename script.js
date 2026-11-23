const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const boxes = document.querySelectorAll(".task-column");
const tasks = document.querySelectorAll(".task");
const newtaskbtn = document.querySelector("#newtask");
const count = document.querySelectorAll(".right");

let tasksdata = JSON.parse(localStorage.getItem("tasks")) || [];

const background = document.createElement("div");
background.className = "background";

const bg = document.createElement("div");
bg.className = "bg";

const model = document.createElement("div");
model.className = "model";

const titleInput = document.createElement("input");
titleInput.type = "text";
titleInput.id = "task-title";
titleInput.required = true;
titleInput.placeholder = "Task Title";

const textarea = document.createElement("textarea");
textarea.id = "task-desc";
textarea.required = true;
textarea.placeholder = "Task Description";

const button = document.createElement("button");
button.id = "submit";
button.type = "submit";
button.textContent = "Add Task";

let draggedtask = null;

function updateCount() {
  count[0].textContent = todo.querySelectorAll(".task").length
  count[1].textContent = progress.querySelectorAll(".task").length
  count[2].textContent = done.querySelectorAll(".task").length
}

function createTaskElement(task) {
  const tasktemplate = document.createElement("div");
  tasktemplate.className = "task";
  tasktemplate.draggable = true;
  tasktemplate.innerHTML = `<h3>${task.title}</h3>
              <p>${task.desc}</p>
              <button class="delete">Delete</button>`;

  const deletebtn = tasktemplate.querySelector(".delete");
  deletebtn.addEventListener("click", () => {
    tasktemplate.remove();
    tasksdata = tasksdata.filter(
      (t) => !(t.title === task.title && t.desc === task.desc),
    );
    localStorage.setItem("tasks", JSON.stringify(tasksdata));
    updateCount();
  });

  tasktemplate.addEventListener("dragstart", () => {
    draggedtask = tasktemplate;
  });

  return tasktemplate;
}

function drag(column) {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    column.classList.add("dragging");
  });
  column.addEventListener("dragleave", () => {
    column.classList.remove("dragging");
  });
  column.addEventListener("drop", () => {
    column.classList.remove("dragging");

    if (draggedtask) {
      const title = draggedtask.querySelector("h3")?.textContent;
      const desc = draggedtask.querySelector("p")?.textContent;
      for (const task of tasksdata) {
        if (task.title === title && task.desc === desc) {
          task.status = column.id;
          break;
        }
      }
    }
    localStorage.setItem("tasks", JSON.stringify(tasksdata));
    updateCount();
  });
}

newtaskbtn.addEventListener("click", (e) => {
  model.append(titleInput, textarea, button);
  bg.appendChild(model);
  document.body.append(background, bg);
});

button.addEventListener("click", (e) => {
  let task = {
    title: titleInput.value,
    desc: textarea.value,
    status: "todo",
  };

  tasksdata.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasksdata));

  const tasktemplate = createTaskElement(task);
  background.remove();
  bg.remove();
  todo.appendChild(tasktemplate);

  updateCount();

  titleInput.value = "";
  textarea.value = "";
});

boxes.forEach((box) => {
  box.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  box.addEventListener("drop", (e) => {
    box.appendChild(draggedtask);
  });
  drag(box);
});

for (const task of tasksdata) {
  const tasktemplate = createTaskElement(task);

  if (task.status === "todo") {
    todo.appendChild(tasktemplate);
  } else if (task.status === "progress") {
    progress.appendChild(tasktemplate);
  } else if (task.status === "done") {
    done.appendChild(tasktemplate);
  }
  updateCount();
}