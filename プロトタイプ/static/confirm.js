// 購入内容確認(confirm.html)
// 購入手続き(buy.html)で入力した内容を表示し、「購入を確定する」で注文を保存する
const catalog = window.reTailorProducts;
const ids = (new URLSearchParams(location.search).get("items") || "1").split(",").map(Number);
const selected = ids.map((id) => catalog.find((item) => item.id === id)).filter(Boolean);
const yen = (value) => `¥${value.toLocaleString()}`;
const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const $ = (id) => document.getElementById(id);

const purchaseButton = document.querySelector(".purchase-action");
const backButton = document.querySelector(".back-action");
const backUrl = `buy.html?items=${ids.join(",")}`;
if (backButton) backButton.href = backUrl;
if (purchaseButton) purchaseButton.href = `purchase-history.html?items=${ids.join(",")}`;

// 購入手続きの入力内容。ない場合（URLを直接開いた場合など）は購入手続きへ戻す
let checkout = null;
try {
  checkout = JSON.parse(sessionStorage.getItem("reTailorCheckout") || "null");
} catch (error) {
  checkout = null;
}
if (!checkout || checkout.items !== ids.join(",")) {
  location.replace(backUrl);
}

if (checkout && checkout.items === ids.join(",")) {
  const subtotal = selected.reduce((sum, item) => sum + item.price, 0);
  const shippingFee = checkout.shipping.fee;
  const total = subtotal + shippingFee;

  $("confirmName").textContent = checkout.deliver.name;
  $("confirmAddress").textContent = checkout.deliver.text;
  $("confirmPhone").textContent = checkout.deliver.phone;
  $("confirmPayment").textContent = checkout.payment.label;
  $("confirmCardRow").hidden = !checkout.payment.last4;
  $("confirmCard").textContent = checkout.payment.last4 ? `**** **** **** ${checkout.payment.last4}` : "";
  $("confirmShipping").textContent = `${checkout.shipping.label}（送料 ${yen(shippingFee)}）`;
  $("confirmSubtotal").textContent = yen(subtotal);
  $("confirmShippingFee").textContent = yen(shippingFee);
  $("confirmTotal").textContent = yen(total);
  $("confirmItems").innerHTML = selected
    .map(
      (item) => `<div class="product-row">
  <div class="product-image" role="img" aria-label="${escapeHtml(item.name)}の商品画像">${escapeHtml(item.category)}</div>
  <div class="product-info">
    <h3>${escapeHtml(item.name)}</h3>
    <p class="seller">出品者：${escapeHtml(item.seller)}</p>
    <dl>
      <div><dt>カラー</dt><dd>${escapeHtml(item.color)}</dd></div>
      <div><dt>サイズ</dt><dd>${escapeHtml(item.size)}</dd></div>
      <div><dt>数量</dt><dd>1</dd></div>
      <div><dt>価格</dt><dd>${yen(item.price)}</dd></div>
    </dl>
  </div>
</div>`
    )
    .join("");

  if (purchaseButton)
    purchaseButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (selected.length === 0) {
        location.href = backUrl;
        return;
      }
      const orders = JSON.parse(localStorage.getItem("reTailorPurchaseHistory") || "[]");
      const id = Date.now();
      // 配送先・支払い方法・配送方法も注文に保存する（カード番号は保存しない）
      const order = {
        id,
        date: new Date().toLocaleString("ja-JP"),
        receipt: `RT-${id}`,
        items: selected,
        shippingFee,
        total,
        deliver: checkout.deliver,
        payment: { label: checkout.payment.label, last4: checkout.payment.last4 },
        shipping: { label: checkout.shipping.label, fee: shippingFee }
      };
      orders.unshift(order);
      localStorage.setItem("reTailorPurchaseHistory", JSON.stringify(orders));
      const cart = JSON.parse(localStorage.getItem("reTailorCart") || "[]");
      localStorage.setItem("reTailorCart", JSON.stringify(cart.filter((cartId) => !ids.includes(Number(cartId)))));
      sessionStorage.removeItem("reTailorCheckout");
      location.href = `purchase-history.html?order=${encodeURIComponent(order.id)}`;
    });
}
