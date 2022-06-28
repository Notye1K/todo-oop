class Board {
  constructor({ id, title, tasks }) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }

  onBoardTitleClick() {
    const newTitle = prompt("Novo titulo do board");
    if (!newTitle) {
      alert("Insira o novo título!");
      return;
    }

    const boardTitleElement = document.querySelector(
      `[data-board-id="${this.id}"] .board-title`
    );
    boardTitleElement.textContent = newTitle;
  }

  onDeleteBoard() {
    boards = boards.filter((board) => board.id !== this.id);

    const boardContainer = document.querySelector(
      `[data-board-id="${this.id}"]`
    );
    boardContainer.remove();
  }

  onDuplicateBoard() {
    const boardsContainer = document.querySelector(".boards");
    const newBoard = structuredClone(this);
    newBoard.id = getNextBoardId();
    newBoard.title = `${newBoard.title} Copy`;

    const boardContainer = getBoardView(newBoard);
    boardsContainer.appendChild(boardContainer);
    boards.push(newBoard);
  }

  onAddTask(newTaskName) {
    const task = new Task({
      id: this.getNextTaskId(),
      name: newTaskName,
      completed: false,
      boardId: this.id,
    });
    this.tasks.push(task);

    const tasksContainer = document.querySelector(
      `[data-board-id="${this.id}"] .tasks`
    );
    const taskContainer = getTaskView(this.id, task);
    tasksContainer.appendChild(taskContainer);
  }

  handleNewTaskInputKeypress(e) {
    if (e.key === "Enter") {
      onAddTask(e.target.value);
      e.target.value = "";
    }
  }

  getNextTaskId() {
    const lastTaskIndex = this.tasks.length - 1;
    const lastTaskId = tasks[lastTaskIndex]?.id;
    if (!lastTaskId) return 1;

    return lastTaskId + 1;
  }
}

class Task {
  constructor({ id, boardId, name, completed }) {
    this.id = id;
    this.boardId = boardId;
    this.name = name;
    this.completed = completed;
  }

  onDeleteTask() {
    const board = boards.find((board) => board.id === this.boardId);
    board.tasks = board.tasks.filter((task) => task.id !== this.id);

    const taskContainer = document.querySelector(
      `[data-task-id="${this.id}"][data-board-id="${this.boardId}"]`
    );
    taskContainer.remove();
  }

  onCompleteTask() {
    const board = boards.find((board) => board.id === this.boardId);

    const completedTask = board.tasks.find((task) => task.id === this.id);
    completedTask.completed = !completedTask.completed;

    const taskContainer = document.querySelector(
      `[data-task-id="${this.id}"][data-board-id="${this.boardId}"]`
    );
    taskContainer.classList.toggle("completed");
  }

  getTaskView() {
    const taskContainer = document.createElement("li");
    taskContainer.classList.add("task");
    taskContainer.dataset.taskId = this.id;
    taskContainer.dataset.boardId = this.boardId;
    if (this.completed) {
      taskContainer.classList.add("completed");
    }

    const taskCheckbox = document.createElement("input");
    taskCheckbox.id = `checkbox-${this.id}-${Date.now()}`;
    taskCheckbox.classList.add("checkbox");
    taskCheckbox.type = "checkbox";
    taskCheckbox.checked = this.completed;
    taskCheckbox.addEventListener("click", onCompleteTask.bind(this));
    taskContainer.appendChild(taskCheckbox);

    const taskName = document.createElement("label");
    taskName.classList.add("task-name");
    taskName.textContent = this.name;
    taskName.htmlFor = taskCheckbox.id;
    taskContainer.appendChild(taskName);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", onDeleteTask.bind(this)
    );
    taskContainer.appendChild(deleteButton);

    return taskContainer;
  }

  getTaskView
}

class Controller {
  constructor(newBoardTitle) {
    this.newBoardTitle = newBoardTitle;
  }

  onAddBoard() {
    const board = new Board({
      id: this.getNextBoardId(),
      title: this.newBoardTitle,
      tasks: [],
    });
    boards.push(board);

    const boardsContainer = document.querySelector(".boards");
    const boardContainer = getBoardView(board);
    boardsContainer.appendChild(boardContainer);
  }

  getNextBoardId() {
    const lastBoardIndex = boards.length - 1;
    const lastBoardId = boards[lastBoardIndex]?.id;
    if (!lastBoardId) return 1;

    return lastBoardId + 1;
  }

  handleNewBoardInputKeypress(e) {
    if (e.key === "Enter") {
      this.onAddBoard(e.target.value);
      e.target.value = "";
    }
  }
}









// time out










function getBoardView(board) {
  const boardContainer = document.createElement("div");
  boardContainer.classList.add("board");
  boardContainer.dataset.boardId = board.id;

  const htmlRow = document.createElement("div");
  htmlRow.classList.add("row");

  const duplicateButton = document.createElement("button");
  duplicateButton.classList.add("duplicate-button");
  duplicateButton.textContent = "Duplicate board";
  duplicateButton.addEventListener("click", () => onDuplicateBoard(board));
  htmlRow.appendChild(duplicateButton);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", () => onDeleteBoard(board.id));
  htmlRow.appendChild(deleteButton);

  boardContainer.appendChild(htmlRow);

  const boardTitle = document.createElement("p");
  boardTitle.classList.add("board-title");
  boardTitle.textContent = board.title;
  boardTitle.addEventListener("click", () => onBoardTitleClick(board.id));
  boardContainer.appendChild(boardTitle);

  const tasksContainer = document.createElement("ul");
  tasksContainer.classList.add("tasks");
  boardContainer.appendChild(tasksContainer);

  board.tasks.forEach((task) => {
    const taskContainer = getTaskView(board.id, task);
    tasksContainer.appendChild(taskContainer);
  });

  const newTaskInput = document.createElement("input");
  newTaskInput.dataset.boardId = board.id;
  newTaskInput.classList.add("new-task-input");
  newTaskInput.type = "text";
  newTaskInput.placeholder = "Nova tarefa";
  newTaskInput.addEventListener("keypress", handleNewTaskInputKeypress);
  boardContainer.appendChild(newTaskInput);

  return boardContainer;
}

const boardPessoal = {
  id: 1,
  title: "Title",
  tasks: [
    { id: 1, name: "tarefa 1", completed: false },
    { id: 2, name: "tarefa 2", completed: false },
    { id: 3, name: "tarefa 3", completed: true },
    { id: 4, name: "tarefa 4", completed: false },
    { id: 5, name: "tarefa 5", completed: true },
  ],
};

let boards = [boardPessoal];

function renderizarBoards(boards) {
  const boardsContainer = document.querySelector(".boards");

  boards.forEach((board) => {
    const boardContainer = getBoardView(board);

    boardsContainer.appendChild(boardContainer);
  });
}
renderizarBoards(boards);

const newBoardInput = document.querySelector(".new-board-input");
newBoardInput.addEventListener("keypress", handleNewBoardInputKeypress);
