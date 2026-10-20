const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// 入力エラーの表示。該当の入力欄に aria-invalid を付けて、先頭の欄へフォーカスを戻す
function showFieldError(errorElement, message, field) {
  errorElement.textContent = message;
  const form = errorElement.closest("form");
  form.querySelectorAll("input").forEach((input) => input.removeAttribute("aria-invalid"));
  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.focus();
  }
}

function clearFieldError(errorElement) {
  errorElement.textContent = "";
  errorElement.closest("form").querySelectorAll("input").forEach((input) => input.removeAttribute("aria-invalid"));
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const error = document.getElementById("loginError");
    clearFieldError(error);
    if (!emailField.value.trim() || !emailField.value.includes("@")) {
      showFieldError(error, "メールアドレスを正しく入力してください。", emailField);
      return;
    }
    if (!passwordField.value) {
      showFieldError(error, "パスワードを入力してください。", passwordField);
      return;
    }
    localStorage.setItem("reTailorLoggedIn", "true");
    location.href = "top-index.html";
  });

  // Google / Apple ログインはプロトタイプでは未対応のため、押したら案内を表示する
  document.querySelectorAll("[data-social]").forEach((button) => {
    button.addEventListener("click", () => {
      document.getElementById("socialNote").textContent =
        `${button.dataset.social}でのログインはプロトタイプでは使えません。メールアドレスでログインしてください。`;
    });
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const confirmField = document.getElementById("password_confirm");
    const error = document.getElementById("signupError");
    const email = emailField.value.trim();
    clearFieldError(error);
    if (!email || !email.includes("@")) {
      showFieldError(error, "メールアドレスを正しく入力してください。", emailField);
      return;
    }
    if (passwordField.value.length < 8) {
      showFieldError(error, "パスワードは8文字以上で入力してください。", passwordField);
      return;
    }
    if (passwordField.value !== confirmField.value) {
      showFieldError(error, "パスワードが一致しません。", confirmField);
      return;
    }
    localStorage.setItem("reTailorLoggedIn", "true");
    localStorage.setItem("reTailorProfile", JSON.stringify({ name: email.split("@")[0], joined: new Date().toISOString().slice(0, 7) }));
    location.href = "top-index.html";
  });
}
