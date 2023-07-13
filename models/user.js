const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  cash1: { type: Number },
  cash2: { type: Number },
  cash3: { type: Number },
});

// userSchema.set("primaryKey", "address");

const User = mongoose.model("User", userSchema);

module.exports = User;
