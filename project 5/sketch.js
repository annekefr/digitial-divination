var cardData;
var openingImage;
var birthdayImage;
let birthdayInput;
let currentScene = 1;
let submitButton;
let restartButton; 

let moonPhase="";
let drawnCard = null;
let cardAudio = null;
let cardImg = null;

let colours = [#ECAB42, #F7B3CB, #BBDEF0, #BEA3CB];


function preload(){
    cardData = loadJSON("cards.json");
    openingImage = loadImage("*/openingImage.jpg");
    birthdayImage = loadImage("*/birthdayImage.jpg");

}
function setup(){
    createCanvas(500,500);

    birthdayInput = createInput();
    birthdayInput.position(20, 20);
    birthdayInput.size(100);
    birthdayInput.input(handleBirthdayInput);

    submitButton = createButton("ask the oracle");
  submitButton.style("font-size", "16px");
  submitButton.style("padding", "8px 16px");
  submitButton.mousePressed(handleSubmit);
  submitButton.hide();


}

function draw(){
    if (currentScene === 1) scene1();
  else if (currentScene === 2) scene2();
  else if (currentScene === 3) scene3();
  else if (currentScene === 4) scene4();
}

function scene1 (){
    background(openingImage);

}
function mousePressed(){
    if (currentScene === 1) {
        currentScene = 2;
    }
}


function scene2(){
    background(birthdayImage);
}

async function handleSubmit() {
    
}

function scene3(){


}

function scene4(){
backgroundColour = random(colours);
background(backgroundColour);

restartButton = createButton("restart!");
  restartButton.style("font-size", "16px");
  restartButton.style("padding", "8px 16px");
  restartButton.mousePressed(() => {
    currentScene = 1;
  });
  restartButton.hide();
}

async function moonPhase(){

}