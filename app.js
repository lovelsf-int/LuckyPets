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
    verified: true,
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
    verified: true,
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
    verified: true,
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
    verified: false,
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
    verified: false,
  },
];

const state = {
  intent: "all",
  species: "all",
  index: 0,
  matches: [],
};

const elements = {
  queueTitle: document.querySelector("#queueTitle"),
  queueCount: document.querySelector("#queueCount"),
  petCard: document.querySelector("#petCard"),
  petPhoto: document.querySelector("#petPhoto"),
  petIntent: document.querySelector("#petIntent"),
  petName: document.querySelector("#petName"),
  petMeta: document.querySelector("#petMeta"),
  petScore: document.querySelector("#petScore"),
  petBio: document.querySelector("#petBio"),
  petTraits: document.querySelector("#petTraits"),
  petHealth: document.querySelector("#petHealth"),
  matchList: document.querySelector("#matchList"),
  matchModal: document.querySelector("#matchModal"),
  matchTitle: document.querySelector("#matchTitle"),
  matchCopy: document.querySelector("#matchCopy"),
};

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

function renderPet() {
  const queue = getFilteredPets();
  if (!queue.length) {
    elements.queueTitle.textContent = "暂时没有符合条件的宠物";
    elements.queueCount.textContent = "0 / 0";
    elements.petPhoto.src = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80";
    elements.petPhoto.alt = "两只户外玩耍的狗";
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
  elements.queueTitle.textContent = state.intent === "breeding" ? "已开启繁育准入筛选" : "适合奶盖的新朋友";
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
  if (!state.matches.length) {
    elements.matchList.innerHTML = '<div class="empty-state">喜欢彼此后，新的配对会在这里出现。</div>';
    return;
  }

  elements.matchList.innerHTML = state.matches
    .slice(-3)
    .reverse()
    .map(
      (pet) => `
        <div class="match-item">
          <img src="${pet.photo}" alt="${pet.alt}" />
          <div>
            <strong>${pet.name}</strong>
            <p>${pet.intentLabel} · ${pet.score}% 契合</p>
          </div>
        </div>
      `,
    )
    .join("");
}

function moveNext() {
  const queue = getFilteredPets();
  if (!queue.length) return;
  state.index = (state.index + 1) % queue.length;
  renderPet();
}

function likePet() {
  const pet = getCurrentPet();
  if (!pet) return;
  if (!state.matches.some((match) => match.name === pet.name)) {
    state.matches.push(pet);
  }
  renderMatches();

  if (pet.score >= 86) {
    elements.matchTitle.textContent = `奶盖和 ${pet.name} 互相喜欢`;
    elements.matchCopy.textContent =
      pet.intent === "breeding"
        ? "繁育聊天前，请先完成健康记录、年龄、基因筛查和家长身份核验。"
        : "先从宠物习惯、见面边界和家长联系方式开始，慢慢来更安心。";
    elements.matchModal.showModal();
  }

  moveNext();
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

document.querySelector("#passBtn").addEventListener("click", moveNext);
document.querySelector("#likeBtn").addEventListener("click", likePet);
document.querySelector("#detailsBtn").addEventListener("click", () => {
  elements.matchTitle.textContent = "繁育前先过安全门槛";
  elements.matchCopy.textContent = "平台应要求兽医记录、年龄适配、遗传病筛查、主人身份和动物福利承诺，不通过就不能进入繁育聊天。";
  elements.matchModal.showModal();
});
document.querySelector("#closeModal").addEventListener("click", () => elements.matchModal.close());
document.querySelector(".segmented").addEventListener("click", applyFilter);
document.querySelector(".chip-list").addEventListener("click", applyFilter);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") moveNext();
  if (event.key === "ArrowRight") likePet();
  if (event.key === "Escape" && elements.matchModal.open) elements.matchModal.close();
});

renderPet();
renderMatches();
