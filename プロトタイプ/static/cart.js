// カート一覧: 商品の選択・削除・合計表示 → 購入手続き(buy.html)へ
const catalog = window.reTailorProducts;
const CART_KEY = "reTailorCart";
const $ = (id) => document.getElementById(id);
const yen = (value) => `¥${value.toLocaleString()}`;
const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]").map(Number);
const saveCart = (ids) => localStorage.setItem(CART_KEY, JSON.stringify(ids));

// 選択中の商品ID。最初は全部選択（資料の「レジに進む（◯点）」に合わせる）
let selectedIds = new Set(getCart());

function cartItems() {
  const ids = getCart();
  return catalog.filter((item) => ids.includes(item.id));
}

function render() {
  const items = cartItems();
  const isEmpty = items.length === 0;
  $("emptyCart").hidden = !isEmpty;
  $("cartToolbar").hidden = isEmpty;
  $("cartSummary").hidden = isEmpty;
  $("cartList").innerHTML = items
    .map(
      (item) => `<article class="cart-item">
  <input class="item-check" type="checkbox" value="${item.id}" aria-label="${escapeHtml(item.name)}を購入対象にする"${selectedIds.has(item.id) ? " checked" : ""}>
  <div class="item-image" role="img" aria-label="${escapeHtml(item.name)}の商品画像">${escapeHtml(item.category)}</div>
  <div>
    <p class="item-name"><a href="detail.html?id=${item.id}">${escapeHtml(item.name)}</a></p>
    <p class="item-meta">カテゴリー：${escapeHtml(item.category)}<br>サイズ：${escapeHtml(item.size)}　カラー：${escapeHtml(item.color)}<br>出品者：${escapeHtml(item.seller)}</p>
    <span class="item-price">${yen(item.price)}</span>
  </div>
  <button class="remove-button" type="button" data-remove="${item.id}" aria-label="${escapeHtml(item.name)}をカートから削除">削除</button>
</article>`
    )
    .join("");
  updateTotal();
}

function updateTotal() {
  const items = cartItems();
  const checked = items.filter((item) => selectedIds.has(item.id));
  const total = checked.reduce((sum, item) => sum + item.price, 0);
  $("cartCount").textContent = `カート内 ${items.length}点`;
  $("selectedCount").textContent = `${checked.length}商品を選択中`;
  $("selectedTotal").textContent = yen(total);
  $("checkoutButton").textContent = checked.length ? `選択した商品を購入する（${checked.length}点） →` : "選択した商品を購入する →";
  const selectAll = $("selectAll");
  selectAll.checked = items.length > 0 && checked.length === items.length;
  selectAll.indeterminate = checked.length > 0 && checked.length < items.length;
  if (checked.length) $("cartError").textContent = "";
}

$("cartList").addEventListener("change", (event) => {
  const input = event.target.closest(".item-check");
  if (!input) return;
  const id = Number(input.value);
  input.checked ? selectedIds.add(id) : selectedIds.delete(id);
  updateTotal();
});

$("selectAll").addEventListener("change", (event) => {
  selectedIds = event.target.checked ? new Set(cartItems().map((item) => item.id)) : new Set();
  render();
});

$("cartList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  const id = Number(button.dataset.remove);
  saveCart(getCart().filter((cartId) => cartId !== id));
  selectedIds.delete(id);
  render();
  // 削除後はキーボード操作が迷子にならないよう、次の操作先へフォーカスを移す
  (document.querySelector(".remove-button") || $("emptyCart").querySelector("a"))?.focus();
});

$("checkoutButton").addEventListener("click", () => {
  const ids = cartItems()
    .filter((item) => selectedIds.has(item.id))
    .map((item) => item.id);
  if (!ids.length) {
    $("cartError").textContent = "購入する商品を1つ以上選択してください。";
    return;
  }
  location.href = `buy.html?items=${ids.join(",")}`;
});

render();
