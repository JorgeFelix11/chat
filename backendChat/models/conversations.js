const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  message: {type: String},
  date: {type: String}
})
const conversationSchema = mongoose.Schema({
  participants: {
    first: {type: String},
    second: {type: String}
  },
  messages: [messageSchema]
})


module.exports = mongoose.model('Conversations', conversationSchema);