const mongoose = require('mongoose');

//? COnnect database
mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/electrondb')
.then(()=>console.log("Se conecto"))
.catch((err) => err);

