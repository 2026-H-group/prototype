const STORAGE_KEY = "reTailorMyCloset";
const categoryFields = {
  tops: { label: "トップス", fields: [["categoryDetail", "カテゴリー", "Tシャツ / シャツ / ニット / その他", "text"], ["color", "カラー", "例：ホワイト", "text"], ["size", "サイズ", "例：M", "text"], ["length", "着丈（cm）", "例：68", "number"], ["width", "身幅（cm）", "例：52", "number"], ["sleeve", "袖丈（cm）", "例：60", "number"]] },
  bottoms: { label: "ボトムス", fields: [["categoryDetail", "カテゴリー", "パンツ / スカート / その他", "text"], ["color", "カラー", "例：ブラック", "text"], ["size", "サイズ", "例：M", "text"], ["totalLength", "総丈（cm）", "例：98", "number"], ["waist", "ウエスト（cm）", "例：72", "number"], ["riseInseam", "股上・股下（cm）", "例：30 / 68", "text"]] },
  outer: { label: "アウター", fields: [["color", "カラー", "例：カーキ", "text"], ["size", "サイズ", "例：L", "text"], ["length", "着丈（cm）", "例：72", "number"], ["width", "身幅（cm）", "例：58", "number"], ["sleeve", "袖丈（cm）", "例：62", "number"]] },
  shoes: { label: "靴", fields: [["categoryDetail", "カテゴリー", "スニーカー / ブーツ / サンダル / その他", "text"], ["color", "カラー", "例：ホワイト", "text"], ["size", "サイズ（cm）", "例：24.5", "text"]] },
  accessories: { label: "アクセサリー", fields: [["categoryDetail", "カテゴリー", "バッグ / 帽子 / ネックレス / その他", "text"], ["color", "カラー", "例：シルバー", "text"], ["size", "サイズ", "例：フリー", "text"]] }
};
const extraFields = [["season", "季節", "春 / 夏 / 秋 / 冬 / オールシーズン", "text"], ["style", "系統", "カジュアル / ストリート / Y2K / ナチュラル", "text"]];
const $ = (id) => document.getElementById(id);
function getItems() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
function saveItems(items) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
function fieldHtml(field) { return `<div class="field"><label for="${field[0]}">${field[1]}</label><input id="${field[0]}" name="${field[0]}" type="${field[3]}" placeholder="${field[2]}"></div>`; }
function renderFields() { const config = categoryFields[$("category").value]; $("categoryFields").innerHTML = `<p class="field-note">${config.label}の登録項目</p><div class="field-grid">${config.fields.concat(extraFields).map(fieldHtml).join("")}</div>`; }
function renderItems() { const items = getItems(); $("itemCount").textContent = `${items.length}件`; $("emptyMessage").hidden = items.length > 0; $("closetList").innerHTML = items.map((item, index) => `<article class="closet-item">${item.image ? `<img class="item-thumb" src="${item.image}" alt="${item.name}の商品写真">` : ""}<div class="item-main"><p class="item-name">${item.name}</p><p class="item-meta">${item.categoryLabel} / ${item.color || "カラー未登録"} / ${item.style || "系統未登録"}</p></div><button class="delete-button" type="button" data-index="${index}">削除</button></article>`).join(""); }
function readImage(file) { return file ? new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); }) : Promise.resolve(""); }
async function collectItem() { const form = new FormData($("closetForm")); const config = categoryFields[form.get("category")]; return { name: form.get("name").trim(), category: form.get("category"), categoryLabel: config.label, image: await readImage(form.get("imageFile")), ...Object.fromEntries(form.entries()) }; }
$("category").addEventListener("change", renderFields);
$("closetForm").addEventListener("submit", async (event) => { event.preventDefault(); const item = await collectItem(); $("formError").textContent = ""; if (!item.name) { $("formError").textContent = "商品名を入力してください。"; $("itemName").focus(); return; } const items = getItems(); items.push({ ...item, id: Date.now() }); saveItems(items); event.target.reset(); renderFields(); renderItems(); });
$("closetList").addEventListener("click", (event) => { const button = event.target.closest(".delete-button"); if (!button) return; const items = getItems(); items.splice(Number(button.dataset.index), 1); saveItems(items); renderItems(); });
renderFields(); renderItems();
