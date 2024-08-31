const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ToDoModel = require('./Models/todo');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/get',(req,res)=>{
  ToDoModel.find()
    .then(result=> res.json(result))
    .catch(err => res.json(err))
});

app.post('/add', (req, res) => {
  const task = req.body.task;
  ToDoModel.create({
    task: task,
    done: false // set done to false by default
  }).then(result => res.json(result))
  .catch(err => res.json(err))
});

app.put('/check/:id',(req,res)=>{
  const {id}=req.params;
  ToDoModel.findByIdAndUpdate({_id: id}, {done:true})
    .then(result=> res.json(result))
    .catch(err=> res.json(err))
});

app.put('/update/:id',(req,res)=>{
  const {id}=req.params;
  const task = req.body.task;
  ToDoModel.findByIdAndUpdate({_id: id}, {task: task})
    .then(result=> res.json(result))
    .catch(err=> res.json(err))
});

app.delete('/delete/:id',(req,res)=>{
  const {id}=req.params;
  ToDoModel.findByIdAndDelete({_id: id})
    .then(result=> res.json(result))
    .catch(err=> res.json(err))
});

app.listen(3001, () => {
  console.log("Server is running")
});