const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

if (loginForm) loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const error = document.getElementById("loginError");
  error.textContent = "";
  if (!email || !email.includes("@")) { error.textContent = "メールアドレスを正しく入力してください。"; return; }
  if (!password) { error.textContent = "パスワードを入力してください。"; return; }
  localStorage.setItem("reTailorLoggedIn", "true");
  location.href = "top-index.html";
});

if (signupForm) signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmation = document.getElementById("password_confirm").value;
  const error = document.getElementById("signupError");
  error.textContent = "";
  if (!email || !email.includes("@")) { error.textContent = "メールアドレスを正しく入力してください。"; return; }
  if (password.length < 8) { error.textContent = "パスワードは8文字以上で入力してください。"; return; }
  if (password !== confirmation) { error.textContent = "パスワードが一致しません。"; return; }
  localStorage.setItem("reTailorLoggedIn", "true");
  localStorage.setItem("reTailorProfile", JSON.stringify({ name: email.split("@")[0], joined: new Date().toISOString().slice(0, 7) }));
  location.href = "top-index.html";
});
