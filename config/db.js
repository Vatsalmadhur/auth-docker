const mongoose= require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

module.exports = connectDB;

