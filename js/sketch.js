let grid;
let hand;

let levels;
let win;
let currentLevel = 0;
let images;
let rotateArrows;

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
  rotateArrows = [
    loadImage("img/rotateNegative.png"),
    loadImage("img/rotatePositive.png"),
  ]
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
    grid.addCondition(new Condition(c.x, c.y, Tile.POINTS[c.point.toUpperCase()], Condition.TYPES[c.type.toUpperCase()], c.arg));
  }
}

function rewrite() {
  for (let level of levels) {
    // Change conditions tiles to empty tiles and compute new grid limits
    let minX = Infinity, maxX = 0;
    let minY = Infinity, maxY = 0;
    for (let y = 0; y < level.grid.length; y++) {
      for (let x = 0; x < level.grid[0].length; x++) {
        if (level.grid[y][x] === 1) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
        if (level.grid[y][x] === 2) {
          level.grid[y][x] = 0;
        }
      }
    }

    // Cut out off limits tiles
    if (maxY < level.grid.length - 1) level.grid.splice(maxY + 1, level.grid.length - maxY);
    if (minY > 0) level.grid.splice(0, minY);

    if (maxX < level.grid[0].length - 1)
      for (let y = 0; y < level.grid.length; y++)
        level.grid[y].splice(maxX + 1, level.grid[y].length - maxX);
    if (minX > 0)
      for (let y = 0; y < level.grid.length; y++)
        level.grid[y].splice(0, minX);

    // Rewrite conditions
    for (let condition of level.conditions) {
      condition.x -= minX;
      condition.y -= minY;
      switch (condition.point) {
        case 'tl':
          condition.point = 'bl';
          condition.y--;
          break;
        case 'tr':
          condition.point = 'br';
          condition.y--;
          break;
        case 'rt':
          condition.point = 'lt';
          condition.x++;
          break;
        case 'rb':
          condition.point = 'lb';
          condition.x++;
          break;
        case 'br':
          condition.point = 'tr';
          condition.y++;
          break;
        case 'bl':
          condition.point = 'tl';
          condition.y++;
          break;
        case 'lb':
          condition.point = 'rb';
          condition.x--;
          break;
        case 'lt':
          condition.point = 'rt';
          condition.x--;
          break;
      }
    }
  }
  console.log(JSON.stringify(levels));
}

function setup() {
  let l = [];
  for (let level in levels) {
    l.push(levels[level]);
  }
  levels = l;

  win = false;

  createCanvas(800, 800);
  document.getElementById('game').appendChild(canvas);

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

  let gridActed = grid.onMousePressed();
  
  if (!selected && !gridActed) {
    unselectAll();
  }
  
  redraw();
}

let pointerCursor = false;

function mouseMoved() {
  if (!hand) return;

  pointerCursor = false;

  for (let i = 0; i < hand.length; i++) {
    let x = (width / 64) * (i + 1) + (width / 8) * i;
    let y = height * 345 / 400;

    if (mouseX >= x && mouseX < x + width / 8 && mouseY >= y && mouseY < y + width / 8) {
      pointerCursor = true;
    }
  }

  grid.onMouseMoved();
  
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