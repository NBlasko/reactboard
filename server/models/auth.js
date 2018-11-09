const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema
const userSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  name: String,
  publicID: String,

  statistics: {
    trustVote: {
      type: Schema.Types.ObjectId,
      ref: 'trustvote'
    },
    coins: {
      date: {
        type: Date,
        default: Date.now            // vreme.toISOString()
      },
      total: {
        type: Number,
        default: 100
      },
    }
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: String


  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  image: {
    URL: String,
    imageID: String
  }
});

// Create a model
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;