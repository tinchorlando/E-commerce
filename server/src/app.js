const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const cookieSession = require("cookie-session");
const { FRONTEND_URL } = process.env;
require("./db.js");

const baseURL = FRONTEND_URL || "http://localhost:3000"
const server = express();

server.name = "API";

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));

server.use(cookieParser());
server.use(morgan("dev"));

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", `${baseURL}`); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use(
  cookieSession({
    name: "FOOD-API",
    secret: process.env.COOKIE_SECRET, // Crear variable
    httpOnly: false,
    sameSite: "strict",
    secure: false
  })
);
// para acceder a info sensible primero verificar el id desde la galleta req.session.userId
// if (!req.session.userId) {
//   throw new Error("not authenticated");
// }

server.use("/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
