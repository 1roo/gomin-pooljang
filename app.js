const express = require("express");
const db = require("./models");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//고민봉 마이페이지
app.get("/mypage", (req, res) => {
  res.render("mypage");
});

const indexRouter = require("./routes");
app.use("/", indexRouter);

app.get("*", (req, res) => {
  res.render("404");
});

db.sequelize.sync({ force: false }).then((result) => {
  console.log("DB연결 성공");
  console.log("------------------------------");
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
