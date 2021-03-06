const tasks = [
  {
    title: 'Watch an interesting movie after work',
    body: 'Watch an exciting action movie starring Gerard Butler',
    completed: true,
    _id: 'task-1',
  },
  {
    title: 'Go to a training session',
    body: 'Work out in the gym and swim in the pool',
    completed: false,
    _id: 'task-2',
  },
];

(function (arrayOfTasks) {
  const tasks = loadTasksFromLocalStorage() || arrayOfTasks;

  //Elements UI
  const listContainer = document.querySelector('.list-tasks .tasks'),
    form = document.forms['add-task'],
    formTitle = form.elements['title'],
    formBody = form.elements['body'];

  //Handlers
  renderAllTasks(tasks);
  form.addEventListener('submit', onFormSubmitHandler);
  listContainer.addEventListener('click', onDeleteHandler);

  //Functions
  function renderAllTasks(taskList) {
    const fragment = document.createDocumentFragment();

    taskList.forEach((task) => {
      const li = createTaskTemplate(task);
      fragment.appendChild(li);
    });
    listContainer.appendChild(fragment);
  }

  function createTaskTemplate({ _id, title, body }) {
    const li = document.createElement('li'),
      header = document.createElement('h2'),
      paragraph = document.createElement('p'),
      deleteButton = document.createElement('button');

    li.classList.add('tasks__item');
    header.classList.add('tasks__title');
    paragraph.classList.add('tasks__text');
    deleteButton.classList.add('tasks__button');

    li.setAttribute('data-task-id', _id);
    header.textContent = title;
    paragraph.textContent = body;
    deleteButton.textContent = 'Delete task';

    li.appendChild(header);
    li.appendChild(paragraph);
    li.appendChild(deleteButton);

    return li;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = formTitle.value,
      bodyValue = formBody.value;

    if (!titleValue || !bodyValue) {
      renderOverlayValidation();
      document.body.classList.add('hidden');
      return;
    }

    const task = createNewTask(titleValue, bodyValue);
    const listItem = createTaskTemplate(task);
    listContainer.insertAdjacentElement('afterbegin', listItem);
    form.reset();
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.floor(Math.random() * 10000)}`,
    };
    tasks.unshift(newTask);
    saveTasksToLocalStorage(tasks);
    return newTask;
  }

  function onDeleteHandler({ target }) {
    if (target.classList.contains('tasks__button')) {
      const parent = target.closest('[data-task-id]'),
        id = parent.dataset.taskId,
        [{ title }] = tasks;
      deleteTasks = tasks.find((item) => item._id === id);
      renderOverlayDeleteTask(id, parent, title);
    }
  }

  function renderOverlayDeleteTask(id, task, title) {
    const fragment = document.createDocumentFragment(),
      overlay = document.createElement('div'),
      container = document.createElement('div'),
      header = document.createElement('h2'),
      innerButton = document.createElement('div'),
      buttonConfirm = document.createElement('button'),
      buttonDelete = document.createElement('button');

    overlay.classList.add('overlay-delete-task');
    container.classList.add('overlay-delete-task__wrapper');
    header.classList.add('overlay-delete-task__title');
    innerButton.classList.add('overlay-delete-task__inner-button');
    buttonConfirm.classList.add('overlay-delete-task__confirm');
    buttonDelete.classList.add('overlay-delete-task__cancel');
    document.body.classList.add('hidden');

    header.textContent = `Are you sure you want to delete
     this task "${title}"?`;
    buttonConfirm.textContent = `ok`;
    buttonDelete.textContent = `cancel`;

    overlay.appendChild(container);
    container.appendChild(header);
    container.appendChild(innerButton);
    innerButton.appendChild(buttonConfirm);
    innerButton.appendChild(buttonDelete);

    fragment.appendChild(overlay);
    document.querySelector('.main').appendChild(fragment);

    deleteOverlayTask()
    deleteTask(id, task);
  }

  function deleteOverlayTask() {
    const overlay = document.querySelector('.overlay-delete-task')
    overlay.addEventListener('click', (e) => {
      const closeOverlay =
        e.target.tagName === 'BUTTON' || e.target === overlay;
      if (closeOverlay) {
        overlay.remove();
        document.body.classList.remove('hidden');
      }
    });
  }

  function deleteTask(id, task) {
    const buttonConfirm = document.querySelector('.overlay-delete-task__confirm');
    buttonConfirm.addEventListener('click', (e) => {
      //remove item from data
      const index = tasks.findIndex((item) => item._id === id);
      tasks.splice(index, 1);
      saveTasksToLocalStorage(tasks);
      task.remove();
    });
  }

  function renderOverlayValidation() {
    const fragment = document.createDocumentFragment(),
      overlay = document.createElement('div'),
      container = document.createElement('div'),
      header = document.createElement('h2'),
      button = document.createElement('button');

    overlay.classList.add('overlay-add-task');
    container.classList.add('overlay-add-task__wrapper');
    header.classList.add('overlay-add-task__title');
    button.classList.add('overlay-add-task__button');

    header.textContent = 'Please fill in all fields';
    button.textContent = 'ok';

    overlay.appendChild(container);
    container.appendChild(header);
    container.appendChild(button);

    fragment.appendChild(overlay);
    document.querySelector('.main').appendChild(fragment);

    deleteOverlayValidation()
  }

  function deleteOverlayValidation() {
    const overlay = document.querySelector('.overlay-add-task')
    overlay.addEventListener('click', (e) => {
      const closeOverlay =
        e.target.tagName === 'BUTTON' || e.target === overlay;
      if (closeOverlay) {
        document.body.classList.remove('hidden');
        overlay.remove();
      }
    });
  }

  function loadTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks'));
  }

  function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
})(tasks);

(function changeTheme() {
  const changeThemeButton = document.querySelector('.header__theme-select'),
    body = document.body;
  changeThemeButton.addEventListener('click', toggleTheme);

  if (!localStorage.theme) localStorage.theme = 'light';
  document.body.className = localStorage.theme;

  function toggleTheme({ target }) {
    body.classList.toggle('dark');
    changeThemeButton.textContent = body.classList.contains('dark')
      ? 'change theme to light'
      : 'change theme to dark';
    localStorage.theme = document.body.className || 'light';
  }
})();
