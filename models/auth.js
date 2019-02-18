const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv4 = require('uuid/v4');
// Create a schema
const userSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  name: String,
  publicID: String,

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
      default: 20
    }
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: String,
    verified: {
      type: Boolean,
      default: false
    },
    accessCode: {
      type: String
    },
    accessCodeTime: {
      type: Date,
      default: Date.now
    },
    accessNumberTry: {
      type: Number,
      default: 3
    }


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
    URL: {
      type: String,
      default: ""
    },
  },
  imageQueryID: {
    type: String,
    default: uuidv4
  }  // send via URL query instead jwt to authorize images
});

// Create a model
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;