const { BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const Task = require('./models/Task');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('src/index.html');
}

ipcMain.on('new-task', async(e, args) => {
    const newTask = new Task(args);
    const taskSaved = await newTask.save();
    console.log(typeof taskSaved);

    e.reply('new-task-created', JSON.stringify(taskSaved));
});


ipcMain.on('get-tasks', async(e, args) => {
    const tasks = await Task.find();
    e.reply('get-tasks', JSON.stringify(tasks));
});

ipcMain.on('delete-task', async(e, args) => {
    await Task.findByIdAndDelete(args);
    const tasks = await Task.find();
    e.reply('delete-task-success', JSON.stringify(tasks));
});

ipcMain.on('update-task', async(e, args) => {

    await Task.findByIdAndUpdate(args.idTaskToUpdate, {
        name: args.name,
        description: args.description
    });

    const tasks = await Task.find();
    e.reply('update-task-success', JSON.stringify(tasks));
});

module.exports = { createWindow }