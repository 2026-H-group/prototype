const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchCards = [...document.querySelectorAll("#searchResults .card")];
const searchStatus = document.getElementById("searchStatus");

function filterSearchResults() {
  const query = searchInput.value.trim().toLowerCase();
  const visible = searchCards.filter((card) => card.textContent.toLowerCase().includes(query));
  searchCards.forEach((card) => { card.hidden = !visible.includes(card); });
  searchStatus.textContent = query ? `${visible.length}件の商品が見つかりました。` : "";
}

searchForm.addEventListener("submit", (event) => { event.preventDefault(); filterSearchResults(); });
