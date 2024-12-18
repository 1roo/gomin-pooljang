const express = require("express");
const db = require("./models");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;
const SALT = 10;

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

/**
 * 회원가입
 * 작성자: 하나래
 */
app.post("/register", async (req, res) => {
  try {
    const { email, pw } = req.body;
    const hashedPw = await bcrypt.hash(pw, SALT);

    // DB 저장
    await db.User.create({
      email: email,
      pw: hashedPw,
    });
    res.send({ result: true, message: "회원가입 성공" });
  } catch (error) {
    console.log("post /register error", error);
    res.status(500).send({ message: "서버 에러" });
  }
});

/**
 * 로그인
 * 작성자: 하나래
 */
app.get("/login", (req, res) => {
  res.send("login");
});
app.post("/login", async (req, res) => {
  try {
    const { email, pw } = req.body;
    const user = await db.User.findOne({ where: { email: email } });

    if (!user) {
      return res
        .status(400)
        .send({ result: false, message: "유저가 존재하지 않습니다." });
    }
    if (isMatch) {
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "1h",
      });
      res.send({ result: true, token: token });
    } else {
      res
        .status(400)
        .send({ result: false, message: "비밀번호가 일치하지 않습니다." });
    }
  } catch (error) {
    console.log("post /login error", error);
    res.status(500).send({ message: "서버 에러" });
  }
});

app.post("/token", (req, res) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      console.log(token);
      try {
        // 토큰 검증 작업
        const auth = jwt.verify(token, SECRET_KEY);
        if (auth.id === userInfo.id) {
          res.send({ result: true, name: userInfo.name });
        }
      } catch (error) {
        console.log("토큰 인증 에러");
        res
          .status(401)
          .send({ result: false, message: "인증된 회원이 아닙니다." });
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log("post /login error", error);
    res.status(500).send({ message: "서버 에러" });
  }
});

app.get("*", (req, res) => {
  res.render("404");
});

db.sequelize.sync({ force: true }).then((result) => {
  console.log("DB연결 성공");
  console.log("------------------------------");
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
