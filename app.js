const storageKey = "luckypets-mvp-state";

const defaultProfile = {
  name: "奶盖",
  city: "上海",
  breed: "金毛",
  age: "2 岁",
  intent: "玩伴",
  note: "喜欢短时间公园同行，第一次见面不脱牵引。",
  avatar: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=360&q=80",
};

const pets = [
  {
    name: "栗子",
    species: "dog",
    intent: "playdate",
    intentLabel: "玩伴",
    age: "3 岁",
    city: "上海 · 徐汇",
    score: 94,
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1200&q=80",
    alt: "草地上的金毛犬",
    bio: "温和、亲人，喜欢慢跑和飞盘。家长希望先从短时间公园同行开始。",
    traits: ["亲人", "会等牵引", "喜欢飞盘"],
    health: ["疫苗齐全", "驱虫记录", "体况良好"],
    opener: "栗子今天状态很好，可以先约一个 20 分钟公园同行。",
  },
  {
    name: "风铃",
    species: "cat",
    intent: "social",
    intentLabel: "交友",
    age: "1 岁",
    city: "杭州 · 西湖",
    score: 89,
    photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
    alt: "看向镜头的短毛猫",
    bio: "好奇心强，适合线上认识和交换养宠经验，暂不接受线下合笼见面。",
    traits: ["安静", "爱晒太阳", "慢热"],
    health: ["疫苗齐全", "已绝育"],
    opener: "风铃不太适合线下合笼，我们可以先交换照护经验。",
  },
  {
    name: "豆包",
    species: "rabbit",
    intent: "social",
    intentLabel: "交友",
    age: "8 个月",
    city: "苏州 · 园区",
    score: 82,
    photo: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1200&q=80",
    alt: "白色兔子趴在地面",
    bio: "胆子小但很亲近固定照顾者，家长想找同城兔友交流饮食和环境布置。",
    traits: ["慢热", "爱啃草", "怕吵"],
    health: ["体检正常", "不参与繁育"],
    opener: "豆包比较怕吵，交流环境布置会更合适。",
  },
  {
    name: "Taco",
    species: "dog",
    intent: "breeding",
    intentLabel: "繁育认证",
    age: "2 岁半",
    city: "上海 · 浦东",
    score: 91,
    photo: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80",
    alt: "坐在户外的小猎犬",
    bio: "家长只接受完成健康核验后的繁育沟通，见面前需先交换兽医记录。",
    traits: ["性格稳定", "同城", "家长可核验"],
    health: ["疫苗齐全", "年龄达标", "待补基因筛查"],
    opener: "繁育沟通前，我们先补齐基因筛查和兽医记录。",
  },
  {
    name: "团子",
    species: "cat",
    intent: "breeding",
    intentLabel: "繁育认证",
    age: "2 岁",
    city: "南京 · 秦淮",
    score: 86,
    photo: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80",
    alt: "灰白色猫趴在地面",
    bio: "已完成基础体检，家长希望先确认品种健康风险和照护计划。",
    traits: ["温顺", "不怕人", "室内生活"],
    health: ["疫苗齐全", "体检正常", "待审核谱系"],
    opener: "团子的资料还在审核，我们可以先聊照护计划。",
  },
];

const saved = loadSavedState();
const state = {
  intent: "all",
  species: "all",
  index: 0,
  view: "match",
  selectedChat: saved.selectedChat || "",
  matches: saved.matches || [],
  liked: saved.liked || [],
  passed: saved.passed || [],
  profile: { ...defaultProfile, ...(saved.profile || {}) },
};

const elements = {
  ownerAvatar: document.querySelector("#ownerAvatar"),
  ownerTitle: document.querySelector("#ownerTitle"),
  ownerMeta: document.querySelector("#ownerMeta"),
  queueTitle: document.querySelector("#queueTitle"),
  queueCount: document.querySelector("#queueCount"),
  petPhoto: document.querySelector("#petPhoto"),
  petIntent: document.querySelector("#petIntent"),
  petName: document.querySelector("#petName"),
  petMeta: document.querySelector("#petMeta"),
  petScore: document.querySelector("#petScore"),
  petBio: document.querySelector("#petBio"),
  petTraits: document.querySelector("#petTraits"),
  petHealth: document.querySelector("#petHealth"),
  matchList: document.querySelector("#matchList"),
  conversationList: document.querySelector("#conversationList"),
  chatSurface: document.querySelector("#chatSurface"),
  matchModal: document.querySelector("#matchModal"),
  matchTitle: document.querySelector("#matchTitle"),
  matchCopy: document.querySelector("#matchCopy"),
  profileForm: document.querySelector("#profileForm"),
};

function loadSavedState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveState() {
  const payload = {
    matches: state.matches,
    liked: state.liked,
    passed: state.passed,
    selectedChat: state.selectedChat,
    profile: state.profile,
  };
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function getPetByName(name) {
  return pets.find((pet) => pet.name === name);
}

function getFilteredPets() {
  return pets.filter((pet) => {
    const intentMatch = state.intent === "all" || pet.intent === state.intent;
    const speciesMatch = state.species === "all" || pet.species === state.species;
    return intentMatch && speciesMatch;
  });
}

function getCurrentPet() {
  const queue = getFilteredPets();
  return queue[state.index % queue.length];
}

function renderOwnerProfile() {
  elements.ownerAvatar.src = state.profile.avatar;
  elements.ownerTitle.textContent = `${state.profile.name}的家长`;
  elements.ownerMeta.textContent = `${state.profile.city} · ${state.profile.breed} · ${state.profile.age}`;

  elements.profileForm.name.value = state.profile.name;
  elements.profileForm.city.value = state.profile.city;
  elements.profileForm.breed.value = state.profile.breed;
  elements.profileForm.age.value = state.profile.age;
  elements.profileForm.intent.value = state.profile.intent;
  elements.profileForm.note.value = state.profile.note;
}

function renderPet() {
  const queue = getFilteredPets();
  if (!queue.length) {
    elements.queueTitle.textContent = "暂时没有符合条件的宠物";
    elements.queueCount.textContent = "0 / 0";
    elements.petPhoto.src = state.profile.avatar;
    elements.petPhoto.alt = `${state.profile.name}的照片`;
    elements.petIntent.textContent = "调整筛选";
    elements.petName.textContent = "换个条件看看";
    elements.petMeta.textContent = "附近还没有符合条件的新朋友";
    elements.petScore.textContent = "--";
    elements.petBio.textContent = "可以放宽目的、宠物类型或城市范围，再继续浏览。";
    elements.petTraits.innerHTML = '<span class="trait">扩大范围</span><span class="trait">切换目的</span>';
    elements.petHealth.innerHTML = '<span class="health warn">等待新资料</span>';
    return;
  }

  const pet = getCurrentPet();
  elements.queueTitle.textContent =
    state.intent === "breeding" ? "已开启繁育准入筛选" : `适合${state.profile.name}的新朋友`;
  elements.queueCount.textContent = `${state.index + 1} / ${queue.length}`;
  elements.petPhoto.src = pet.photo;
  elements.petPhoto.alt = pet.alt;
  elements.petIntent.textContent = pet.intentLabel;
  elements.petName.textContent = pet.name;
  elements.petMeta.textContent = `${pet.city} · ${pet.age}`;
  elements.petScore.textContent = `${pet.score}%`;
  elements.petBio.textContent = pet.bio;
  elements.petTraits.innerHTML = pet.traits.map((trait) => `<span class="trait">${trait}</span>`).join("");
  elements.petHealth.innerHTML = pet.health
    .map((item) => `<span class="health${item.includes("待") ? " warn" : ""}">${item}</span>`)
    .join("");
}

function renderMatches() {
  const matchedPets = state.matches.map(getPetByName).filter(Boolean);
  if (!matchedPets.length) {
    elements.matchList.innerHTML = '<div class="empty-state">喜欢彼此后，新的配对会在这里出现。</div>';
    return;
  }

  elements.matchList.innerHTML = matchedPets
    .slice(-3)
    .reverse()
    .map(
      (pet) => `
        <button class="match-item" type="button" data-chat="${pet.name}">
          <img src="${pet.photo}" alt="${pet.alt}" />
          <span>
            <strong>${pet.name}</strong>
            <span>${pet.intentLabel} · ${pet.score}% 契合</span>
          </span>
        </button>
      `,
    )
    .join("");
}

function renderMessages() {
  const matchedPets = state.matches.map(getPetByName).filter(Boolean);
  if (!matchedPets.length) {
    elements.conversationList.innerHTML = '<div class="empty-state">还没有配对，先去喜欢几个合适的新朋友。</div>';
    elements.chatSurface.innerHTML = '<div class="empty-state">配对后，聊天建议会出现在这里。</div>';
    return;
  }

  if (!state.selectedChat || !getPetByName(state.selectedChat)) {
    state.selectedChat = matchedPets[0].name;
  }

  elements.conversationList.innerHTML = matchedPets
    .map(
      (pet) => `
        <button class="conversation-btn${pet.name === state.selectedChat ? " is-active" : ""}" type="button" data-chat="${pet.name}">
          <img src="${pet.photo}" alt="${pet.alt}" />
          <span>
            <strong>${pet.name}</strong>
            <span>${pet.city}</span>
          </span>
        </button>
      `,
    )
    .join("");

  const pet = getPetByName(state.selectedChat);
  elements.chatSurface.innerHTML = `
    <div class="chat-header">
      <img src="${pet.photo}" alt="${pet.alt}" />
      <div>
        <p class="eyebrow">${pet.intentLabel}</p>
        <h3>${pet.name}</h3>
      </div>
    </div>
    <div class="message-stack">
      <p class="message-row inbound">${pet.opener}</p>
      <p class="message-row outbound">${state.profile.note}</p>
      <p class="message-row system">见面前请确认牵引、疫苗、过敏和紧急联系人。繁育沟通需先完成认证。</p>
    </div>
    <div class="composer" aria-label="消息输入">
      <input value="我们先确认一下见面时间和宠物状态。" aria-label="消息草稿" />
      <button class="nav-pill is-active" type="button">发送</button>
    </div>
  `;
  saveState();
}

function switchView(view) {
  state.view = view;
  document.querySelectorAll(".view-panel").forEach((panel) => {
    const isActive = panel.id === `${view}View`;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  if (view === "messages") renderMessages();
  if (view === "profile") renderOwnerProfile();
}

function moveNext() {
  const queue = getFilteredPets();
  if (!queue.length) return;
  const pet = getCurrentPet();
  if (pet && !state.passed.includes(pet.name)) {
    state.passed.push(pet.name);
  }
  state.index = (state.index + 1) % queue.length;
  saveState();
  renderPet();
}

function likePet() {
  const pet = getCurrentPet();
  if (!pet) return;
  if (!state.liked.includes(pet.name)) {
    state.liked.push(pet.name);
  }
  if (!state.matches.includes(pet.name)) {
    state.matches.push(pet.name);
  }
  state.selectedChat = pet.name;
  saveState();
  renderMatches();

  if (pet.score >= 86) {
    elements.matchTitle.textContent = `${state.profile.name}和 ${pet.name} 互相喜欢`;
    elements.matchCopy.textContent =
      pet.intent === "breeding"
        ? "繁育聊天前，请先完成健康记录、年龄、基因筛查和家长身份核验。"
        : "先从宠物习惯、见面边界和家长联系方式开始，慢慢来更安心。";
    elements.matchModal.showModal();
  }

  const queue = getFilteredPets();
  state.index = (state.index + 1) % queue.length;
  saveState();
  renderPet();
}

function applyFilter(event) {
  const intent = event.target.dataset.intent;
  const species = event.target.dataset.species;
  if (!intent && !species) return;

  if (intent) {
    state.intent = intent;
    document.querySelectorAll("[data-intent]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.intent === intent);
    });
  }

  if (species) {
    state.species = species;
    document.querySelectorAll("[data-species]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.species === species);
    });
  }

  state.index = 0;
  renderPet();
}

function saveProfile(event) {
  event.preventDefault();
  state.profile = {
    ...state.profile,
    name: elements.profileForm.name.value.trim() || defaultProfile.name,
    city: elements.profileForm.city.value.trim() || defaultProfile.city,
    breed: elements.profileForm.breed.value.trim() || defaultProfile.breed,
    age: elements.profileForm.age.value.trim() || defaultProfile.age,
    intent: elements.profileForm.intent.value,
    note: elements.profileForm.note.value.trim() || defaultProfile.note,
  };
  saveState();
  renderOwnerProfile();
  renderPet();
  elements.matchTitle.textContent = "资料已保存";
  elements.matchCopy.textContent = "新的宠物昵称、城市和见面边界会用于匹配页和消息页。";
  elements.matchModal.showModal();
}

document.querySelector("#passBtn").addEventListener("click", moveNext);
document.querySelector("#likeBtn").addEventListener("click", likePet);
document.querySelector("#detailsBtn").addEventListener("click", () => {
  elements.matchTitle.textContent = "繁育前先过安全门槛";
  elements.matchCopy.textContent = "平台应要求兽医记录、年龄适配、遗传病筛查、主人身份和动物福利承诺，不通过就不能进入繁育聊天。";
  elements.matchModal.showModal();
});
document.querySelector("#closeModal").addEventListener("click", () => elements.matchModal.close());
document.querySelector("#startChat").addEventListener("click", () => {
  elements.matchModal.close();
  switchView("messages");
});
document.querySelector(".segmented").addEventListener("click", applyFilter);
document.querySelector(".chip-list").addEventListener("click", applyFilter);
document.querySelector(".top-actions").addEventListener("click", (event) => {
  const view = event.target.dataset.view;
  if (view) switchView(view);
});
document.querySelector(".activity-panel").addEventListener("click", (event) => {
  const chatButton = event.target.closest("[data-chat]");
  if (!chatButton) return;
  state.selectedChat = chatButton.dataset.chat;
  switchView("messages");
});
elements.conversationList.addEventListener("click", (event) => {
  const chatButton = event.target.closest("[data-chat]");
  if (!chatButton) return;
  state.selectedChat = chatButton.dataset.chat;
  renderMessages();
});
elements.profileForm.addEventListener("submit", saveProfile);

document.addEventListener("keydown", (event) => {
  if (state.view !== "match") return;
  if (event.key === "ArrowLeft") moveNext();
  if (event.key === "ArrowRight") likePet();
  if (event.key === "Escape" && elements.matchModal.open) elements.matchModal.close();
});

renderOwnerProfile();
renderPet();
renderMatches();
