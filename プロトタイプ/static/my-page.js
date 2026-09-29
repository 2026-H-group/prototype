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
const followerCount = document.getElementById('followerCount');
const followingButton = document.getElementById('showFollowing');
const followersButton = document.getElementById('showFollowers');
const followListPanel = document.getElementById('followListPanel');
const followListTitle = document.getElementById('followListTitle');
const followList = document.getElementById('followList');
const followers = ['mika', 'haru', 'sora', 'yui', 'koto', 'rin', 'ao', 'nana', 'mei', 'aki', 'rei', 'hina'];
let activeList = null;
let listTrigger = null;

const readFollowing = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('reTailorFollowing') || '[]');
    return Array.isArray(stored) ? [...new Set(stored.filter((name) => typeof name === 'string'))] : [];
  } catch {
    return [];
  }
};

let following = readFollowing();

const updateFollowingCount = () => {
  followingCount.textContent = following.length;
};

const renderFollowList = () => {
  const usernames = activeList === 'following' ? following : followers;
  followListTitle.textContent = activeList === 'following' ? 'フォロー中' : 'フォロワー';
  followList.replaceChildren();

  if (usernames.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'follow-list-empty';
    empty.textContent = activeList === 'following' ? 'フォロー中のユーザーはいません。' : 'フォロワーはいません。';
    followList.append(empty);
    return;
  }

  usernames.forEach((username) => {
    const item = document.createElement('li');
    item.className = 'follow-list-item';
    const isFollowing = activeList === 'following';
    const name = document.createElement(isFollowing ? 'a' : 'span');
    name.className = 'follow-list-name';
    name.textContent = username;
    if (isFollowing) name.href = `seller.html?seller=${encodeURIComponent(username)}`;
    item.append(name);

    if (isFollowing) {
      const unfollowButton = document.createElement('button');
      unfollowButton.className = 'unfollow-button';
      unfollowButton.type = 'button';
      unfollowButton.dataset.unfollow = username;
      unfollowButton.textContent = 'フォロー解除';
      item.append(unfollowButton);
    }

    followList.append(item);
  });
};

const closeFollowList = () => {
  followListPanel.hidden = true;
  document.getElementById('followListBackdrop').hidden = true;
  document.body.classList.remove('follow-list-open');
  followingButton.setAttribute('aria-expanded', 'false');
  followersButton.setAttribute('aria-expanded', 'false');
  listTrigger?.focus();
};

const positionFollowList = (trigger) => {
  const margin = 16;
  const gap = 12;
  const triggerRect = trigger.getBoundingClientRect();
  const availableBelow = window.innerHeight - triggerRect.bottom - gap - margin;
  const availableAbove = triggerRect.top - gap - margin;
  const naturalHeight = followListPanel.getBoundingClientRect().height;
  const desiredHeight = Math.min(naturalHeight, 560, window.innerHeight * 0.7);
  const openAbove = availableBelow < desiredHeight && availableAbove > availableBelow;
  const availableSpace = openAbove ? availableAbove : availableBelow;
  const maxHeight = Math.max(120, Math.min(560, window.innerHeight * 0.7, availableSpace));

  followListPanel.style.maxHeight = `${maxHeight}px`;
  followListPanel.classList.toggle('above-trigger', openAbove);
  followListPanel.style.top = `${openAbove ? triggerRect.top - gap : triggerRect.bottom + gap}px`;
};

const showFollowList = (listName, trigger) => {
  if (!followListPanel.hidden && activeList === listName) {
    closeFollowList();
    return;
  }
  activeList = listName;
  listTrigger = trigger;
  followListPanel.hidden = false;
  document.getElementById('followListBackdrop').hidden = false;
  document.body.classList.add('follow-list-open');
  followingButton.setAttribute('aria-expanded', String(listName === 'following'));
  followersButton.setAttribute('aria-expanded', String(listName === 'followers'));
  renderFollowList();
  positionFollowList(followingButton);
};

followingButton.addEventListener('click', () => showFollowList('following', followingButton));
followersButton.addEventListener('click', () => showFollowList('followers', followersButton));
document.getElementById('closeFollowList').addEventListener('click', closeFollowList);
document.getElementById('followListBackdrop').addEventListener('click', closeFollowList);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !followListPanel.hidden) closeFollowList();
});

followList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-unfollow]');
  if (!button) return;
  following = following.filter((username) => username !== button.dataset.unfollow);
  localStorage.setItem('reTailorFollowing', JSON.stringify(following));
  updateFollowingCount();
  renderFollowList();
});

updateFollowingCount();
