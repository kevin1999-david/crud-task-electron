const taskForm = document.querySelector('#taskForm');
const taskName = document.querySelector('#taskName');
const taskDescription = document.querySelector('#taskDescription');
const taskList = document.querySelector('#taskList');
const { ipcRenderer, ipcMain } = require('electron');
let tasks = [];
let updateStatus = false;
let idTaskToUpdate = '';


function deleteTask(id) {
    const result = confirm('Are your sure you want to delete it?');
    if (result) {
        ipcRenderer.send('delete-task', id);
    }
    return;
}

function editTask(id) {
    updateStatus = true;
    idTaskToUpdate = id;

    const task = tasks.find(task => { return task._id === id });
    // console.log(task);
    taskName.value = task.name;
    taskDescription.value = task.description;
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.map(task => {
        taskList.innerHTML +=
            `<li> <h4>Task ID: ${task._id}</h4> 
                <p>Task name: ${task.name}</p> 
                <p>Task description: ${task.description}</p>
                <button onclick="editTask('${task._id}')">Edit</button> 
                <button onclick="deleteTask('${task._id}')">Delete</button>
            </li>`
    })
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const task = {
        name: taskName.value,
        description: taskDescription.value
    };

    if (!updateStatus) {
        ipcRenderer.send('new-task', task);

    } else {
        ipcRenderer.send('update-task', {...task, idTaskToUpdate });
        updateStatus = false;
    }
    taskForm.reset();
});

ipcRenderer.on('new-task-created', (e, args) => {
    const newTask = JSON.parse(args);
    tasks.push(newTask);
    renderTasks(tasks);
    alert('Task Created Successfully!!');
});

ipcRenderer.send('get-tasks');

ipcRenderer.on('get-tasks', (e, args) => {
    const tasksReceived = JSON.parse(args);
    tasks = tasksReceived;
    renderTasks(tasks);
});

ipcRenderer.on('delete-task-success', (e, args) => {
    const tasksReceived = JSON.parse(args);
    tasks = tasksReceived;
    renderTasks(tasks);
});

ipcRenderer.on('update-task-success', (e, args) => {
    const tasksReceived = JSON.parse(args);
    tasks = tasksReceived;
    renderTasks(tasks);
});