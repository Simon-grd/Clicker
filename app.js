const images = [
  "/images/shrek.webp",
  "/images/babar.webp",
  "/images/bashar.webp",
  "/images/singe.webp",
  "/images/neta.webp",
];

function loadGame() {
  const saved = localStorage.getItem("clickerGame");
  if (saved) {
    const data = JSON.parse(saved);
    return {
      score: data.score || 0,
      level: data.level || 1,
      targetScore: data.targetScore || 10,
      credits: data.credits || 0,
      powers: data.powers || { kalash: 0, porteAvion: 0, nuclear: 0 },
      kills: data.kills || { shrek: 0, babar: 0, bashar: 0, singe: 0, neta: 0 },
      currentImg: data.currentImg ?? Math.floor(Math.random() * 5),
      totalClicks: data.totalClicks || 0,
    };
  }
  return {
    score: 0,
    level: 1,
    targetScore: 10,
    credits: 0,
    powers: { kalash: 0, porteAvion: 0, nuclear: 0 },
    kills: { shrek: 0, babar: 0, bashar: 0, singe: 0, neta: 0 },
    currentImg: Math.floor(Math.random() * 5),
    totalClicks: 0,
  };
}

function saveGame() {
  localStorage.setItem(
    "clickerGame",
    JSON.stringify({ score, level, targetScore, credits, powers, kills, currentImg, totalClicks })
  );
}

const gameData = loadGame();
let score = gameData.score;
let level = gameData.level;
let targetScore = gameData.targetScore;
let credits = gameData.credits;
let powers = gameData.powers;
let kills = gameData.kills;
let currentImg = gameData.currentImg;
let totalClicks = gameData.totalClicks;

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const creditsEl = document.getElementById("credits");
const imageEl = document.getElementById("clickImage");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const kalashEl = document.getElementById("kalash");
const porteAvionEl = document.getElementById("porteAvion");
const nuclearEl = document.getElementById("nuclear");
const powerDisplayEl = document.getElementById("powerDisplay");
const totalMultEl = document.getElementById("totalMult");
const kalashMultEl = document.getElementById("kalashMult");
const porteAvionMultEl = document.getElementById("porteAvionMult");
const nuclearMultEl = document.getElementById("nuclearMult");
const imprimanteEl = document.getElementById("imprimante");
const imprimanteTimerEl = document.getElementById("imprimanteTimer");
const statsEl = document.getElementById("stats");
const totalClicksEl = document.getElementById("totalClicks");
const progressBarEl = document.getElementById("progressBar");

let autoClickerInterval = null;
let autoClickerTimeout = null;
let powerPositions = [];

function updatePowerDisplay() {
  powerDisplayEl.innerHTML = "";
  const allPowers = [];
  for (let i = 0; i < powers.kalash; i++) allPowers.push('/images/kalash.webp');
  for (let i = 0; i < powers.porteAvion; i++) allPowers.push('/images/porte_avion.webp');
  for (let i = 0; i < powers.nuclear; i++) allPowers.push('/images/nuclear.webp');
  
  const maxDisplay = Math.min(allPowers.length, 30);
  powerPositions = [];
  
  for (let i = 0; i < maxDisplay; i++) {
    powerPositions.push({
      left: Math.random() * 90,
      top: Math.random() * 90
    });
  }
  
  for (let i = 0; i < maxDisplay; i++) {
    const img = document.createElement('img');
    img.className = 'w-12 h-12 object-contain';
    img.src = allPowers[i % allPowers.length];
    img.style.left = `${powerPositions[i].left}vw`;
    img.style.top = `${powerPositions[i].top}vh`;
    powerDisplayEl.appendChild(img);
  }
}

function updateDisplay() {
  levelEl.textContent = `Niveau ${level}`;
  imageEl.src = images[currentImg];
  imageEl.className =
    currentImg === 3
      ? "w-64 h-64 cursor-pointer rounded-lg"
      : "w-48 h-48 cursor-pointer rounded-lg";
  const baseMultiplier = level;
  const totalMultiplier =
    baseMultiplier +
    powers.kalash * 50 +
    powers.porteAvion * 100 +
    powers.nuclear * 150;
  scoreEl.textContent = `Score: ${score}`;
  creditsEl.textContent = `Crédits: ${credits}`;
  totalMultEl.textContent = `Multiplicateur: x${totalMultiplier}`;
  
  const progress = (score / targetScore) * 100;
  progressBarEl.style.width = `${progress}%`;
  
  kalashMultEl.textContent = `+${powers.kalash * 50}`;
  porteAvionMultEl.textContent = `+${powers.porteAvion * 100}`;
  nuclearMultEl.textContent = `+${powers.nuclear * 150}`;
  kalashEl.style.opacity = credits >= 20 ? "1" : "0.5";
  porteAvionEl.style.opacity = credits >= 60 ? "1" : "0.5";
  nuclearEl.style.opacity = credits >= 100 ? "1" : "0.5";
  imprimanteEl.style.opacity = credits >= 120 && !autoClickerInterval ? "1" : "0.5";

  totalClicksEl.textContent = `Clicks: ${totalClicks}`;
  statsEl.innerHTML = `
    <div class="text-center"><img src="/images/shrek.webp" class="w-16 h-16 mx-auto object-contain rounded" /><p class="text-sm mt-1">${kills.shrek}</p></div>
    <div class="text-center"><img src="/images/babar.webp" class="w-16 h-16 mx-auto object-contain rounded" /><p class="text-sm mt-1">${kills.babar}</p></div>
    <div class="text-center"><img src="/images/bashar.webp" class="w-16 h-16 mx-auto object-contain rounded" /><p class="text-sm mt-1">${kills.bashar}</p></div>
    <div class="text-center"><img src="/images/singe.webp" class="w-16 h-16 mx-auto object-contain rounded" /><p class="text-sm mt-1">${kills.singe}</p></div>
    <div class="text-center"><img src="/images/neta.webp" class="w-16 h-16 mx-auto object-contain rounded" /><p class="text-sm mt-1">${kills.neta}</p></div>
  `;
}

function buyPower(cost, powerName) {
  if (credits >= cost) {
    credits -= cost;
    powers[powerName]++;
    updatePowerDisplay();
    updateDisplay();
  }
}

updatePowerDisplay();
updateDisplay();

setInterval(saveGame, 30000);
saveBtn.onclick = saveGame;

resetBtn.onclick = () => {
  if (confirm("AH tié un CHAUD toi")) {
    localStorage.removeItem("clickerGame");
    location.reload();
  }
};

kalashEl.onclick = () => buyPower(20, "kalash");
porteAvionEl.onclick = () => buyPower(60, "porteAvion");
nuclearEl.onclick = () => buyPower(100, "nuclear");

imprimanteEl.onclick = () => {
  if (credits >= 120 && !autoClickerInterval) {
    credits -= 120;
    let timeLeft = 60;
    imprimanteTimerEl.textContent = `${timeLeft}s`;
    
    autoClickerInterval = setInterval(() => {
      imageEl.click();
    }, 100);
    
    const timerInterval = setInterval(() => {
      timeLeft--;
      imprimanteTimerEl.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
    
    autoClickerTimeout = setTimeout(() => {
      clearInterval(autoClickerInterval);
      autoClickerInterval = null;
      imprimanteTimerEl.textContent = "";
      updateDisplay();
    }, 60000);
    
    updateDisplay();
  }
};

function performClick() {
  totalClicks++;
  imageEl.style.animation = "none";
  setTimeout(() => {
    imageEl.style.animation = "bounce 0.5s";
  }, 15);
  
  let multiplier = level;
  multiplier +=
    powers.kalash * 50 + powers.porteAvion * 100 + powers.nuclear * 150;
  score += multiplier;
  credits += Math.floor(level / 2) + 1;

  if (score >= targetScore) {
    const names = ["shrek", "babar", "bashar", "singe", "neta"];
    kills[names[currentImg]]++;
    currentImg = Math.floor(Math.random() * 5);
    level++;
    credits += 10 + level * 2;
    score = 0;
    targetScore = Math.floor(15 * Math.pow(1.2, level - 1));
    updatePowerDisplay();
  }
  updateDisplay();
}

imageEl.onclick = performClick;
imageEl.oncontextmenu = (e) => {
  e.preventDefault();
  performClick();
};
