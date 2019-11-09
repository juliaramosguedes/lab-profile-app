const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: String,
  password: String,
  campus: { type: String, enum: ['Madrid', 'Barcelona', 'Miami', 'Paris', 'Berlim', 'Amsterdam', 'Mexico', 'Sao Paulo', 'Lisbon'] },
  course: { type: String, enum: ['WebDev', 'UX/UI', 'Data Analytics'] },
  image: String,
},
{
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
