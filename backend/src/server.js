const dotenv = require("dotenv");
dotenv.config();
dotenv.config({ path: ".env.local" });

const app = require("./app");
const { connectToDatabase, closeDatabase } = require("./config/db");
const { syncAllIndexes } = require("./models");

const port = Number(process.env.PORT) || 5000;
const shouldSyncIndexes = process.env.SYNC_INDEXES !== "false";

async function startServer() {
  try {
    await connectToDatabase();
    if (shouldSyncIndexes) {
      await syncAllIndexes();
      console.log("Mongoose indexes synced");
    }

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    const gracefulShutdown = (signal) => {
      console.log(`${signal} received. Closing server...`);
      server.close(async () => {
        await closeDatabase();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
