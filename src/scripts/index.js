const tasks = [
  {
    _id: '5d2ca9e2e03d40b326596aa7',
    completed: true,
    body: 'Watch an exciting action movie starring Gerard Butler',
    title: 'Watch an interesting movie after work',
  },
  {
    _id: '5d2ca9e29c8a94095c1288e0',
    completed: false,
    body: 'Work out in the gym and swim in the pool',
    title: 'Go to a training session',
  },
];

(function (arrayOfTasks) {
  const objectOfTasks = arrayOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  //Elements UI
  const listContainer = document.querySelector('.list-tasks .tasks'),
    form = document.forms['add-task'],
    formTitle = form.elements['title'],
    formBody = form.elements['body'];

  //Handlers
  renderAllTasks(objectOfTasks);
  form.addEventListener('submit', onFormSubmitHandler);

  //Functions
  function renderAllTasks(taskList) {
    const fragment = document.createDocumentFragment();

    Object.values(objectOfTasks).forEach((task) => {
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
      alert('Please fill in all fields!');
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
      _id: `task-${Math.floor(Math.random() * 10000)}`
    }

    objectOfTasks[newTask._id] = newTask;

    return {...newTask}
  }
})(tasks);
