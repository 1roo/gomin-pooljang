const modal = document.querySelector(".modal");
const forgetPwModal = document.querySelector(".forgot-pw-modal");

const dataContainer = document.getElementById("data-container");
const jwt = dataContainer.getAttribute("data-jwt");
const loginStatus = dataContainer.getAttribute("data-login-status");
const decodedPayload = dataContainer.getAttribute("data-decoded-payload");
const userId = dataContainer.getAttribute("data-userId");

/* 첫 접속 시 화면 (로그인 모달) */
window.addEventListener("load", () => {
  console.log("JWT: ", jwt);
  console.log("Login Status: ", loginStatus);
  console.log("Decoded Payload: ", decodedPayload);
  console.log("로그인회원 기본키 userId =  ", userId);
  if (loginStatus === "true") {
    return;
  }
  modal.style.display = "flex";
});

/* 회원 가입 모달 */
document.addEventListener("DOMContentLoaded", function () {
  // 첫 접속 시 로그인 화면만 보이도록 설정
  document.getElementById("login-screen").style.display = "block";
  document.getElementById("join-screen").style.display = "none";

  // 회원가입 버튼 클릭 시 로그인 화면 숨기고 회원가입 화면 보이기
  document.getElementById("join-btn").addEventListener("click", function () {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("join-screen").style.display = "block";
  });
});

/* 비밀번호 수정 모달 */
document.querySelector(".forget").addEventListener("click", function () {
  forgetPwModal.style.display = "flex";
});

/**
 * 모달
 * 닫기
 * 함수
 */
function closeModal(modalToClose) {
  modalToClose.style.display = "none";
}

// 로그인 모달 닫기 버튼
const closeBtn = document.querySelector(".closeBtn");
closeBtn.addEventListener("click", function () {
  closeModal(modal);
});

// 비밀번호 찾기 모달 닫기 버튼
const closePwBtn = document.querySelector(".closeBtn-pw");
closePwBtn.addEventListener("click", function () {
  closeModal(forgetPwModal);
});

// 로그인 모달 닫기 (X)
const closeX = document.querySelector(".modal_body .closeX");
closeX.addEventListener("click", function () {
  closeModal(modal);
});

// 비밀번호 찾기 모달 닫기 (X)
const closeForgetX = document.querySelector(".forgot-pw-modal .closeX");
closeForgetX.addEventListener("click", function () {
  closeModal(forgetPwModal);
});

/* axios */

/**
 * 받은 고민
 * 건너뛰기
 * 버튼 클릭 시
 */

async function rejectLetter() {
  const data = {
    userId,
  };

  try {
    const res = await axios({
      method: "post",
      url: "/worryList",
      data: data,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const { result, randomWorryList } = res.data;
    if (result) {
      const title = document.querySelector(".replyTitle");
      const msg = document.querySelector(".replyMessage");
      title.value = randomWorryList[0].title;
      msg.value = randomWorryList[0].senderContent;
    }
  } catch (e) {
    console.error("Error send message:", e);
  }
}

/**
 * 고민 받기
 * 버튼 클릭 시
 * 새로고침
 */

async function receiveLetter() {
  const formLetter = document.querySelector('form[name="form-letter"]');
  const formReply = document.querySelector('form[name="form-reply"]');
  const getId = document.getElementById("getId");

  if (formLetter && formReply) {
    // 'form-letter'는 숨기고, 'form-reply'는 보이게
    formLetter.style.display =
      formLetter.style.display === "none" ? "block" : "none";
    formReply.style.display =
      formReply.style.display === "none" ? "block" : "none";
  }
  const data = {
    userId,
  };

  try {
    const res = await axios({
      method: "post",
      url: "/worryList",
      data: data,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const { result, randomWorryList } = res.data;
    console.log(result);
    if (result) {
      const title = document.querySelector(".replyTitle");
      console.log("title", title);
      const msg = document.querySelector(".replyMessage");
      title.value = randomWorryList[0].title;
      msg.value = randomWorryList[0].senderContent;
      getId.value = randomWorryList[0].Id;
    }
  } catch (e) {
    console.error("Error send message:", e);
  }
}

/**
 * 고민
 * 보내기
 * 버튼
 */

async function sendContent() {
  const form = document.forms["form-letter"];
  const title = form.title.value;
  const senderContent = form.message.value;
  // const token = localStorage.getItem("token");

  if (title.trim() === "" || senderContent.trim() === "") {
    alert("제목과 내용을 작성해주세요!");
    return;
  }

  const data = {
    title,
    senderContent,
    userId,
  };

  try {
    const res = await axios({
      method: "post",
      url: "/addWorryList",
      data: data,
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    const { result, message } = res.data;
    if (result) {
      alert(message);
    }
  } catch (e) {
    console.error("Error send message:", e);
  }
}

/**
 * 답장
 * 보내기
 * 버튼
 */

async function submitReply() {
  const form = document.forms["form-reply"];
  const comment = form.comment.value;
  const getId = document.getElementById("getId").value;
  console.log(getId);
  // const token = localStorage.getItem("token");

  if (comment.trim() === "") {
    alert("답장을 입력해주세요!!");
    return;
  }

  const data = {
    Id: getId,
    userId,
    responderContent: comment,
  };

  try {
    const res = await axios(
      {
        method: "patch",
        url: "/addAnswer",
        data: data,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    const { result, message } = res.data;
    if (result) {
      alert(message);
    }
  } catch (e) {
    console.error("Error submit reply:", e);
  }
}

/**
 * 로그인
 */
async function loginFn() {
  const form = document.forms["form-login"];
  const email = form.email.value;
  const password = form.password.value;

  if (email.trim() === "" || password.trim() === "") {
    alert("이메일, 비밀번호를 모두 입력하셔야 합니다!");
    return;
  }

  const data = {
    email,
    password,
  };

  try {
    const res = await axios({
      method: "post",
      url: "/login",
      data: data,
    });

    const { token, result, message } = res.data;
    if (result) {
      // localStorage에 저장
      // localStorage.setItem("token", token);
      alert("로그인 성공!");
      closeModal(modal);
      document.location.href = "/";
    } else {
      if (message === "invalid_email") {
        document.querySelector(".id_error").style.display = "inline";
      } else if (message === "invalid_password") {
        document.querySelector(".pw_error").style.display = "inline";
      }
      form.reset();
    }
  } catch (e) {
    console.error("Error login:", e);
  }
}

/**
 * 이메일
 * 중복
 * 검사
 */
async function duplCheck() {
  const form = document.forms["form-join"];
  const email = form.email.value;
  const token = localStorage.getItem("token");
  const domain = form.domain.value;

  if (!email) {
    alert("이메일을 입력해주세요.");
    return;
  }

  const fullEmail = `${email}@${domain}`;

  const data = { email: fullEmail };

  try {
    const res = await axios({
      method: "post",
      url: "/check-email",
      data: data,
    });

    const { result } = res.data;
    if (result) {
      alert("이미 등록된 이메일입니다.");
      form.reset();
    } else {
      alert("사용 가능한 이메일입니다.");
      const newPw = form.newPw.value;
      form.newPw.focus();
    }
  } catch (e) {
    console.error("Error email duplication:", e);
  }
}

/**
 * 회원가입
 */
async function joinFn() {
  const form = document.forms["form-join"];
  const email = form.email.value;
  const domain = form.domain.value;
  const password = form.password.value;
  const confirmPw = form.confirmPw.value;
  const question = form.question.value;
  const answer = form.answer.value;

  // 유효성 검사

  if (password.trim() === "" || confirmPw.trim() === "") {
    alert("이메일, 비밀번호를 모두 입력하셔야 합니다!");
    return;
  }

  if (!question) {
    alert("질문을 선택 하셔야 합니다!");
    return;
  }

  if (answer.trim() === "") {
    alert("답변을 입력하셔야 합니다!");
    return;
  }

  // 비밀 번호 일치 여부 (확인)

  if (password.trim() !== confirmPw.trim()) {
    alert("비밀번호와 확인 비밀번호가 일치하지 않습니다.");

    form.password.value = "";
    form.confirmPw.value = "";

    form.password.focus();
    return;
  }

  const fullEmail = `${email}@${domain}`;

  const data = {
    email: fullEmail,
    password,
    question,
    answer,
  };

  try {
    const res = await axios({
      method: "post",
      url: "/regist",
      data: data,
    });
    const { result } = res.data;
    if (result) {
      const joinBtn = document.querySelector(".joinBtn");
      joinBtn.focus();
    } else {
      alert("회원 가입 시 작성한 질문, 답과 일치하지 않습니다.");
    }

    if (result) {
      const formLogin = document.getElementById("login-screen");
      const formJoin = document.getElementById("join-screen");
      formLogin.style.display = "block";
      formJoin.style.display = "none";
    }
  } catch (e) {
    console.error("Error join:", e);
  }
}

/**
 * 비밀번호
 * 수정
 * forget password?
 */

// 비밀 번호 수정 버튼
async function checkAnswer() {
  const form = document.forms["form-pw"];
  const email = form.email.value;
  const question = form.question.value;
  const answer = form.answer.value;
  const token = localStorage.getItem("token");

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailPattern.test(email)) {
    alert("유효한 이메일 주소를 입력하세요!");
    return;
  }

  if (!question || !answer) {
    alert("질문, 답을 모두 입력하셔야 합니다!");
    return;
  }

  const data = {
    email,
    question,
    answer,
  };

  try {
    const res = await axios(
      {
        method: "post",
        url: "/findAccount",
        data: data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { result, message } = res.data;
    if (result) {
      // 질문과 답이 일치하면 비밀번호 수정 화면 보이기
      alert(message);
      const complete = document.querySelector(".pw-update-container");
      complete.style.display = "block";
    } else {
      alert("회원 가입 시 작성한 질문, 답과 일치하지 않습니다.");
      form.reset();
      form.email.focus();
    }
  } catch (e) {
    console.error("Error updating password:", e);
  }
}

/**
 * 비밀번호
 * 수정 완료
 * 버튼
 */
async function updatePw() {
  const form = document.forms["form-pw"];
  const email = document.email.value;
  const password = form.password.value;
  const confirmPw = form.confirmPw.value;
  const token = localStorage.getItem("token");

  if (password.trim() !== confirmPw.trim()) {
    alert("비밀번호와 확인 비밀번호가 일치하지 않습니다.");

    form.password.value = "";
    form.confirmPw.value = "";

    form.password.focus();
    return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailPattern.test(email)) {
    alert("유효한 이메일 주소를 입력하세요!");
    return;
  }

  const data = {
    email,
    password,
  };

  try {
    const res = await axios(
      {
        method: "post",
        url: "/makeNewPw",
        data: data,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { result, message } = res.data;
    if (result) {
      alert(message);
      document.querySelector(".forgot-pw-modal").style.display = "none";
    } else {
      form.reset();
    }
  } catch (e) {
    console.error("Error updating password:", e);
    alert("비밀번호 수정 중 오류가 발생했습니다. 다시 시도해 주세요.");
  }
}
