let pokemonImages = [];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;

function preload() {
  fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
    .then(response => response.json())
    .then(data => {
      let promises = data.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
      Promise.all(promises).then(pokemons => {
        pokemonImages = pokemons.map(p => p.sprites.front_default);
        setupGame();
      });
    });
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
  createCanvas(400, 400);
}

function draw() {
  background(220);
  for (let i = 0; i < cards.length; i++) {
    let x = (i % 5) * 80;
    let y = floor(i / 5) * 100;
    if (cards[i].flipped || cards[i].matched) {
      loadImage(cards[i].img, img => image(img, x, y, 80, 100));
    } else {
      fill(100);
      rect(x, y, 80, 100);
    }
  }
}

function mousePressed() {
  if (!canFlip) return;
  
  let col = floor(mouseX / 80);
  let row = floor(mouseY / 100);
  let index = row * 5 + col;
  
  if (index < cards.length && !cards[index].flipped && !cards[index].matched) {
    cards[index].flipped = true;
    flippedCards.push(index);
  }
  
  if (flippedCards.length === 2) {
    canFlip = false;
    setTimeout(checkMatch, 1000);
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
    alert("awebo");
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
