const jwt = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const SALT = 10;
const SECRET_KEY = process.env.SECRET_KEY;
console.log(User);

/* '/' GET */
exports.main = (req, res) => {
  res.render("index");
};

/**
 * registUser
 * 작성자: 하나래
 */
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        result: false,
        message: "이메일을 입력해 주세요.",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({
        result: false,
        message: "올바른 이메일 형식이 아닙니다.",
      });
    }
    const isExist = await User.findOne({ where: { email: email } });
    if (!isExist) {
      res.send({ result: false, message: "가입 가능한 이메일입니다." });
    } else {
      res.send({ result: true, message: "이미 있는 사용자입니다." });
    }
  } catch (error) {
    console.log("post /checkEmail error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

/**
 * registUser
 * 작성자: 하나래
 */
exports.registUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash(password, salt);

    // DB 저장
    const newUser = await User.create({
      email: email,
      password: hashedPw,
    });
    res.send({
      result: true,
      userId: newUser.userId,
      message: "회원가입 성공",
    });
  } catch (error) {
    console.log("post /regist error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

/**
 * loginUser
 * 작성자: 하나래
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("body: ", req.body);

    const user = await User.findOne({ where: { email: email } });
    console.log("user: ", user);
    console.log("Request Body:", req.body);

    if (!user) {
      return res
        .status(400)
        .send({ result: false, message: "유저가 존재하지 않습니다." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign(
        { id: user.userId, email: user.email },
        SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
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
};

/**
 * validation
 * 작성자: 하나래
 */
exports.validation = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("토큰이 필요합니다.");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, SECRET_KEY);
  console.log("Decoded Token:", decoded);

  const user = await User.findOne({ where: { email: decoded.email } });
  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  return user;
};

/**
 * changePw
 * 작성자: 하나래
 */
exports.changePw = async (req, res) => {
  try {
    const user = await exports.validation(req);
    console.log("레큐바디: ", req.body);

    const newPw = req.body.password;
    console.log("New Password:", newPw);
    if (!newPw || newPw.length < 4) {
      return res
        .status(400)
        .send({ result: false, message: "비밀번호는 최소 4자 이상입니다." });
    }

    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash(newPw, salt);

    await User.update({ password: hashedPw }, { where: { email: user.email } });

    res.send({ result: true, message: "비밀번호 변경 성공" });
  } catch (error) {
    console.error("changePw error", error.message);
    res.status(500).send({ message: error.message || "서버 에러" });
  }
};

/**
 * logout
 * 작성자: 하나래
 */
exports.logout = async (req, res) => {
  try {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("세션 종료 오류:", err);
          return res
            .status(500)
            .send({ result: false, message: "로그아웃 실패" });
        }

        // 쿠키 제거
        res.clearCookie("connect.sid");
        return res.send({ result: true, message: "로그아웃 성공" });
      });
    } else {
      res.clearCookie("token");
      return res.send({ result: true, message: "로그아웃 성공" });
    }
  } catch (error) {
    console.error("logout error:", error.message);
    res.status(500).send({ result: false, message: "서버 에러" });
  }
};
