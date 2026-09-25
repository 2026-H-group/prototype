const listingKey = "reTailorListings";
const sampleListings = [
  { id: "sample-1", name: "ヴィンテージデニムジャケット", price: 8900, category: "アウター", status: "販売中" },
  { id: "sample-2", name: "ハンドメイドニットセーター", price: 5400, category: "トップス", status: "販売中" },
  { id: "sample-3", name: "コットンワンピース", price: 3200, category: "ワンピース", status: "販売中" }
];
const getListings = () => JSON.parse(localStorage.getItem(listingKey) || "null") || sampleListings;
const saveListings = (items) => localStorage.setItem(listingKey, JSON.stringify(items));

function renderListings() {
  const list = document.getElementById("listingList");
  if (!list) return;
  const listings = getListings();
  list.innerHTML = listings.map((item) => `<div class="card"><div class="card-img empty">${item.category}</div><div class="card-body"><div class="card-name">${item.name}</div><div class="card-price">￥${Number(item.price).toLocaleString()}</div><span class="card-status">${item.status}</span><div class="card-actions"><a class="btn-edit" href="naiyouhensyuu.html?id=${item.id}">編集</a><a class="btn-withdraw" href="torisage.html?id=${item.id}">取り下げ</a></div></div></div>`).join("");
}

function setupListingForm() {
  const submit = document.getElementById("listingSubmit");
  if (!submit) return;
  submit.addEventListener("click", (event) => {
    const name = document.getElementById("listingName").value.trim();
    const category = document.getElementById("listingCategory").value;
    const price = Number(document.getElementById("listingPrice").value.replace(/,/g, ""));
    const error = document.getElementById("listingError");
    if (!name || !category || !price || price < 1) {
      event.preventDefault();
      error.textContent = "商品名、カテゴリ、価格を入力してください。";
      return;
    }
    const listings = getListings();
    listings.unshift({ id: Date.now(), name, category, price, status: "販売中" });
    saveListings(listings);
  });
}

renderListings();
setupListingForm();
