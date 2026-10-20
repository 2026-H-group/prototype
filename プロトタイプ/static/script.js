// 購入手続き(buy.html)
// 1. 選んだ商品と金額を表示  2. 入力の切り替え・補助  3. 入力チェック  4. 確認画面へ入力内容を引き継ぐ
document.addEventListener("DOMContentLoaded", () => {
  const items = new URLSearchParams(location.search).get("items") || "1";
  const confirmLink = document.getElementById("confirmLink");
  const catalog = window.reTailorProducts;
  const selected = items
    .split(",")
    .map(Number)
    .map((id) => catalog.find((item) => item.id === id))
    .filter(Boolean);
  const subtotal = selected.reduce((sum, item) => sum + item.price, 0);
  const yen = (value) => `¥${value.toLocaleString()}`;
  const escapeHtml = (text) =>
    String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  if (confirmLink) confirmLink.href = `confirm.html?items=${encodeURIComponent(items)}`;

  /* =========================
     商品情報（選んだ商品をすべて表示）
  ========================== */
  const buyItems = document.getElementById("buyItems");
  buyItems.innerHTML = selected.length
    ? selected
        .map(
          (item) => `<div class="product-row">
  <div class="product-image" role="img" aria-label="${escapeHtml(item.name)}の商品画像">${escapeHtml(item.category)}</div>
  <div class="product-info">
    <h3><a href="detail.html?id=${item.id}">${escapeHtml(item.name)}</a></h3>
    <p class="seller">出品者：${escapeHtml(item.seller)}</p>
    <dl>
      <div><dt>カラー</dt><dd>${escapeHtml(item.color)}</dd></div>
      <div><dt>サイズ</dt><dd>${escapeHtml(item.size)}</dd></div>
      <div><dt>数量</dt><dd>1</dd></div>
    </dl>
    <p class="product-price">${yen(item.price)}</p>
  </div>
</div>`
        )
        .join("")
    : '<p class="buy-empty">購入する商品を確認できません。<a href="search.html">商品を探す</a></p>';

  /* =========================
     送料と合計（配送方法に合わせて更新）
  ========================== */
  const shippingRadios = document.querySelectorAll('input[name="shipping"]');
  const shippingChoice = () => {
    const radio = document.querySelector('input[name="shipping"]:checked');
    return { key: radio.value, label: radio.dataset.label, fee: Number(radio.dataset.fee) };
  };

  function updateSummary() {
    const shipping = shippingChoice();
    document.getElementById("summarySubtotal").textContent = yen(subtotal);
    document.getElementById("summaryShipping").textContent = yen(shipping.fee);
    document.getElementById("summaryTotal").textContent = yen(subtotal + shipping.fee);
  }

  shippingRadios.forEach((radio) => radio.addEventListener("change", updateSummary));
  updateSummary();

  /* =========================
     住所の切り替え
  ========================== */
  const addressRadios = document.querySelectorAll('input[name="address"]');
  const registeredAddress = document.getElementById("registered-address");
  const newAddressForm = document.getElementById("new-address-form");

  function updateAddressForm() {
    const checked = document.querySelector('input[name="address"]:checked');
    if (!checked) return;
    const useNew = checked.value === "new";
    registeredAddress.style.display = useNew ? "none" : "block";
    newAddressForm.classList.toggle("active", useNew);
  }

  addressRadios.forEach((radio) => radio.addEventListener("change", updateAddressForm));
  updateAddressForm();

  /* =========================
     支払い方法の切り替え
  ========================== */
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  const cardBox = document.getElementById("card-box");

  function updatePaymentForm() {
    const checked = document.querySelector('input[name="payment"]:checked');
    if (!checked) return;
    cardBox.style.display = checked.value === "credit" ? "block" : "none";
  }

  paymentRadios.forEach((radio) => radio.addEventListener("change", updatePaymentForm));
  updatePaymentForm();

  /* =========================
     入力補助（カード番号・郵便番号）
  ========================== */
  const cardNumber = document.getElementById("card-number");
  cardNumber.addEventListener("input", () => {
    cardNumber.value = cardNumber.value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  });

  const postal = document.getElementById("postal");
  postal.addEventListener("input", () => {
    const digits = postal.value.replace(/\D/g, "").slice(0, 7);
    postal.value = digits.length > 3 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : digits;
  });

  /* =========================
     確認画面への遷移（入力チェック → 入力内容を引き継ぐ）
  ========================== */
  const confirmButton = document.querySelector(".confirm-btn");
  const error = document.getElementById("buyError");

  // エラー表示。該当の入力欄の近くに文言を出し、入力欄に印を付けてフォーカスを移す
  // （スマホでは注文内容のエラー欄が画面外になるため、入力欄のそばにも表示する）
  const inlineError = document.createElement("p");
  inlineError.className = "buy-error inline-error";
  inlineError.setAttribute("role", "alert");
  const clearInvalid = () => {
    document.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.removeAttribute("aria-invalid"));
    inlineError.textContent = "";
  };
  document.addEventListener("input", (event) => {
    event.target.removeAttribute?.("aria-invalid");
    inlineError.textContent = "";
  });

  confirmButton.addEventListener("click", (event) => {
    const fail = (message, field) => {
      event.preventDefault();
      error.textContent = message;
      if (field) {
        const anchor = field === confirmButton ? confirmButton : field.closest(".field, .radio-card") || field;
        anchor.after(inlineError);
        inlineError.textContent = message;
        if (field !== confirmButton) field.setAttribute("aria-invalid", "true");
        field.focus();
      }
    };
    error.textContent = "";
    clearInvalid();

    if (selected.length === 0) {
      fail("購入する商品を確認できません。商品一覧から選び直してください。", confirmButton);
      return;
    }

    const address = document.querySelector('input[name="address"]:checked');
    if (!address) {
      fail("配送先を選択してください。", addressRadios[0]);
      return;
    }
    // 確認画面に表示する配送先（登録済みの氏名・電話はプロトタイプ用の固定値）
    let deliver = { type: "registered", name: "山田 太郎", phone: "090-1234-5678", text: document.getElementById("address-list").value.trim() };
    if (address.value === "new") {
      const nameField = document.getElementById("name");
      const prefecture = document.getElementById("prefecture");
      const addressField = document.getElementById("address");
      const building = document.getElementById("building");
      const phoneField = document.getElementById("phone");
      const missing = [nameField, postal, prefecture, addressField, phoneField].find((field) => !field.value.trim());
      if (missing) {
        fail("新しい配送先の必須項目を入力してください。", missing);
        return;
      }
      if (!/^\d{3}-?\d{4}$/.test(postal.value.trim())) {
        fail("郵便番号を7桁で入力してください。", postal);
        return;
      }
      const phoneDigits = phoneField.value.replace(/\D/g, "");
      if (![10, 11].includes(phoneDigits.length)) {
        fail("電話番号を10桁または11桁で入力してください。", phoneField);
        return;
      }
      deliver = {
        type: "new",
        name: nameField.value.trim(),
        phone: phoneField.value.trim(),
        text: `〒${postal.value.trim()}　${prefecture.value}${addressField.value.trim()}${building.value.trim() ? ` ${building.value.trim()}` : ""}`
      };
    }

    const payment = document.querySelector('input[name="payment"]:checked');
    if (!payment) {
      fail("支払い方法を選択してください。", paymentRadios[0]);
      return;
    }
    const paymentLabels = { bank: "銀行振込", convenience: "コンビニ支払い", credit: "クレジットカード" };
    const paymentInfo = { type: payment.value, label: paymentLabels[payment.value], last4: "" };
    if (payment.value === "credit") {
      const cardDigits = cardNumber.value.replace(/\D/g, "");
      if (cardDigits.length !== 16) {
        fail("カード番号を16桁で入力してください。", cardNumber);
        return;
      }
      const expiry = document.getElementById("expiry");
      const expiryMatch = expiry.value.trim().match(/^(\d{1,2})\s*\/\s*(\d{2})$/);
      if (!expiryMatch || Number(expiryMatch[1]) < 1 || Number(expiryMatch[1]) > 12) {
        fail("有効期限をMM / YY形式で入力してください。", expiry);
        return;
      }
      const holder = document.getElementById("holder");
      if (!holder.value.trim()) {
        fail("カード名義人を入力してください。", holder);
        return;
      }
      const security = document.getElementById("security");
      if (!/^\d{3,4}$/.test(security.value.trim())) {
        fail("セキュリティコードを3桁または4桁で入力してください。", security);
        return;
      }
      // カード番号の全桁・セキュリティコードは保存しない。確認画面に出す下4桁だけ引き継ぐ
      paymentInfo.last4 = cardDigits.slice(-4);
    }

    const shipping = shippingChoice();
    sessionStorage.setItem(
      "reTailorCheckout",
      JSON.stringify({ items, deliver, payment: paymentInfo, shipping, subtotal, total: subtotal + shipping.fee })
    );
  });
});
