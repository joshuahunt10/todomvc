const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Todo = require("./models/schema.js");

app.use('/static', express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/todomvc');

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/index.html");
})


// put routes here
app.get('/api/todos', function(req, res){
  Todo.find()
  .then(function(todos){
    //needed to assign an id since mongoDB makes an _id.
    for (var i = 0; i < todos.length; i++) {
      todos[i].id = todos[i]._id
    }
    res.json(todos)
  })
})


app.post('/api/todos', function(req,res){
  if(req.body._id){
    Todo.findOne({_id: req.body._id})
    .then(function(json){
      json.title = req.body.title ,
      json.order = req.body.order,
      json.completed = req.body.completed
      json.save().then(function(json){
        res.json(json);
      })
    })
  }else{
    let json = new Todo()
    json.title = req.body.title ,
    json.order = req.body.order,
    json.completed = req.body.completed
    json.save()
    .then(function(json){
      res.json(json);
    })
    .catch(function(error){
      res.status(422).json(error)
    })
  }
})

app.get('/api/todos/:id', function(req, res){
  id = req.params.id
  Todo.findOne({_id: id})
  .then(function(json){
    res.json(json);
  })
})


app.delete('/api/todos/:id', function(req, res){
  id = req.params.id
  Todo.deleteMany({_id: id})
  .then(function(json){
    res.json(json)
  }).catch(function(error){
    console.log("We had error")
    res.json(error)
  })
})

app.put('/api/todos/:id', function(req, res){
  id = req.params.id
  Todo.findOne({_id: id})
  .then(function(check){
    if(!check.completed){
      check.completed = true
    }else{
      check.completed = false
    }
    check.save().then(function(check){
      res.json(check)
    })
  })
})

app.patch('/api/todos/:id', function(req, res){
  Todo.findOne({_id: id})
  .then(function(patch){
    patch.title = req.body.title
  }).save().then(function(patch){
    res.json(patch)
  })
})

app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});
