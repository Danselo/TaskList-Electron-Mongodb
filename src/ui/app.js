//? send the process to the principal process
const {ipcRenderer} = require('electron');
//this is the file sincronice with javascript 
const taskName = document.querySelector('#taskName');
const taskDescription = document.querySelector('#taskDescription');
const taskForm = document.querySelector('#taskForm');
const taskList = document.querySelector('#taskList');

let tasks = [];
let updateStatus = false;
let idTaskToUpdate = '';
function deleteTask (id) {

    //* CONFIRMACION
    const result = confirm("Are you sure you want to delete it?");
    if(result){
        ipcRenderer.send('delete-task', id)
    }
    return;
}

function editTask(id){
    updateStatus = true;
    idTaskToUpdate = id;
    //? Replace the items in the inputs 
   const task =  tasks.find(t => t._id === id)
   taskName.value = task.name;
   taskDescription.value = task.description;
}
let loadTasks = (tasks) => {
    taskList.innerHTML = '';
    tasks.map(t => {
        taskList.innerHTML +=`
        <li>
        <h4>${t._id}</h4>
        <p>Task Name ${t.name}</p>
        <p>Task description ${t.description}</p>
        <button onclick ="deleteTask('${t._id}')">Delete</button>
        <button onclick ="editTask('${t._id}')">Edit</button>

        </li>

        `
    })
}



taskForm.addEventListener('submit', e =>{
    e.preventDefault()
    const task = {
        name: taskName.value,
        description: taskDescription.value
    }

    if(!updateStatus){
        ipcRenderer.send('new-task', task); //enviar el elemento y el dato
    }else{
        ipcRenderer.send('update-task',{...task, idTaskToUpdate} )
    }

    taskForm.reset();
    taskName.focus();

})

//recibir informacion de main
ipcRenderer.on('new-task-created', (e,args)=>{
    newTask = JSON.parse(args);
    tasks.push(newTask); 
    loadTasks(tasks);
    alert('Task Created Succesfully');
});

ipcRenderer.send('get-tasks'); //send

ipcRenderer.on('get tasks', (e,args) => {
    const tasksReceived = JSON.parse(args); //convert
    tasks = tasksReceived;
    loadTasks(tasksReceived)
}) //listeng

ipcRenderer.on('delete-task-success',(e,args)=>{
    const deletedTask = JSON.parse(args);
    //conservar todas las tareas menos la que se elimino

    //? RECORRE LA LISTA DE LAS TAREAS 
    const newTasks = tasks.filter(t => {
        return t._id !== deletedTask._id;
    });
    tasks = newTasks;
    loadTasks(tasks);
})
ipcRenderer.on('update-task-success',(e,args)=>{
    console.log(args);
    const updateTask = JSON.parse(args);
    tasks = tasks.map(t => {
        if(t._id === updateTask._id){
            t.name = updateTask.name;
            t.description = updateTask.description;
        }
        return t;
    })

    loadTasks(tasks)
})