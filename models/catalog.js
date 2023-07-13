const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, default: 1 },
});

const Counter = mongoose.model("Counter", counterSchema);

const catalogSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String },
  description: { type: String },
  url: { type: String },
  cost1: { type: Number },
  cost2: { type: Number },
  cost3: { type: Number },
  req1: { type: Number },
  req2: { type: Number },
  req3: { type: Number },
  category: { type: Number },
});

catalogSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      "catalogId",
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    );

    this.id = counter.sequence;
  }
  next();
});

const Catalog = mongoose.model("Catalog", catalogSchema);

module.exports = Catalog;
