const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
}, {
  timestamps: true,
});

userSchema.index({ email: 'text' });
const User = mongoose.model('User', userSchema);

module.exports = User;
