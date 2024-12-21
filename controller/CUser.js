const jwt = require("jsonwebtoken");
const { User, Message } = require("../models");
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
    const { email, password, question, answer } = req.body;
    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash(password, salt);

    // DB 저장
    const newUser = await User.create({
      email: email,
      password: hashedPw,
      question,
      answer,
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
    console.log("유저: ", user);

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
    const token = req.headers.authorization?.split(" ")[1];
    invalidateToken(token);
    res.status(200).send("로그아웃 성공");
  } catch (error) {
    console.error("logout error:", error.message);
    res.status(500).send({ result: false, message: "서버 에러" });
  }
};

/**
 * 내가 보낸 고민, 답장 가져오기
 * 작성자: 하나래
 */
exports.sendedMsg = async (req, res) => {
  try {
    console.log("sendedMsg 호출됨");

    const user = await exports.validation(req);
    console.log("user: ", user);

    if (user) {
      const isReplied = await Message.findOne({
        attributes: ["repliedOrNot"],
        where: { userId: user.userId },
      });
      let msg = null;
      if (isReplied?.repliedOrNot) {
        msg = await Message.findOne({
          attributes: [
            "title",
            "content",
            "createdAt",
            "repliedTitle",
            "repliedContent",
            "repliedDate",
          ],
          where: { userId: user.userId },
        });
      } else {
        msg = await Message.findOne({
          attributes: ["content", "createdAt"],
          where: { userId: user.userId },
        });
      }

      res.status(200).send({ result: msg });
    }
  } catch (error) {
    console.error("sended-msg error:", error.message);
    res.status(500).send({ result: false, message: "서버 에러" });
  }
};

/**
 * 내가 받은 고민, 답장 가져오기
 * 작성자: 하나래
 */
exports.receivedMsg = async (req, res) => {
  try {
    const user = await exports.validation(req);
    if (user) {
      const isReplied = await Message.findOne({
        attributes: ["repliedOrNot"],
        where: { receivedUserId: user.userId },
      });
      let msg = null;
      if (isReplied?.repliedOrNot) {
        msg = await Message.findOne({
          attributes: [
            "title",
            "content",
            "createdAt",
            "repliedTitle",
            "repliedContent",
            "repliedDate",
          ],
          where: { receivedUserId: user.userId },
        });
      } else {
        msg = await Message.findOne({
          attributes: ["content", "createdAt"],
          where: { receivedUserId: user.userId },
        });
      }
      res.status(200).send({ result: msg });
    }
  } catch (error) {
    console.error("received-msg error:", error.message);
    res.status(500).send({ result: false, message: "서버 에러" });
  }
};
