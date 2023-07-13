const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, default: 1 },
});

const AssetCounter = mongoose.model("AssetCounter", counterSchema);

const assetSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  type: { type: Number, enum: [1, 2, 3] },
  level: { type: Number, min: 1, max: 10 },
  address: { type: String, ref: "User" },
});

// Add a pre 'save' middleware to generate the auto-incrementing ID
assetSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await AssetCounter.findByIdAndUpdate(
      "assetId",
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    );

    this.id = counter.sequence;
  }
  next();
});

// assetSchema.set("primaryKey", "id");

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;
