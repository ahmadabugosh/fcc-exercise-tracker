const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors');
const moment = require('moment');
const mongoose = require('mongoose');
const User = require('./models/User.js');
const Exercise = require('./models/Exercise.js');
mongoose.connect(process.env.MLAB_URI || 'mongodb://' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/exercise/log', (req, res) => {
  var userId=Object.keys(req.query)[0];
  var from=Object.keys(req.query)[1];
  var to=Object.keys(req.query)[2];
  var limit=Object.keys(req.query)[3];
  
  let query = {
    userId: userId
  };
  if(from || to) {
    query.date = {};
    if(from)
      query.date.$gte = moment(from).format('YYYY-MM-DD');
    if(to)
      query.date.$lte = moment(to).format('YYYY-MM-DD');
  }
  Exercise.find(query).sort({ 'date': -1 }).limit(parseInt(req.query.limit))
    .then(result => res.json(result))
    .catch(err => res.send("Error!"))  
  
  
});

app.post('/api/exercise/new-user', (req, res) => {
  User.findOne({ username: req.body.username}).then(user => {
    if (user) {
        return res.status(400).json({user:"User already exists"});
      } 
    else {
        const newUser = new User({
        username:req.body.username});
        newUser.save()
       .then(usermade => res.json(usermade));
}
  
  });
  })

app.post('/api/exercise/add', (req, res) => {
 
  //5b981868081f0a049a623e4c
  var id = new mongoose.Types.ObjectId(req.body.userId);
      User.findById(id).then(user => {
    if (!user) {
        return res.status(400).json({user:"Cannot find user by that id, please try again"});
      } 
    else {
      
      const newExercise = new Exercise({
         userId: req.body.userId,
   description: req.body.description,
   duration: req.body.duration,
   date: req.body.date
         });
         newExercise.save()
        .then(exercisemade => res.json(exercisemade));
}
  
  });

  })




// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
