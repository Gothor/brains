let _nextScene = null;
let _scene = null;
let _game = null;

let jsonLevels;
let jsonTiles;
let images;
let rotateArrows;
let next;
let previous;
let yinyang, bridge, number, links;
let shade;
let back;

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
  logo = loadImage("img/logo.png");
  yinyang = loadImage("img/yinyang.png");
  kiosk = loadImage("img/kiosk.png");
  bridge = loadImage("img/bridge.png");
  number = loadImage("img/number.png");
  links = [
    loadImage("img/link1.png"),
    loadImage("img/link2.png"),
    loadImage("img/link3.png"),
    loadImage("img/link4.png")
  ];
  shade = loadImage("img/shade.png");
  back = loadImage("img/back.png");
}

function setup() {
  const levels = [];
  for (const level in jsonLevels) {
    levels.push(jsonLevels[level]);
  }
  let tiles = [];
  for (const tile in jsonTiles) {
    tiles.push(jsonTiles[tile]);
  }
  for (let i = 0; i < tiles.length; i++) {
    let jsonTile = tiles[i];
    let tile = new Tile(i);
    for (let connection of jsonTile.connections) {
      let from = Tile.POINTS[connection[0].toUpperCase()];
      let to = Tile.POINTS[connection[1].toUpperCase()];
      let spec = Tile.SPEC[connection[2].toUpperCase()];
      tile.addConnection(from, to, spec);
    }
    tiles[i] = tile;
  }

  createCanvas(innerWidth, innerHeight);

  _game = new Game(levels, tiles);
  _scene = new Scene_Home();
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
