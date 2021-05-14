const User = require("../models/User");

module.exports = {
  /**
   * @param {String} id
   */
  findOneWithOnlyCoinsAndProfile: async (id) => {
    return User.findById(id, "coins").populate({
      path: "userProfile",
    });
  },

  newEntity: (doc) => {
    return new User(doc);
  },
};
