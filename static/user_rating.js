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
      // 백엔드로 별점 전송
      fetch("/update-temperature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: currentRating }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // 온도 표시 업데이트
            document.querySelector(".temperature").textContent =
              data.newTemperature + "°";
            alert(
              `${currentRating}점이 제출되었습니다. 새로운 온도: ${data.newTemperature}°`
            );
          } else {
            alert("온도 업데이트에 실패했습니다.");
          }
          modal.style.display = "none";
          currentRating = 0;
          resetStars();
        })
        .catch((error) => {
          console.error("오류:", error);
          alert("오류가 발생했습니다.");
        });
    } else {
      alert("별점을 선택해주세요.");
    }
  };
});
