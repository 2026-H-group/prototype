// ====================================================
// コーディネート診断（AIコーディネートアドバイザー）
//
// 今はまだ本物のAI API（オープンAIなど）と繋がっていないので、
// ランダムな結果を返す「模擬（モック）」のロジックにしている。
// hyouka_review.js と同じ考え方で、表示するデータを配列にまとめてから
// JSでHTMLを組み立てる方式にしている（HTMLに直接書かない）。
//
// 将来ここを本物のAI呼び出しに置き換えるときは、
// runCoordinateDiagnosis() の中身だけ書き換えればOK
// （呼び出し側の renderDiagnosis() は変更不要）。
// ====================================================

// ユーザーが選んだアイテム（本来はマイクローゼットや出品データから取得する）
const defaultItems = [
  { id: 3, name: "ヴィンテージデニムジャケット", price: "¥8,900" },
  { id: 2, name: "ハンドメイドニットセーター", price: "¥5,400" },
  { id: 6, name: "コットンワイドパンツ", price: "¥4,200" },
];
const closetItems = JSON.parse(localStorage.getItem("reTailorMyCloset") || "[]");
const selectedItems = closetItems.length
  ? closetItems.map((item) => ({ name: item.name, price: `${item.categoryLabel} / ${item.color || "色未登録"}`, image: item.image, closet: true }))
  : defaultItems;

// AIが「この着こなしに合う」として返すおすすめアイテムの候補セット
// （診断のたびにこの中から1セットをランダムに選ぶ）
const recommendationPools = [
  [
    { id: 5, name: "レザーベルト", price: "¥1,800" },
    { id: 4, name: "キャンバストートバッグ", price: "¥3,200" },
    { id: 7, name: "ウールマフラー", price: "¥2,400" },
  ],
  [
    { id: 8, name: "チェーンネックレス", price: "¥1,500" },
    { id: 4, name: "フェルトハット", price: "¥2,800" },
    { id: 1, name: "レザーシューズ", price: "¥6,500" },
  ],
  [
    { id: 8, name: "シルバーピアス", price: "¥1,200" },
    { id: 3, name: "デニムキャップ", price: "¥2,100" },
    { id: 5, name: "ミニショルダーバッグ", price: "¥4,600" },
  ],
];

// 色の組み合わせ候補（本来はAIが服の画像から色を解析して返す）
const colorPalettes = [
  ["#3f4a2e", "#8a5a2b", "#a3312c", "#d9d5cc", "#1c1c1c"],
  ["#274060", "#c9a66b", "#5c5346", "#e8e3d8", "#2e2e2e"],
  ["#5b3a29", "#a68a64", "#d6c7a1", "#333333", "#7a1f1f"],
];

// AI提案として表示するコメント（本来はAIが生成した文章）
const suggestionMessages = [
  "この組み合わせ、いい感じにまとまっています ✨",
  "落ち着いた色合いでバランスが良いコーディネートです",
  "アクセントカラーが効いた、おしゃれな組み合わせです",
];

// ---- 1. 診断結果を作る（今はランダムなモック） ----
function runCoordinateDiagnosis() {
  const score = Math.floor(Math.random() * (98 - 70 + 1)) + 70; // 70〜98%
  const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
  const message = suggestionMessages[Math.floor(Math.random() * suggestionMessages.length)];
  const recommended = recommendationPools[Math.floor(Math.random() * recommendationPools.length)];
  return { score, palette, message, recommended };
}

// ---- 2. 商品名・価格つきのアイテムカードをまとめて描画する ----
// selectedItems（変わらない）と recommendedItems（診断のたびに変わる）の
// どちらもこの関数を使って組み立てる
function renderItemGrid(containerId, items) {
  const grid = document.getElementById(containerId);
  grid.innerHTML = items
    .map(
      (item) => `
        <div class="coord-item">
          <a class="img-box${item.image ? " has-image" : " empty"}" href="${item.closet ? "my-closet.html" : `detail.html?id=${item.id}`}" aria-label="${item.name}の情報">${item.image ? `<img src="${item.image}" alt="${item.name}の写真">` : ""}</a>
          <p class="coord-item-name">${item.name}</p>
          <p class="coord-item-price">${item.price}</p>
        </div>
      `
    )
    .join("");
}

// ---- 3. 「あなたが選んだアイテム」は最初に一度だけ描画する ----
function renderSelectedItems() {
  renderItemGrid("selectedItems", selectedItems);
}

// ---- 4. 診断結果を画面に反映する ----
function applyDiagnosisResult(result) {
  document.getElementById("compatScore").textContent = result.score + "%";
  document.getElementById("compatBarFill").style.width = result.score + "%";
  document.getElementById("aiSuggestionText").textContent = result.message;

  const dotsWrap = document.getElementById("colorDots");
  dotsWrap.innerHTML = result.palette
    .map((color) => `<span class="dot" style="background:${color}"></span>`)
    .join("");

  renderItemGrid("recommendedItems", result.recommended);
}

// ---- 5. 「診断中…」の演出を挟んでから結果を反映する ----
// 本物のAI APIに繋いだときは、この setTimeout の部分が実際の通信待ちになる
function renderDiagnosis() {
  const box = document.getElementById("aiSuggestionBox");
  const text = document.getElementById("aiSuggestionText");
  const retryBtn = document.getElementById("retryBtn");

  box.classList.add("loading");
  text.textContent = "診断中…";
  retryBtn.disabled = true; // 診断中は連打できないようにする

  window.setTimeout(() => {
    const result = runCoordinateDiagnosis();
    applyDiagnosisResult(result);
    box.classList.remove("loading");
    retryBtn.disabled = false;
  }, 600);
}

// ---- 6. 「やり直す」ボタン：もう一度診断し直す ----
function setupRetryButton() {
  document.getElementById("retryBtn").addEventListener("click", renderDiagnosis);
}

// ---- 7. 「この組み合わせを保存」ボタン ----
function setupSaveButton() {
  document.getElementById("saveComboBtn").addEventListener("click", () => {
    const status = document.getElementById("saveStatus");
    status.textContent = "この組み合わせを保存しました。";
    document.getElementById("saveComboBtn").disabled = true;
  });
}

// ---- 8. ページ読み込み時に初期化 ----
document.addEventListener("DOMContentLoaded", () => {
  renderSelectedItems();
  renderDiagnosis();
  setupRetryButton();
  setupSaveButton();
});
