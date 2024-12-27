document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("ratingModal");
  const btn = document.getElementById("ratingButton");
  const closeBtn = document.getElementById("closeModal");
  const submitBtn = document.getElementById("submitRating");
  const stars = document.querySelectorAll(".star");
  let currentRating = 0;

  btn.onclick = function () {
    modal.style.display = "block";
  };

  closeBtn.onclick = function () {
    modal.style.display = "none";
    resetStars();
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      resetStars();
    }
  };

  stars.forEach((star) => {
    star.addEventListener("click", setRating);
    star.addEventListener("mouseover", hoverRating);
    star.addEventListener("mouseout", resetStars);
  });

  function setRating(e) {
    currentRating = e.target.dataset.rating;
    resetStars();
    for (let i = 0; i < currentRating; i++) {
      stars[i].classList.add("active");
    }
  }

  function hoverRating(e) {
    resetStars();
    const hoverRating = e.target.dataset.rating;
    for (let i = 0; i < hoverRating; i++) {
      stars[i].classList.add("active");
    }
  }

  function resetStars() {
    stars.forEach((star) => star.classList.remove("active"));
    for (let i = 0; i < currentRating; i++) {
      stars[i].classList.add("active");
    }
  }

  submitBtn.onclick = function () {
    if (currentRating > 0) {
      alert(`${currentRating}점이 제출되었습니다.`);
      modal.style.display = "none";
      currentRating = 0;
      resetStars();
    } else {
      alert("별점을 선택해주세요.");
    }
  };
});