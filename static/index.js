const modal = document.querySelector(".modal");

// 첫 접속 시 모달

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

// 모달 닫기 함수
function closeModal() {
  const modal = document.querySelector(".modal");
  modal.style.display = "none"; // 모달 숨기기
}

// 닫기 버튼 이벤트 추가
const closeBtn = document.querySelector(".closeBtn");
closeBtn.addEventListener("click", closeModal);

const closeX = document.querySelector(".closeX");
closeX.addEventListener("click", closeModal);
