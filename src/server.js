const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
dotenv.config();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// const DB = process.env.DB?.replace("<PASSWORD>", process.env.DB_PASSWORD);
// mongoose
//   .connect(DB ? DB : "", {
//     dbName: "vrv",
//     minPoolSize: 10,
//     maxPoolSize: 10,
//   })
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connection succcessful"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
