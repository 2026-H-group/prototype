// ユーザー設定: 通知・プライバシー・表示言語を localStorage に保存。ログアウト・退会（プロトタイプ用）
const SETTINGS_KEY = "reTailorSettings";
const defaults = { notifyOrder: true, notifyPrice: true, notifyFollow: true, notifyNews: false, publicProfile: true, language: "ja" };
const $ = (id) => document.getElementById(id);

const readSettings = () => {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return { ...defaults };
  }
};

const settings = readSettings();

document.querySelectorAll("[data-setting]").forEach((control) => {
  const key = control.dataset.setting;
  if (control.type === "checkbox") control.checked = Boolean(settings[key]);
  else control.value = settings[key];

  control.addEventListener("change", () => {
    settings[key] = control.type === "checkbox" ? control.checked : control.value;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    const label = control.closest("label, .select-row")?.querySelector("strong, label")?.textContent || "設定";
    const state = control.type === "checkbox" ? (control.checked ? "オン" : "オフ") : "変更";
    $("settingsStatus").textContent = `「${label}」を${state}にしました。`;
  });
});

// ログアウト: ログイン状態だけを消してログイン画面へ
$("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("reTailorLoggedIn");
  location.href = "login.html";
});

// 退会: 確認パネルを開き、確定したらこのブラウザーの Re:Tailor 保存データを消してトップへ
const panel = $("withdrawPanel");
const openButton = $("withdrawOpen");

const setPanel = (open) => {
  panel.hidden = !open;
  openButton.setAttribute("aria-expanded", String(open));
};

openButton.addEventListener("click", () => {
  setPanel(true);
  $("withdrawCancel").focus();
});

$("withdrawCancel").addEventListener("click", () => {
  setPanel(false);
  openButton.focus();
});

panel.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setPanel(false);
    openButton.focus();
  }
});

$("withdrawConfirm").addEventListener("click", () => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith("reTailor"))
    .forEach((key) => localStorage.removeItem(key));
  sessionStorage.removeItem("reTailorCheckout");
  location.href = "top-index.html";
});
