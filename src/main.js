const{ app , BrowserWindow, ipcMain} = require('electron');
const Task = require('./models/task') //este permite guardar datos eliminarlos y lo demas




/* this is for create a windows in electron 
ipMain recibe los eventos 
?app: controla el ciclo  de vida de los eventos de la aplicación 
?app: app, which controls your application's event lifecycle.

?BrowserWindow : controla la creacion y el manejo de las ventanas 

! THE ECMASCRIPT IS NOT ACTUAL SUPPORTED IN ELECTRON

*/

const createWindow = () => {
    
    app.on('ready',()=>{
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences : {
                nodeIntegration :true,
                contextIsolation: false,
            }
        })
    
        win.loadFile('src/index.html')
    })
    
}
ipcMain.on('new-task', async(e,args) =>{
    
    // console.log(args);
    const newTask =  new Task(args); //* crear objeto para pasarlo a mongo
    const taskSaved = await newTask.save();
    console.log(taskSaved);

    e.reply('new-task-created', JSON.stringify(taskSaved)); //? communicated with json for json.stringify and parse to finally 
})


//? llamar las tareas que estan en la base de datos
ipcMain.on('get-tasks',async (e,args) => {
    const task = await Task.find();
    e.reply('get tasks', JSON.stringify(task))
})



//? recibir los id para eliminarlos desde el frontend
//! DELETE 
ipcMain.on('delete-task',async(e,args) =>{
    const taskDeleted = await Task.findByIdAndDelete(args);
    e.reply('delete-task-success', JSON.stringify(taskDeleted));
})
//! THIS IS EDIT */
ipcMain.on('update-task',async(e,args) =>{
   const uptdateTask = await Task.findByIdAndUpdate(
        args.idTaskToUpdate,{
            name: args.name, 
            description : args.description
    }, {new : true}) //? una vez se actualice la tarea lo que esto va a hacer es devolverlo con los nuevos campos

    e.reply ('update-task-success', JSON.stringify(uptdateTask));
})
//? THIS IS THE REAL FORM FOR EXPORT THE FUNCION !
exports.createWindow = createWindow();

