const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((item) => item.classList.toggle('active', item === tab));
  panels.forEach((panel) => panel.classList.toggle('active', panel.id === tab.dataset.tab));
}));
const profile = JSON.parse(localStorage.getItem('reTailorProfile') || '{}');
if (profile.name) { document.getElementById('userName').textContent = profile.name; document.getElementById('avatar').textContent = profile.name.slice(0, 1); }
if (profile.joined) { const [year, month] = profile.joined.split('-'); document.getElementById('joinedDate').textContent = `${year}年${Number(month)}月から利用`; }
const followingCount = document.getElementById('followingCount');
if (followingCount) followingCount.textContent = JSON.parse(localStorage.getItem('reTailorFollowing') || '[]').length;
