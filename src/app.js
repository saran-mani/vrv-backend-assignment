const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const userRoutes = require("../src/routes/userRoutes");
const blogRoutes = require("../src/routes/BlogRoutes");
const globalErrorHandler = require("../src/error/errorController");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173", "https://vrv-assignment.netlify.app"],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,PATCH,DELETE',
    credentials: true,
  })
);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

app.use(globalErrorHandler);

module.exports = app;
