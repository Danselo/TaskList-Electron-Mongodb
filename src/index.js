//* When is ready call the funcion 'create window'
const {BrowserWindow, app} = require('electron');
const createWindow = require('./main')
require('./database')

app.whenReady().then(()=>{
    
    //? En caso de que no hayan ventanas esto te crea una
    app.on('activate', ()=>{
        if(BrowserWindow.getAllWindows().length ===0)
         createWindow()
    })
})
app.on('window-all-closed',()=>{
    if(process.platform !== 'win32') 
    app.quit()
})