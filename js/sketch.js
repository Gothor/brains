let grid;
let hand;

let levels;
let win;
let currentLevel = 36;
let images;

function preload() {
  levels = loadJSON("assets/levels.json");
  images = [
    loadImage("img/tile1.png"),
    loadImage("img/tile2.png"),
    loadImage("img/tile3.png"),
    loadImage("img/tile4.png"),
    loadImage("img/tile5.png"),
    loadImage("img/tile6.png"),
    loadImage("img/tile7.png"),
  ];
}

function loadLevel(n) {
  grid = new Grid(width, height - 150, levels[n].grid);

  const types = {
    kiosk: Condition.TYPES.KIOSK,
    yinyang: Condition.TYPES.YINYANG,
    number: Condition.TYPES.NUMBER,
    link: Condition.TYPES.LINK,
    bridge: Condition.TYPES.BRIDGE
  };
  const points = {
    tl: Tile.POINTS.TL,
    tr: Tile.POINTS.TR,
    rt: Tile.POINTS.RT,
    rb: Tile.POINTS.RB,
    br: Tile.POINTS.BR,
    bl: Tile.POINTS.BL,
    lb: Tile.POINTS.LB,
    lt: Tile.POINTS.LT,
  };
  for (let c of levels[n].conditions) {
    let condition;
    if (grid.data[c.y][c.x]) {
      condition = grid.data[c.y][c.x];
    } else {
      condition = new Condition();
    }

    condition.addCondition(types[c.type], points[c.point], c.arg);
    grid.setCondition(c.x, c.y, condition);
  }
}

function setup() {
  let l = [];
  for (let level in levels) {
    l.push(levels[level]);
  }
  levels = l;

  win = false;

  createCanvas(800, 800);

  hand = [];

  tiles = [];
  let tile = new Tile(images[0]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.RB);
  tile.addConnection(Tile.POINTS.TR, Tile.POINTS.BR, Tile.SPEC.BRIDGE);
  tile.addConnection(Tile.POINTS.RT, Tile.POINTS.LT, Tile.SPEC.BRIDGE);
  tile.addConnection(Tile.POINTS.BL, Tile.POINTS.LB);
  hand.push(tile);

  tile = new Tile(images[1]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.RB);
  tile.addConnection(Tile.POINTS.TR, Tile.POINTS.LT);
  tile.addConnection(Tile.POINTS.RT, Tile.POINTS.BL);
  tile.addConnection(Tile.POINTS.BR, Tile.POINTS.LB);
  hand.push(tile);

  tile = new Tile(images[2]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.RB, Tile.SPEC.KIOSK);
  tile.addConnection(Tile.POINTS.TR, Tile.POINTS.RT);
  tile.addConnection(Tile.POINTS.BR, Tile.POINTS.LB);
  tile.addConnection(Tile.POINTS.BL, Tile.POINTS.LT);
  hand.push(tile);

  tile = new Tile(images[3]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.TR);
  tile.addConnection(Tile.POINTS.RT, Tile.POINTS.LT, Tile.SPEC.BRIDGE);
  tile.addConnection(Tile.POINTS.RB, Tile.POINTS.BR);
  tile.addConnection(Tile.POINTS.BL, Tile.POINTS.LB);
  hand.push(tile);

  tile = new Tile(images[4]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.END, Tile.SPEC.YINYANG);
  tile.addConnection(Tile.POINTS.TR, Tile.POINTS.LT);
  tile.addConnection(Tile.POINTS.RT, Tile.POINTS.RB);
  tile.addConnection(Tile.POINTS.BR, Tile.POINTS.END, Tile.SPEC.YINYANG);
  tile.addConnection(Tile.POINTS.BL, Tile.POINTS.LB);
  hand.push(tile);

  tile = new Tile(images[5]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.TR);
  tile.addConnection(Tile.POINTS.RT, Tile.POINTS.BL);
  tile.addConnection(Tile.POINTS.RB, Tile.POINTS.LB, Tile.SPEC.BRIDGE);
  tile.addConnection(Tile.POINTS.BR, Tile.POINTS.LT);
  hand.push(tile);

  tile = new Tile(images[6]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.LB);
  tile.addConnection(Tile.POINTS.TR, Tile.POINTS.RB);
  tile.addConnection(Tile.POINTS.RT, Tile.POINTS.LT, Tile.SPEC.BRIDGE);
  tile.addConnection(Tile.POINTS.BR, Tile.POINTS.BL);
  hand.push(tile);

  loadLevel(currentLevel);
}

function draw() {
  win = grid.checkConditions();

  background(220);

  grid.draw();

  for (let i = 0; i < hand.length; i++) {
    push();
    translate((width / 64) * (i + 1) + (width / 8) * i, height * 345 / 400);
    hand[i].draw(width / 8);
    pop();
  }

  textAlign(LEFT, TOP);
  textSize(32);
  text("Level " + levels[currentLevel].id, 20, 20);
  textSize(12);
  text("Press R to rotate selected tile     Press ← or → to change level", 15, grid.h + 15);

  if (win) {
    textSize(128);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    text('You win !', width / 2, grid.h / 2);
    noStroke();
  }
  textSize(12);
}

function previouslySelected() {
  for (let t of hand) {
    if (t.selected) return t;
  }
  return null;
}

function mousePressed() {
  if (win) {
    nextLevel();
    return;
  }

  let selected;
  
  for (let i = 0; i < hand.length; i++) {
    let x = (width / 64) * (i + 1) + (width / 8) * i;
    let y = height * 345 / 400;

    if (mouseX >= x && mouseX < x + width / 8 && mouseY >= y && mouseY < y + width / 8)
      selected = hand[i];
  }
  if (selected) {
    unselectAll();
    selected.select();
  }

  let [x, y] = grid.getCoordinates(mouseX, mouseY);
  if (x !== null && y !== null) {
    if (previouslySelected() != null) {
      for (let t of hand) {
        if (t.selected) {
          grid.setTile(x, y, t);
          break;
        }
      }
    } else {
      if (grid.data[y][x])
        grid.data[y][x].select();
    }
  }
  if (!selected && (x === null || y === null)) {
    unselectAll();
  }
  
  redraw();
}

function mouseMoved() {
  let pointerCursor = false;
  
  for (let i = 0; i < hand.length; i++) {
    let x = (width / 64) * (i + 1) + (width / 8) * i;
    let y = height * 345 / 400;

    if (mouseX >= x && mouseX < x + width / 8 && mouseY >= y && mouseY < y + width / 8) {
      pointerCursor = true;
    }
  }
  
  if (!pointerCursor) {
  let [x, y] = grid.getCoordinates(mouseX, mouseY);
  if (x !== null && y !== null && (previouslySelected() || grid.data[y][x])) {
    pointerCursor = true;
  }
  }
  
  if (pointerCursor) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "auto";
  }
}

function unselectAll() {
  for (let t of hand) {
    t.select(false);
  }
}

function rotateSelectedTile() {
  for (let t of hand) {
    if (t.selected) {
      t.rotate(1);
      break;
    }
  }
}

function previousLevel() {
  if (currentLevel === 0) currentLevel = levels.length - 1;
  else currentLevel--;
  loadLevel(currentLevel);
}

function nextLevel() {
  currentLevel = (currentLevel + 1) % levels.length;
  loadLevel(currentLevel);
}

function keyPressed() {
  if (win) {
    nextLevel()
    return;
  }

  switch (keyCode) {
    case 82: // Touche R
      rotateSelectedTile();
      break;
    case 37:
      previousLevel();
      break;
    case 39:
      nextLevel();
      break;
  }
}