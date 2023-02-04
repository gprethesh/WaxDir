const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// mongoose schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a Name"],
    maxlength: [40, "Name should be under 40 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// sign jwt token while login using POST-HOOKS
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWTSECRETWORD);
};

module.exports = mongoose.model("User", userSchema);
