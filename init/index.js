const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../model/listing");

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "664b01d356862269263ac35e",
  }));
  await Listing.insertMany(initData.data);
  console.log("Inserted The DATA");
};

initDB();
