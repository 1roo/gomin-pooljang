const express = require("express");
const db = require("./models");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const cors = require("cors");
const favicon = require("serve-favicon");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(favicon(path.join(__dirname, "static", "favicon.ico")));

app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const indexRouter = require("./routes");

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use("/", indexRouter);
app.use(cors());

app.get("*", (req, res) => {
  res.render("404");
});

db.sequelize.sync({ force: false, alter: false }).then((result) => {
  app.listen(PORT, () => {});
});
