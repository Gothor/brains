let _nextScene = null;
let _scene = null;
let _game = null;

let jsonLevels;
let jsonTiles;
let images;
let rotateArrows;
let next;
let previous;

function preload() {
  jsonLevels = loadJSON("assets/levels.json");
  jsonTiles = loadJSON("assets/tiles.json");
  images = [
    loadImage("img/tile1.png"),
    loadImage("img/tile2.png"),
    loadImage("img/tile3.png"),
    loadImage("img/tile4.png"),
    loadImage("img/tile5.png"),
    loadImage("img/tile6.png"),
    loadImage("img/tile7.png"),
  ];
  rotateArrows = [
    loadImage("img/rotateNegative.png"),
    loadImage("img/rotatePositive.png"),
  ];
  torii = loadImage("img/torii.png");
  doneTorii = loadImage("img/donetorii.png");
  next = loadImage("img/next.png");
  previous = loadImage("img/previous.png");
  pattern = loadImage("img/background.png");
  gradient = loadImage("img/bgGradient.png");
}

function setup() {
  let levels = [];
  for (let level in jsonLevels) {
    levels.push(jsonLevels[level]);
  }
  let tiles = [];
  for (let tile in jsonTiles) {
    tiles.push(jsonTiles[tile]);
  }
  for (let i = 0; i < tiles.length; i++) {
    let jsonTile = tiles[i];
    let tile = new Tile(0, 0, images[i]);
    for (let connection of jsonTile.connections) {
      let from = Tile.POINTS[connection[0].toUpperCase()];
      let to = Tile.POINTS[connection[1].toUpperCase()];
      let spec = Tile.SPEC[connection[2].toUpperCase()];
      tile.addConnection(from, to, spec);
    }
    tiles[i] = tile;
  }

  createCanvas(innerWidth, innerHeight);

  let currentLevel = localStorage.getItem("currentLevel");
  if (currentLevel === null) {
    currentLevel = 0;
  } else {
    currentLevel = parseInt(currentLevel);
  }

  _game = new Game(levels, tiles);
  _scene = new Scene_Levels(currentLevel);
}

function draw() {
  clear();

  if (_scene) {
    if (_scene.idle)
      _scene.idle();
    if (_scene.draw)
      _scene.draw();
  }

  checkNextScene();
}
