const jwt = require("jsonwebtoken");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const SALT = 10;
const SECRET_KEY = process.env.SECRET_KEY;
console.log(User);

/* '/' GET */
exports.main = (req, res) => {
  const jwt = req.cookies.jwtToken;
  const loginStatus = req.cookies.loginStatus;

  console.log("jwt: ", jwt);
  console.log("loginStatus: ", loginStatus);
  if (jwt) {
    const payload = jwt.split(".")[1];
    const decodedPayload = atob(payload);
    console.log("decodedPayload = ", decodedPayload);
    const decodedPayload2 = JSON.parse(atob(payload));
    const userId = decodedPayload2.id;
    res.render("index", { jwt, loginStatus, decodedPayload, userId });
  } else {
    res.render("index", {
      jwt,
      loginStatus,
      decodedPayload: "false",
      userId: "false",
    });
  }
};

//고민봉
exports.mypage = (req, res) => {
  res.render("mypage");
};

//고민봉
exports.userReceviedMsg = (req, res) => {
  res.render("user_received_msg");
};

exports.userSendedMsg = (req, res) => {
  res.render("user_sended_msg");
};

//고민봉
exports.index = (req, res) => {
  const jwt = req.cookies.jwtToken;
  const loginStatus = req.cookies.loginStatus;

  console.log("jwt: ", jwt);
  console.log("loginStatus: ", loginStatus);
  if (jwt) {
    const payload = jwt.split(".")[1];
    const decodedPayload = atob(payload);
    console.log("decodedPayload = ", decodedPayload);
    const decodedPayload2 = JSON.parse(atob(payload));
    const userId = decodedPayload2.id;
    res.render("index copy", { jwt, loginStatus, decodedPayload, userId });
  } else {
    res.render("index copy", {
      jwt,
      loginStatus,
      decodedPayload: "false",
      userId: "false",
    });
  }
};

//고민봉 mypageCopy
exports.mypageCopy = async (req, res) => {
  const { userId } = req.body;
  res.send({ result: true, message: "마이페이지" });
};

//고민봉 도메인 룰 확인용 회원10명가입
exports.testUserCreate = async (req, res) => {
  try {
    password = "1234";
    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash(password, salt);

    for (let i = 0; i < 10; i++) {
      const findUserId = await User.findAll({
        order: [["userId", "DESC"]],
        limit: 1,
      });
      if (findUserId.length === 0) {
        const newUser1 = await User.create({
          email: "test@naver.com",
          password: hashedPw,
          question: "출신 초등학교 이름은?",
          answer: "qqq",
        });
        continue;
      }
      const newUser = await User.create({
        email: "a" + (findUserId[0].userId + 1) + "@naver.com",
        password: hashedPw,
        question: "출신 초등학교 이름은?",
        answer: "qqq",
      });
    }

    res.send({
      result: true,

      message: "회원가입 10명 성공",
    });
  } catch (error) {
    console.log("post /regist100 error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

/**
 * checkEmail
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

//고민봉logunUser2
exports.loginUser2 = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    console.log("user: ", user);
    console.log("Request Body:", req.body);

    if (user === null) {
      return res.send({ result: false, message: "이메일이 틀렸습니다" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log("isMatch 조건문 안");
      const token = jwt.sign(
        { id: user.userId, email: user.email },
        SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );
      res.cookie("jwtToken", token, {
        httpOnly: true,
        path: "/",
      });
      res.cookie("loginStatus", "true", {
        httpOnly: true,
        path: "/",
      });
      return res.send({ result: true, token: token });
    } else {
      return res.send({
        result: false,
        message: "비밀번호 틀렸습니다",
      });
    }
  } catch (error) {
    console.log("post /login error", error);
    res.send({ result: false, message: "서버에러" });
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
      return res.send({ result: false, message: "invalid_email" });
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
      res.cookie("jwtToken", token, {
        httpOnly: true,
        path: "/",
      });
      res.cookie("loginStatus", "true", {
        httpOnly: true,
        path: "/",
      });
      return res.send({ result: true, token: token });
    } else {
      return res.send({ result: false, message: "invalid_password" });
    }
  } catch (error) {
    console.log("post /login error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

/**
 * 이메일과 질문, 대답 일치 여부
 * 작성자: 하나래
 */
exports.findAccount = async (req, res) => {
  try {
    const { email, question, answer } = req.body;
    if (!email || !question || !answer) {
      return res
        .status(400)
        .send({ result: false, message: "모든 필드를 입력해주세요" });
    }
    const user = await User.findOne({
      where: {
        email,
        question,
        answer,
      },
    });

    if (!user) {
      return res.send({ result: false, message: "정보가 일치하지 않습니다" });
    }

    res.send({ result: true, message: "정보가 일치합니다" });
  } catch (error) {
    console.log("post /find-account error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

/**
 * validation
 * 작성자: 하나래
 */
exports.validation = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("토큰이 필요합니다.");
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("토큰이 만료되었습니다.");
      }
      throw new Error("유효하지 않은 토큰입니다.");
    }

    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    // 토큰의 만료 시간만 업데이트
    const updatedToken = jwt.sign(
      { id: user.userId, email: user.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("jwtToken", updatedToken, {
      httpOnly: true,
      path: "/",
    });

    res.cookie("loginStatus", "true", {
      httpOnly: true,
      path: "/",
    });

    return res.json({ user, result: true, token: updatedToken });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

/**
 * changePw
 * 작성자: 하나래
 */
exports.changePw = async (req, res) => {
  //
  try {
    const user = await exports.validation(req);
    const newPw = req.body.password;
    console.log("New Password:", newPw);
    if (!newPw || newPw.length < 4) {
      return res.send({
        result: false,
        message: "비밀번호는 최소 4자 이상입니다.",
      });
    }

    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash(newPw, salt);

    await User.update(
      { password: hashedPw },
      { where: { email: user.email, password } }
    );

    res.send({ result: true, message: "비밀번호 변경 성공" });
  } catch (error) {
    console.error("changePw error", error.message);
    res.status(500).send({ message: error.message || "서버 에러" });
  }
};

//고민봉
exports.logout2 = async (req, res) => {
  try {
    console.log("logout2 호출됨");
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    console.log("logut2 token = ", token);
    const jwtCookie = req.cookies.jwtToken;
    const loginStatusCookie = req.cookies.loginStatus;
    console.log("jwtCookie: ", jwtCookie);
    console.log("loginStatusCookie: ", loginStatusCookie);

    res.clearCookie("jwtToken");
    res.clearCookie("loginStatus");

    res.status(200).send({ result: true, message: "로그아웃 성공" });
  } catch (error) {
    console.error("logout error:", error.message);
    res.status(500).send({ result: false, message: "서버 에러" });
  }
};

/**
 * logout
 * 작성자: 하나래
 */
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.send({ result: false, message: "토큰이 없습니다." });
    }

    const isInvalidated = await invalidateToken(token);
    if (!isInvalidated) {
      return res.send({ result: false, message: "토큰 무효화 실패" });
    }
    res.status(200).send({ result: true, message: "로그아웃 성공" });
  } catch (error) {
    console.error("logout error:", error.message);
    res.status(500).send({ result: false, message: "서버 에러" });
  }
};

/**
 * deleteUser
 * 작성자: 하나래
 */
exports.deleteAccount = async (req, res) => {
  try {
    const userInfo = await exports.validation(req);
    const { password } = req.body;

    // 사용자 정보 확인
    const user = await User.findOne({ where: { email: userInfo.email } });
    if (!user) {
      return res.send({ result: false, message: "유저가 없습니다." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send({ result: false, message: "비밀번호가 틀렸습니다." });
    }

    const salt = await bcrypt.genSalt(SALT);
    const hashedPw = await bcrypt.hash("deleted_password", salt);

    await User.update(
      {
        email: "deleted_user@example.com",
        password: hashedPw,
        question: null,
        answer: null,
        updatedAt: new Date(),
      },
      { where: { email: userInfo.email } }
    );

    res.send({ result: true, message: "회원삭제 완료" });
  } catch (error) {
    console.log("deleteAccount error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

// /**
//  * 내가 보낸 고민, 답장 가져오기
//  * 작성자: 하나래
//  */
// exports.sendedMsg = async (req, res) => {
//   try {
//     console.log("sendedMsg 호출됨");

//     const user = await exports.validation(req);
//     console.log("user: ", user);

//     if (user) {
//       const isReplied = await Message.findOne({
//         attributes: ["repliedOrNot"],
//         where: { userId: user.userId },
//       });
//       let msg = null;
//       if (isReplied?.repliedOrNot) {
//         msg = await Message.findOne({
//           attributes: [
//             "title",
//             "content",
//             "createdAt",
//             "repliedTitle",
//             "repliedContent",
//             "repliedDate",
//           ],
//           where: { userId: user.userId },
//         });
//       } else {
//         msg = await Message.findOne({
//           attributes: ["content", "createdAt"],
//           where: { userId: user.userId },
//         });
//       }

//       res.status(200).send({ result: msg });
//     }
//   } catch (error) {
//     console.error("sended-msg error:", error.message);
//     res.status(500).send({ result: false, message: "서버 에러" });
//   }
// };

// /**
//  * 내가 받은 고민, 답장 가져오기
//  * 작성자: 하나래
//  */
// exports.receivedMsg = async (req, res) => {
//   try {
//     const user = await exports.validation(req);
//     if (user) {
//       const isReplied = await Message.findOne({
//         attributes: ["repliedOrNot"],
//         where: { receivedUserId: user.userId },
//       });
//       let msg = null;
//       if (isReplied?.repliedOrNot) {
//         msg = await Message.findOne({
//           attributes: [
//             "title",
//             "content",
//             "createdAt",
//             "repliedTitle",
//             "repliedContent",
//             "repliedDate",
//           ],
//           where: { receivedUserId: user.userId },
//         });
//       } else {
//         msg = await Message.findOne({
//           attributes: ["content", "createdAt"],
//           where: { receivedUserId: user.userId },
//         });
//       }
//       res.status(200).send({ result: msg });
//     }
//   } catch (error) {
//     console.error("received-msg error:", error.message);
//     res.status(500).send({ result: false, message: "서버 에러" });
//   }
// };
