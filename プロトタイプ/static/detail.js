const products = {
  1: { name: "リネンシャツ", type: "中古品", category: "トップス", price: 850, seller: "linen_days", rating: "4.8", reviews: 12, listedAt: "2026年9月17日", condition: "目立った傷や汚れなし", brand: "無印良品", size: "M", color: "ナチュラル", material: "麻 100%", purchaseDate: "2024年春", shipping: "ゆうゆうメルカリ便", handling: "1〜2日", image: "トップス", description: "軽くて通気性のよいリネンシャツです。数回着用しましたが、目立つ汚れやほつれはありません。\nこれからの季節に一枚で、また羽織りとしても使いやすいアイテムです。", sellerRating: "本人確認済み・評価 4.8", sales: "取引 36件" },
  2: { name: "ハンドメイドニットセーター", type: "ハンドメイド品", category: "トップス", price: 5400, seller: "atelier_mio", rating: "5.0", reviews: 8, listedAt: "2026年9月16日", condition: "新品・未使用", brand: "atelier mio", size: "フリー", color: "アイボリー", material: "ウール・アクリル", purchaseDate: "2026年9月", shipping: "宅急便コンパクト", handling: "2〜3日", image: "ハンドメイド", description: "一編みずつ丁寧に仕上げたハンドメイドセーターです。ゆったりしたシルエットで、重ね着にも向いています。", sellerRating: "本人確認済み・評価 5.0", sales: "取引 18件" },
  3: { name: "ヴィンテージデニムジャケット", type: "中古品", category: "アウター", price: 8900, seller: "old_closet", rating: "4.9", reviews: 21, listedAt: "2026年9月15日", condition: "やや傷や汚れあり", brand: "Levi's", size: "L", color: "インディゴ", material: "綿 100%", purchaseDate: "不明", shipping: "宅急便", handling: "1〜2日", image: "アウター", description: "色落ちと風合いが魅力のヴィンテージデニムジャケットです。写真で状態をご確認ください。", sellerRating: "本人確認済み・評価 4.9", sales: "取引 52件" }
};
products[4] = { ...products[1], name: "プリーツスカート", category: "ボトムス", price: 1100, seller: "closet_note", image: "ボトムス" };
products[5] = { ...products[1], name: "キャンバストートバッグ", category: "アクセサリー", price: 700, seller: "daily_goods", image: "バッグ" };
products[6] = { ...products[1], name: "コットンワンピース", category: "トップス", price: 3200, seller: "mori_fuku", image: "ワンピース" };
products[7] = { ...products[3], name: "コーデュロイジャケット", price: 1500, seller: "old_closet", image: "アウター" };
products[8] = { ...products[1], name: "ビーズネックレス", category: "アクセサリー", price: 400, seller: "handmade_ito", type: "ハンドメイド品", image: "アクセサリー" };
const reviews = [
  { name: "mika", rating: "★★★★★", date: "2026/09/12", text: "写真どおりのきれいな状態でした。発送も早く、気持ちよく取引できました。" },
  { name: "haru", rating: "★★★★☆", date: "2026/08/28", text: "サイズ感がちょうどよく、これからたくさん着たいと思います。" }
];

function getProduct() { return products[new URLSearchParams(location.search).get("id")] || products[1]; }
function setText(id, value) { document.getElementById(id).textContent = value; }
function renderProduct(product) {
  document.title = `${product.name} | Re:Tailor`;
  setText("productName", product.name); setText("productType", product.type); setText("productCategory", product.category); setText("sellerName", product.seller); setText("sellerNameLarge", product.seller);
  setText("productPrice", `¥${product.price.toLocaleString()}`); setText("listedAt", product.listedAt); setText("productRating", "★★★★★"); setText("ratingText", product.rating); setText("reviewCount", `(${product.reviews}件)`); setText("productImage", product.image);
  setText("detailType", product.type);
  ["condition", "brand", "size", "color", "material", "purchaseDate", "shipping", "handling", "description"].forEach((key) => setText(key, product[key]));
  setText("sellerInitial", product.seller.slice(0, 1).toUpperCase()); setText("sellerRating", product.sellerRating); setText("sellerSales", product.sales);
}
function renderReviews() { document.getElementById("reviewList").innerHTML = reviews.map((review) => `<article class="review-item"><div class="review-meta"><span><strong>${review.name}</strong><span class="stars">${review.rating}</span></span><time>${review.date}</time></div><p>${review.text}</p></article>`).join(""); }
document.addEventListener("DOMContentLoaded", () => {
  renderProduct(getProduct()); renderReviews();
  document.getElementById("buyButton").addEventListener("click", () => { location.href = "buy.html"; });
  document.getElementById("favoriteButton").addEventListener("click", (event) => { const button = event.currentTarget; const active = button.classList.toggle("active"); button.setAttribute("aria-pressed", active); button.textContent = active ? "♥ お気に入り済み" : "♡ お気に入り"; });
});
