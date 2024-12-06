const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

const todoCount = document.createElement('div');
todoCount.id = 'todoCount';
todoCount.textContent = '0/None';
document.querySelector('.container').insertBefore(todoCount, taskList);

const loadTodos = () => {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.forEach((todo) => createTaskElement(todo.text, todo.completed));
  updateTodoInfo();
};

const updateLocalStorage = () => {
  const todos = [];
  document.querySelectorAll('#taskList li').forEach((li) => {
    todos.push({
      text: li.querySelector('.task-text').textContent,
      completed: li.classList.contains('completed'),
    });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
};

const updateTodoInfo = () => {
  const todos = document.querySelectorAll('#taskList li');
  const selectedTodoIndex = Array.from(todos).findIndex(li => li.classList.contains('selected'));
  todoCount.textContent = `${todos.length}/${selectedTodoIndex + 1 || 'None'}`;
};

const addSelectionHandler = (li) => {
  li.addEventListener('click', () => {
    document.querySelectorAll('#taskList li').forEach(item => item.classList.remove('selected'));
    li.classList.add('selected');
    updateTodoInfo();
  });
};

const createTaskElement = (text, completed = false) => {
  const li = document.createElement('li');
  if (completed) {
    li.classList.add('completed');
  }

  const taskText = document.createElement('span');
  taskText.classList.add('task-text');
  taskText.textContent = text;

  const completeButton = document.createElement('button');
  completeButton.textContent = '✓';
  completeButton.classList.add('complete-btn');
  completeButton.addEventListener('click', () => {
    li.classList.toggle('completed');
    updateLocalStorage();
  });

  const editButton = document.createElement('button');
  editButton.textContent = '✎';
  editButton.classList.add('edit-btn');
  editButton.addEventListener('click', () => {
    openModal(taskText);
  });

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'x';
  deleteButton.classList.add('delete-btn');
  deleteButton.addEventListener('click', () => {
    taskList.removeChild(li);
    updateLocalStorage();
    updateTodoInfo(); 
  });

  li.appendChild(taskText);
  li.appendChild(completeButton);
  li.appendChild(editButton);
  li.appendChild(deleteButton);

  taskList.appendChild(li);
  addSelectionHandler(li);
  updateTodoInfo(); 
};

addButton.addEventListener('click', () => {
  const newTask = taskInput.value.trim();
  if (newTask !== '') {
    createTaskElement(newTask);
    updateLocalStorage();
    taskInput.value = '';
  }
});

const modal = document.createElement('div');
modal.classList.add('modal');
modal.style.display = 'none';
modal.innerHTML = `
  <div class="modal-content">
    <input type="text" id="modalInput" placeholder="Edit task..." />
    <button class="save-btn">Save</button>
    <button class="close-btn">x</button>
  </div>
`;
document.body.appendChild(modal);

const modalInput = modal.querySelector('#modalInput');
const saveButton = modal.querySelector('.save-btn');
const closeButton = modal.querySelector('.close-btn');

const openModal = (taskTextElement) => {
  modal.style.display = 'flex';
  modalInput.value = taskTextElement.textContent;

  saveButton.onclick = () => {
    taskTextElement.textContent = modalInput.value;
    modal.style.display = 'none';
    updateLocalStorage();
  };
};

closeButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

loadTodos();
