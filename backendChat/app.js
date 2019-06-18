const express = require("express");
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const checkAuth = require('../backendUsers/middleware/check-auth')
const Contacts = require('./models/contacts')
const Conversations = require('./models/conversations');
const moment = require('moment');

const appChat = express();
const port = process.env.PORT || 5000;


const serverChat = appChat.listen(port, () => {
  console.log('connected to port 5000')
})

let socketIO = require('socket.io')
let io = socketIO(serverChat)

mongoose.connect('mongodb://localhost:27017/final-chat-app-CHAT', {
  useNewUrlParser: true,
  useCreateIndex: true
})
  .then(() => {
    console.log('Connected to database from chat server!');
  })
  .catch(e => {
    console.log('Failed connecting to database');
    console.log(e);
  })

mongoose.set('useFindAndModify', false)
appChat.set('socketIO', io)
appChat.use(bodyParser.json())
appChat.use(bodyParser.urlencoded({ extended: false }));
appChat.use(cookieParser());

appChat.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', true)
  req.io = io;
  next();
});

io.sockets.on('connection', (socket) => {
  appChat.post('/chat', checkAuth, (req, res, next) => {
    Contacts.findOne({ "_id": req.userData.userId }).select({ contacts: { $elemMatch: { _id: req.body.friendId } } })
      .then(user => {
        Conversations.findById(user.contacts[0].conversation)
          .then(conversation => {
            io.emit("join", conversation._id)
            res.status(200).json({
              message: "Here is your conversation",
              conversation
            })
          })
      })
  })

  appChat.post('/message', checkAuth, (req, res, next) => {
    const messageObj = {
      _id: req.userData.userId,
      message: req.body.message,
      date: moment().format("DD-MM-YYYY HH:mm")
    }
    Conversations.findByIdAndUpdate(req.body.conversation, { $push: { messages: { _id: messageObj._id, message: messageObj.message, date: messageObj.date } } }, { new: true })
      .then(conversation => {
        io.sockets.in(conversation._id).emit('message', messageObj)
        res.status(200).json({
          conversation
        })
      })
  })

  appChat.post('/onsignup', (req, res, next) => {
    const newContact = new Contacts({
      _id: req.body._id,
      contacts: []
    })
    newContact.save()
      .then(user => {
        res.status(200).json({
          message: "Contacts database initiated",
          user
        })
      }).catch(e => {
        res.status(500).json({
          message: "error is in the server of CHAT",
          e
        })
      })
  })

  appChat.post('/onlogin', (req, res, next) => {
    Contacts.findById(req.body.id, (err, response) => {
      res.status(200).json({
        message: 'Here are all your contacts',
        user: response
      })
    })
  })

  appChat.post('/getuser', (req, res, next) => {
    Contacts.findById(req.body.id)
      .then(user => {
        res.status(200).json({
          user
        })
      })
  })

  appChat.get('/getcontacts', checkAuth, (req, res, next) => {
    Contacts.findById(req.userData.userId)
      .then(user => {
        axios.post('http://localhost:3000/api/users/getcontacts', user.contacts)
          .then(response => {
            res.status(200).json({
              contacts: response.data.contacts
            })
          })
      })
  })

  appChat.post('/add', checkAuth, (req, res, next) => {
    axios.post('http://localhost:3000/api/users/getcontact', { email: req.body.email })
      .then(response => {
        Contacts.findByIdAndUpdate(response.data._id, { $push: { contacts: { _id: req.userData.userId, status: req.body.status } } }, { new: true })
          .then(user => {
            Contacts.findByIdAndUpdate(req.userData.userId, { $push: { contacts: { _id: response.data._id, status: "Pending" } } }, { new: true })
              .then(user => {
                axios.post('http://localhost:3000/api/users/getcontacts', user.contacts)
                  .then(response => {
                    io.emit('add-contact');
                    res.status(200).json({
                      message: 'Everything went ok',
                      contacts: response.data.contacts
                    })
                  })
              })
              .catch(e => {
                res.status(500).json({
                  message: 'Error Adding a Contact',
                  e
                })
              })
          })
          .catch(e => {
            res.status(500).json({
              message: 'Something went wrong adding to friend requests',
              e
            })
          })
      })
  })

  appChat.post('/accept', checkAuth, (req, res, next) => {
    const accepted = {
      _id: req.body.friendId,
      status: "Accepted"
    }
    const acceptor = {
      _id: req.userData.userId,
      status: "Accepted"
    }
    const newConversation = new Conversations({
      participants: {
        first: req.userData.userId,
        second: req.body.friendId
      },
      messages: []
    })
    newConversation.save()
      .then(newConv => {
        Contacts.findById(accepted._id).findOneAndUpdate(
          { 'contacts._id': acceptor._id },
          { '$set': { 'contacts.$.status': acceptor.status, "contacts.$.conversation": newConv._id } },
          { new: true })
          .then(user => {
            Contacts.findById(acceptor._id).findOneAndUpdate(
              { 'contacts._id': accepted._id },
              { '$set': { 'contacts.$.status': accepted.status, "contacts.$.conversation": newConv._id } },
              { new: true })
              .then(acceptor => {
                axios.post('http://localhost:3000/api/users/getcontacts', acceptor.contacts)
                  .then(response => {
                    res.status(200).json({
                      message: 'Everything went ok',
                      contacts: response.data.contacts
                    })
                  })
              })
              .catch(e => {
                res.status(500).json({
                  message: 'Error Adding Friend',
                  e
                })
              })
          })
          .catch(e => {
            res.status(500).json({
              message: 'Error Adding Friend',
              e
            })
          })
      })
  })

  socket.on('join', (data) => {
    socket.join(data);
  })
  socket.on('leave', (data) => {
    socket.leave(data)
  })
})