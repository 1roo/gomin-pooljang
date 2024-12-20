const modal = document.querySelector(".modal");
const forgetPwModal = document.querySelector(".forgot-pw-modal");

// 첫 접속 시 화면 (로그인 모달)
window.addEventListener("load", () => {
  modal.style.display = "flex";
});

document.addEventListener("DOMContentLoaded", function () {
  // 첫 접속 시 로그인 화면만 보이도록 설정
  document.getElementById("login-screen").style.display = "block";
  document.getElementById("join-screen").style.display = "none";

  // 회원가입 버튼 클릭 시 로그인 화면 숨기고 회원가입 화면 보이기
  document.getElementById("join-btn").addEventListener("click", function () {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("join-screen").style.display = "block";
  });

  // 회원가입 화면에서 로그인 화면으로 돌아감
  document.getElementById("backToLogin").addEventListener("click", function () {
    document.getElementById("join-screen").style.display = "none";
    document.getElementById("login-screen").style.display = "block";
  });
});

// forget password 클릭 시 모달창
document.getElementById("forget-btn").addEventListener("click", function () {
  forgetPwModal.style.display = "flex";
});

// 모달 닫기 함수
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

// 비밀번호 찾기 모달 닫기 (X)
const closeForgetX = document.querySelector(".forgot-pw-modal .closeX");
closeForgetX.addEventListener("click", function () {
  closeModal(forgetPwModal);
});

document
  .querySelector(".receive-letter-btn")
  .addEventListener("click", receiveLetter);

// form-letter와 form-reply를 토글하는 함수
function receiveLetter() {
  // form-letter 요소 찾기
  const formLetter = document.querySelector('form[name="form-letter"]');

  // form-letter를 숨기기
  formLetter.style.display = "none";

  // form-reply가 이미 있으면 삭제하기
  const existingReplyForm = document.querySelector('form[name="form-reply"]');
  if (existingReplyForm) {
    existingReplyForm.remove(); // 기존 reply 폼 삭제
  }

  // 새로운 form-reply 폼 생성
  const formContainer = document.querySelector(".form-container");
  const newReplyForm = document.createElement("form");
  newReplyForm.setAttribute("name", "form-reply");
  newReplyForm.innerHTML = ` <div class="form-content">
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

  // 새로운 form-reply 폼을 form-container에 추가
  formContainer.appendChild(newReplyForm);

  // 새로운 form-reply를 보이게 설정
  newReplyForm.style.display = "block";
}
