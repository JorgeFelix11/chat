const mongoose = require('mongoose');

const friendSchema = mongoose.Schema({
  status: {type: String, default: false},
  conversation: {type: String, default: ''}
})

const contactSchema = mongoose.Schema({
  contacts: [friendSchema]
})

module.exports = mongoose.model('Contacts', contactSchema);