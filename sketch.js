let pokemonImages = [];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let loadedImages = {}; 

function preload() {
  fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
    .then(response => response.json())
    .then(data => {
      let promises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
      Promise.all(promises).then(pokemons => {
        pokemonImages = pokemons.map(p => p.sprites.front_default);
        let imagePromises = pokemonImages.map(url => {
          return new Promise((resolve) => {
            loadImage(url, img => {
              loadedImages[url] = img;
              resolve();
            });
          });
        });
        
        Promise.all(imagePromises).then(() => {
          setupGame();
        });
      });
    });
}

function setup() {
  createCanvas(400, 400);
  if (pokemonImages.length === 0) {
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Cargando Pokémons...", width/2, height/2);
  }
}

function setupGame() {
  let images = [...pokemonImages, ...pokemonImages];
  images = shuffle(images);
  
  for (let i = 0; i < images.length; i++) {
    cards.push({
      img: images[i],
      flipped: false,
      matched: false
    });
  }
}

function draw() {
  background(220);
  
  if (cards.length === 0) {
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Cargando Pokémons...", width/2, height/2);
    return;
  }
  
  for (let i = 0; i < cards.length; i++) {
    let x = (i % 5) * 80;
    let y = floor(i / 5) * 100;
    
    if (cards[i].flipped || cards[i].matched) {
      if (loadedImages[cards[i].img]) {
        image(loadedImages[cards[i].img], x, y, 80, 100);
      }
    } else {
      fill(100);
      rect(x, y, 80, 100);
      
      fill(50);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("?", x + 40, y + 50);
    }
  }
}

function mousePressed() {
  if (!canFlip || cards.length === 0) return;
  
  let col = floor(mouseX / 80);
  let row = floor(mouseY / 100);
  let index = row * 5 + col;
  
  if (index >= 0 && index < cards.length && !cards[index].flipped && !cards[index].matched) {
    cards[index].flipped = true;
    flippedCards.push(index);
    
    if (flippedCards.length === 2) {
      canFlip = false;
      setTimeout(checkMatch, 1000);
    }
  }
}

function checkMatch() {
  let [first, second] = flippedCards;
  if (cards[first].img === cards[second].img) {
    cards[first].matched = true;
    cards[second].matched = true;
    matchedPairs++;
  } else {
    cards[first].flipped = false;
    cards[second].flipped = false;
  }
  flippedCards = [];
  canFlip = true;
  
  if (matchedPairs === pokemonImages.length) {
    alert("¡Lo lograste!");
  }
}

function shuffle(array) {
  let newArray = [...array]; 
  for (let i = newArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}