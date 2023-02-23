const {model,Schema} = require('mongoose');

// model interactuar datos con mongo db con model, guardar, actualziar eleminar
//schema es que se puede guardar (titulo,autor,fecha)

const newTaskSchema = new Schema ({
    name :{
        type: String,
        required : true
    },
    description : {
        type: String,
        required: true
    }
});


// exports.newTaskSchema = ('Task',newTaskSchema);
// exports.newTaskSchema = ('Task',newTaskSchema);
// exports.newTaskSchema = ('Task',newTaskSchema);
module.exports = model("Task", newTaskSchema); //?  for export the module is 



