const mongoose = require("mongoose");
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, default: 1 },
});
const productCounter = mongoose.model("ProductCounter", counterSchema);

const productSchema = new mongoose.Schema({
  address: { type: String, required: true },
  id: { type: Number, unique: true },
});

// Add a pre 'save' middleware to generate the auto-incrementing ID
productSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await productCounter.findByIdAndUpdate(
      "assetId",
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    );

    this.id = counter.sequence;
  }
  next();
});

// productSchema.set("primaryKey", "id");

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
