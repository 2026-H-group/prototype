// お気に入り一覧: 登録した商品の表示・カート追加・解除
const catalog = window.reTailorProducts;
const FAVORITES_KEY = "reTailorFavorites";
const CART_KEY = "reTailorCart";
const $ = (id) => document.getElementById(id);
const yen = (value) => `¥${value.toLocaleString()}`;
const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

const readIds = (key) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(stored) ? stored.map(Number) : [];
  } catch {
    return [];
  }
};
const writeIds = (key, ids) => localStorage.setItem(key, JSON.stringify(ids));

function favoriteItems() {
  const ids = readIds(FAVORITES_KEY);
  return catalog.filter((item) => ids.includes(item.id));
}

function render() {
  const items = favoriteItems();
  const cartIds = readIds(CART_KEY);
  $("favoriteEmpty").hidden = items.length > 0;
  $("favoriteCount").textContent = `お気に入り ${items.length}点`;
  $("favoriteList").innerHTML = items
    .map((item) => {
      const inCart = cartIds.includes(item.id);
      const name = escapeHtml(item.name);
      const cartControl = inCart
        ? `<a class="fav-button fav-button--ghost" href="cart.html">カートを見る</a>`
        : `<button class="fav-button" type="button" data-cart="${item.id}" aria-label="${name}をカートに入れる">カートに入れる</button>`;
      return `<article class="fav-item">
  <div class="item-image" role="img" aria-label="${name}の商品画像">${escapeHtml(item.category)}</div>
  <div>
    <p class="item-name"><a href="detail.html?id=${item.id}">${name}</a></p>
    <p class="item-meta">サイズ：${escapeHtml(item.size)}　カラー：${escapeHtml(item.color)}<br>出品者：${escapeHtml(item.seller)}</p>
    <span class="item-price">${yen(item.price)}</span>
  </div>
  <div class="fav-actions">
    ${cartControl}
    <button class="fav-button fav-button--link" type="button" data-remove="${item.id}" aria-label="${name}をお気に入りから外す">お気に入りから外す</button>
  </div>
</article>`;
    })
    .join("");
}

$("favoriteList").addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-cart]");
  if (addButton) {
    const id = Number(addButton.dataset.cart);
    const cart = readIds(CART_KEY);
    if (!cart.includes(id)) writeIds(CART_KEY, [...cart, id]);
    const name = catalog.find((item) => item.id === id)?.name || "商品";
    render();
    $("favoriteStatus").textContent = `「${name}」をカートに追加しました。`;
    document.querySelector(`[aria-label="${name}の商品画像"]`)?.closest(".fav-item")?.querySelector(".fav-actions a")?.focus();
    return;
  }

  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    const id = Number(removeButton.dataset.remove);
    const name = catalog.find((item) => item.id === id)?.name || "商品";
    writeIds(FAVORITES_KEY, readIds(FAVORITES_KEY).filter((favoriteId) => favoriteId !== id));
    render();
    $("favoriteStatus").textContent = `「${name}」をお気に入りから外しました。`;
    // 削除後はキーボード操作が迷子にならないよう、次の操作先へフォーカスを移す
    (document.querySelector("[data-remove]") || $("favoriteEmpty").querySelector("a"))?.focus();
  }
});

render();
