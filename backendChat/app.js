const express = require("express");
const bodyParser = require("body-parser")
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const appChat = express();

const chatRoutes = require('./routes/chats');
const contactRoutes = require('./routes/contacts');

mongoose.connect('mongodb://localhost:27017/final-chat-app-CHAT', {
  useNewUrlParser: true, 
  useCreateIndex: true})
    .then(() => {
      console.log('Connected to database from chat server!');
    })
    .catch(e => {
      console.log('Failed connecting to database');
      console.log(e);
    })

mongoose.set('useFindAndModify', false)

appChat.use(bodyParser.json())
appChat.use(bodyParser.urlencoded({extended: false}));
appChat.use(cookieParser());

appChat.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', true)
  next();
});

appChat.use('/api/contacts', contactRoutes)
appChat.use('/api/chats', chatRoutes)

module.exports = appChat;