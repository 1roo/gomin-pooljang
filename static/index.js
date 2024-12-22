const modal = document.querySelector(".modal");
const forgetPwModal = document.querySelector(".forgot-pw-modal");

/* 첫 접속 시 화면 (로그인 모달) */
window.addEventListener("load", () => {
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
document.getElementById("forget-btn").addEventListener("click", function () {
  forgetPwModal.style.display = "flex";
});

/* 모달 닫기 함수 */
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

// 비밀번호 찾기 모달 닫기 (X)
const closeX = document.querySelector(".modal_body .closeX");
closeX.addEventListener("click", function () {
  closeModal(modal);
});

/* 비밀번호 수정 버튼 클릭 시 비밀번호 수정 화면을 보이게 하는 부분 */
document.querySelector(".step1").addEventListener("click", function () {
  const pwUpdateContainer = document.querySelector(".pw-update-container");

  pwUpdateContainer.style.display = "block";
});

// 비밀번호 찾기 모달 닫기 (X)
const closeForgetX = document.querySelector(".forgot-pw-modal .closeX");
closeForgetX.addEventListener("click", function () {
  closeModal(forgetPwModal);
});

/* 고민 받기 버튼 클릭 시 새로고침 */
document
  .querySelector(".receive-letter-btn")
  .addEventListener("click", receiveLetter);

function receiveLetter() {
  const formLetter = document.querySelector('form[name="form-letter"]');

  formLetter.style.display = "none";

  // 기존의 form-reply가 있으면 삭제하기
  const existingReplyForm = document.querySelector('form[name="form-reply"]');
  if (existingReplyForm) {
    existingReplyForm.remove();
  }

  // 새로운 form-reply 폼 생성
  const formContainer = document.querySelector(".form-container");

  // formContainer가 존재하는지 확인
  if (!formContainer) {
    console.error("form-container not found!");
    return;
  }

  const newReplyForm = document.createElement("form");
  newReplyForm.setAttribute("name", "form-reply");

  // 올바른 HTML 구조로 생성
  newReplyForm.innerHTML = `
  <div class="form-content">
  <div class="form-group andLeft">
  <label for="title">
  <span>제목</span>
  </label>
  <input type="text" id="title" name="title" readonly />
      </div>
      <div class="form-group bottom andLeft">
        <label for="comment">
        <span>내용</span>
        </label>
        <textarea
        id="comment"
        name="comment"
        maxlength="200"
        readonly
        ></textarea>
        </div>
        <div class="form-group bottom andRight">
        <label for="comment">
          <span>답장</span>
          </label>
          <textarea id="comment" name="comment" maxlength="200"></textarea>
      </div>
    </div>`;

  formContainer.appendChild(newReplyForm);
  newReplyForm.style.display = "block";
}

/* axios */

/* 로그인 */
async function loginFn() {
  const form = document.forms["form-login"];
  const email = form.email.value;
  const password = form.password.value;

  if (email.trim() === 0 || password.trim() === 0) {
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
      url: "/",
      data: data,
    });
    console.log(res.data);
  } catch (e) {
    console.error("Error login:", e);
  }
}

/* 이메일 중복 검사 */
async function duplCheck() {
  const form = document.forms["form-login"];
  const email = form.email.value;

  if (!email) {
    alert("이메일을 입력해주세요.");
    return;
  }

  const data = { email };

  try {
    const res = await axios({
      method: "post",
      url: "/",
      data: data,
    });

    if (res.data) {
      alert("이미 등록된 이메일입니다.");
    } else {
      alert("사용 가능한 이메일입니다.");
    }
  } catch (e) {
    console.error("Error email duplication:", e);
  }
}

/* 회원가입 */
async function joinFn() {
  const form = document.forms["form-join"];
  const email = form.email.value;
  const newPw = form.newPw.value;
  const confirmPw = form.confirmPw.value;
  const question = form.question.value;
  const answer = form.answer.value;

  if (email.trim() === 0 || newPw.trim() === 0 || confirmPw.trim() === 0) {
    alert("이메일, 비밀번호를 모두 입력하셔야 합니다!");
    return;
  }

  if (question[0] === 0) {
    alert("질문을 선택 하셔야 합니다!");
    return;
  }

  if (answer.trim() === 0) {
    alert("답변을 입력하셔야 합니다!");
    return;
  }

  const data = {
    email,
    newPw,
    confirmPw,
    question,
    answer,
  };

  try {
    const res = await axios({
      method: "post",
      url: "/",
      data: data,
    });
    console.log(res.data);
  } catch (e) {
    console.error("Error join:", e);
  }
}

/* 비밀번호 수정 */

// 비밀번호 수정 완료 버튼
async function updatePw() {
  const form = document.forms["form-pw"];
  const email = form.email.value;
  const newPw = form.newPw.value;
  const confirmPw = form.confirmPw.value;

  // 비밀번호와 확인 비밀번호가 일치하지 않는 경우
  if (newPw.trim() !== confirmPw.trim()) {
    alert("비밀번호와 확인 비밀번호가 일치하지 않습니다.");

    newPw = "";
    confirmPw = "";

    newPw.focus();
    return;
  }

  const data = {
    email,
    newPw,
  };

  try {
    const res = await axios({
      method: "patch",
      url: "/",
      data: data,
    });
    alert("비밀번호가 수정되었습니다.");
    document.querySelector(".forgot-pw-modal").style.display = "none";
  } catch (e) {
    console.error("Error updating password:", e);
    alert("비밀번호 수정 중 오류가 발생했습니다. 다시 시도해 주세요.");
  }
}
