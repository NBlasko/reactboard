const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv4 = require('uuid/v4');

/* Create a schema */
const authSchema = new Schema({
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
      default: Date.now
    },
    total: {
      type: Number,
      default: 30
    },

    /* when client want's to acces profile or blog, he is being charged.
    In turn, he gets pageQueryID
    which determines for which page has clint paid for access */

    pageQueryID: String,
  },

  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: String,

    /* properties for verifying via email */
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
  //imageQueryID is send via URL query instead jwt to authorize images
  imageQueryID: {
    type: String,
    default: uuidv4
  }
});

// Create a model
const Auth = mongoose.model('auth', authSchema);

module.exports = Auth;