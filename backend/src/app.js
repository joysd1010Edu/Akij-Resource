const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const apiRoutes = require("./routes/index");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.disable("x-powered-by");

/* ==========  CORS config reflects request origins for credentialed cross-origin requests.  ===============*/
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  optionsSuccessStatus: 200,
  allowedOrigins: "*",
};

app.use(cors(corsOptions));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "1mb" }));
app.options(/.*/, cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
