const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");

// Import your Mongoose models
const Catalog = require("./models/catalog");
const User = require("./models/user");
const Asset = require("./models/asset");

// Connect to your MongoDB database
mongoose.connect("mongodb://localhost:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a function to generate random data
async function seedData() {
  // Generate fake catalogs
  const catalogs = [];
  for (let i = 0; i < 10; i++) {
    const catalog = new Catalog({
      name: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      url: faker.image.url(),
      cost1: faker.number.int({ min: 1, max: 100 }),
      cost2: faker.number.int({ min: 1, max: 100 }),
      cost3: faker.number.int({ min: 1, max: 100 }),
      req1: faker.number.int({ min: 1, max: 10 }),
      req2: faker.number.int({ min: 1, max: 10 }),
      req3: faker.number.int({ min: 1, max: 10 }),
      category: faker.number.int({ min: 1, max: 5 }),
    });
    console.log("add ----------------------------------- ");
    catalogs.push(catalog.save());
  }
  const usersArray = [];
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = new User({
      address: faker.lorem.sentence(),
      cash1: faker.number.float({ min: 50, max: 100, precision: 0.001 }), // min: 50 for convinient
      cash2: faker.number.float({ min: 50, max: 100, precision: 0.001 }),
      cash3: faker.number.float({ min: 50, max: 100, precision: 0.001 }),
    });
    usersArray.push(user);
    users.push(user.save());
  }

  const assets = [];
  for (let i = 0; i < 10; i++) {
    const asset = new Asset({
      type: faker.helpers.arrayElement([1, 2, 3]),
      level: faker.number.int({ min: 1, max: 10 }),
      address: faker.helpers.arrayElement(usersArray).address,
    });
    assets.push(asset.save());
  }

  await Promise.all([...catalogs, ...users, ...assets]);

  console.log("Data seeded successfully");
  process.exit();
}

seedData().catch((error) => {
  console.error("Error seeding data:", error);
  process.exit(1);
});
