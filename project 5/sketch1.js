var cardData;
var birthdayImage;
let birthdayInput;
let submitButton;
let currentScene = 2;
let isLoading = false;
let magazinefont;
let typewriterfont;
let curlyfont;

// oracle state
let moonPhase = "";
let drawnCard = null;
let cardImg = null;
let cardSound = null;

function preload() {
  cardData = loadJSON("cards.json");
  birthdayImage = loadImage("images/background2.jpeg");
  magazinefont = loadFont("font1.ttf");
  typewriterfont = loadFont("font2.ttf");
  curlyfont = loadFont("font3.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(18);
  fill(255);

  birthdayInput = createInput();
  birthdayInput.attribute("placeholder", "MM/DD");
  birthdayInput.attribute("id", "birthday-input");
  birthdayInput.attribute("name", "birthday");
  birthdayInput.style("font-size", "18px");
  birthdayInput.style("padding", "8px");
  birthdayInput.show();

  submitButton = createButton("pull a card");
  submitButton.style("font-size", "20px");
  submitButton.style("padding", "8px 16px");
  submitButton.mousePressed((e) => {
    e.stopPropagation();
    handleSubmit();
  });
  submitButton.show();
}

function draw() {
  if (currentScene === 2) scene2();
  else if (currentScene === 3) scene3();
}

// SCENE 2 — birthday input
function scene2() {
  background(birthdayImage);
  fill(255);
  textAlign(CENTER);
  textSize(60);
  text("enter the day you arrived in the world", width / 2, height / 2 - 60);
  textFont(magazinefont);

  birthdayInput.position(width / 2- 150, height / 2 - 10);
  submitButton.position(width / 2-110, height / 2 + 40);
}

// SCENE 3 — the reveal
function scene3() {
  background(0);

  if (!drawnCard || !cardImg) return;

  let phaseNames = ["New Moon", "First Quarter", "Full Moon", "Last Quarter"];

  imageMode(CENTER);
  image(cardImg, width / 2, height / 2 - 30, 350, 500);

  fill(255);
  textAlign(CENTER);
  textSize(50);
  textFont(magazinefont);
  text(drawnCard.name, width / 2, 100);

  textSize(20);
  textFont(typewriterfont);
  text(drawnCard.definition, 500, 680,500,500);

  fill(180);
  textSize(30);
    textFont(curlyfont);
  text("you are born under the " + phaseNames[moonPhase], 200, 400,200,200);
}

// HANDLE SUBMIT
async function handleSubmit() {
  if (isLoading) return;
  isLoading = true;

  let val = birthdayInput.value().trim();
  if (!val) { isLoading = false; return; }

  let parts = val.split("/");
  if (parts.length !== 2) { isLoading = false; return; }

  let month = int(parts[0]);
  let day = int(parts[1]);
  if (isNaN(month) || isNaN(day)) { isLoading = false; return; }

  birthdayInput.hide();
  submitButton.hide();

  moonPhase = await getMoonPhase(month, day);
  console.log("moon phase:", moonPhase);

  let pool = getCardPool(moonPhase);
  console.log("card pool:", pool);

  if (pool.length === 0) {
    console.log("ERROR: no cards found for phase", moonPhase);
    isLoading = false;
    return;
  }

  drawnCard = pool[floor(random(pool.length))];
  console.log("drawn card:", drawnCard);

  cardImg = loadImage(drawnCard.image,
    () => {
      console.log("image loaded, going to scene 3");
      goToScene(3);

      cardSound = loadSound(drawnCard.audio,
        () => {
          cardSound.setVolume(0);
          cardSound.play();
          cardSound.setVolume(1, 3);
          isLoading = false;
        },
        (err) => { console.log("sound error:", err); isLoading = false; }
      );
    },
    (err) => { console.log("image error:", err); isLoading = false; }
  );
}

// SCENE TRANSITION
function goToScene(n) {
  console.log("going to scene", n);
  currentScene = n;
  birthdayInput.hide();
  submitButton.hide();
}

// MOON PHASE API
async function getMoonPhase(month, day) {
  let year = new Date().getFullYear();
  let bday = new Date(year, month - 1, day);
  if (bday > new Date()) year -= 1;

  let url = `https://craigchamberlain.github.io/moon-data/api/moon-phase-data/${year}/index.json`;
  let res = await fetch(url);
  let data = await res.json();

  let birthday = new Date(`${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`).getTime();
  let phases = data.filter(d => new Date(d.Date).getTime() <= birthday);
  let closest = phases[phases.length - 1];

  return closest.Phase;
}

// CARD POOL
function getCardPool(phase) {
  let cards = Object.values(cardData);
  return cards.filter(c => c.phase === phase);
}