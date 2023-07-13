// server.js

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Import models
const Catalog = require("./models/catalog");
const User = require("./models/user");
const Asset = require("./models/asset");
const Product = require("./models/product");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes

app.get("/", async (req, res) => {
  try {
    res.redirect("/catalog/1");
  } catch (error) {
    res.status(500).json({ error: `Internal server error ${error}` });
  }
});

// API to get catalog by ID
app.get("/catalog/:id", async (req, res) => {
  try {
    const catalogId = req.params.id;
    const catalog = await Catalog.findOne({ id: catalogId });
    if (!catalog) {
      return res.status(404).json({ error: "Catalog not found" });
    }

    const {
      id,
      name,
      description,
      url,
      cost1,
      cost2,
      cost3,
      req1,
      req2,
      req3,
    } = catalog;

    const response = {
      id,
      name,
      description,
      imageUrl: url,
      price: { cost1, cost2, cost3 },
      req: { req1, req2, req3 },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: `Internal server error ${error}` });
  }
});

// API to buy product
app.post("/buyProduct", async (req, res) => {
  try {
    console.log(req.body);
    const { id, address } = req.body;

    console.log(`--${address}--`);

    const catalog = await Catalog.findOne({ id });
    const user = await User.findOne({ address });
    console.log("catalog", catalog);
    console.log("user", user);

    if (!catalog || !user) {
      return res.status(404).json({
        success: false,
        error: { errorMessage: "Invalid catalog ID or user address" },
      });
    }

    if (
      user.cash1 < catalog.cost1 ||
      user.cash2 < catalog.cost2 ||
      user.cash3 < catalog.cost3
    ) {
      return res.status(400).json({
        success: false,
        error: { errorMessage: "Insufficient funds" },
      });
    }
    const assets = await Asset.find({ address });
    // console.log("assets", assets);
    // let validUser = true;
    // for (let asset of assets) {
    //   // console.log("asset ------------- ", asset);
    //   // if (catalog.req1 && (!asset || asset.type !== 1)) {
    //   //   if (asset.level > catalog.req1) {
    //   //     validUser = false;
    //   //   }
    //   // } else if (catalog.req2 && (!asset || asset.type !== 2)) {
    //   //   if (asset.level > catalog.req2) {
    //   //     validUser = false;
    //   //   }
    //   // } else if (catalog.req3 && (!asset || asset.type !== 3)) {
    //   //   if (asset.level > catalog.req3) {
    //   //     validUser = false;
    //   //   }
    //   // }
    //   //  ----------------------------------
    //   // if (
    //   //   (catalog.req1 &&
    //   //     (!asset || asset.type !== 1 || asset.level > catalog.req1)) ||
    //   //   (catalog.req2 &&
    //   //     (!asset || asset.type !== 2 || asset.level > catalog.req2)) ||
    //   //   (catalog.req3 &&
    //   //     (!asset || asset.type !== 3 || asset.level > catalog.req3))
    //   // ) {
    //   //   return res.status(400).json({
    //   //     success: false,
    //   //     error: { errorMessage: "User does not meet requirements" },
    //   //   });
    //   // }
    // }

    // if (!validUser) {
    //   return res.status(400).json({
    //     success: false,
    //     error: { errorMessage: "User does not meet requirements" },
    //   });
    // }

    // Deduct resources from user
    user.cash1 -= catalog.cost1;
    user.cash2 -= catalog.cost2;
    user.cash3 -= catalog.cost3;

    // Create new product
    const product = new Product({
      address: user.address,
    });
    await user.save();
    await product.save();

    // Return new resource amounts
    const { cash1, cash2, cash3 } = user;
    const response = {
      success: true,
      data: {
        resources: { cash1, cash2, cash3 },
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: `Internal server error ${error}` });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
