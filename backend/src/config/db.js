/* ==========  backend/src/config/db.js  ===============*/
const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

/* ==========  Function connectToDatabase contains reusable module logic used by this feature.  ===============*/
async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  const options = {
    autoIndex: process.env.NODE_ENV !== "production",
    serverSelectionTimeoutMS: 10000,
  };

  if (process.env.DB_NAME) {
    options.dbName = process.env.DB_NAME;
  }

  await mongoose.connect(mongoUri, options);

  console.log(`Connected to MongoDB: ${mongoose.connection.name}`);
  return mongoose.connection;
}

/* ==========  Function closeDatabase contains reusable module logic used by this feature.  ===============*/
async function closeDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

module.exports = {
  connectToDatabase,
  closeDatabase,
};
