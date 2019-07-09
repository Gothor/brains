let grid;
let hand;

let levels;
let win;
let currentLevel = 0;
let images;
let rotateArrows;
let rotateLeft;
let rotateRight;

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
  localStorage.setItem("currentLevel", n);
  rotateLeft.hide();
  rotateRight.hide();

  if (grid) grid.delete();

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

  for (let tile of GameObject.all(Tile)) hand.resetTile(tile);

  let h = grid.tileWidth;
  let w = grid.tileWidth * rotateLeft.image.width / rotateLeft.image.height;
  rotateLeft.w = w;
  rotateLeft.h = h;
  rotateRight.w = w;
  rotateRight.h = h;
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

  let tile = new Tile(0, 0, images[0]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.RB);
  tile.addConnection(Tile.POINTS.TR, Tile.POINTS.BR, Tile.SPEC.BRIDGE);
  tile.addConnection(Tile.POINTS.RT, Tile.POINTS.LT, Tile.SPEC.BRIDGE);
  tile.addConnection(Tile.POINTS.BL, Tile.POINTS.LB);

  tile = new Tile(0, 0, images[1]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.RB);
  tile.addConnection(Tile.POINTS.TR, Tile.POINTS.LT);
  tile.addConnection(Tile.POINTS.RT, Tile.POINTS.BL);
  tile.addConnection(Tile.POINTS.BR, Tile.POINTS.LB);

  tile = new Tile(0, 0, images[2]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.RB, Tile.SPEC.KIOSK);
  tile.addConnection(Tile.POINTS.TR, Tile.POINTS.RT);
  tile.addConnection(Tile.POINTS.BR, Tile.POINTS.LB);
  tile.addConnection(Tile.POINTS.BL, Tile.POINTS.LT);

  tile = new Tile(0, 0, images[3]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.TR);
  tile.addConnection(Tile.POINTS.RT, Tile.POINTS.LT, Tile.SPEC.BRIDGE);
  tile.addConnection(Tile.POINTS.RB, Tile.POINTS.BR);
  tile.addConnection(Tile.POINTS.BL, Tile.POINTS.LB);

  tile = new Tile(0, 0, images[4]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.END, Tile.SPEC.YINYANG);
  tile.addConnection(Tile.POINTS.TR, Tile.POINTS.LT);
  tile.addConnection(Tile.POINTS.RT, Tile.POINTS.RB);
  tile.addConnection(Tile.POINTS.BR, Tile.POINTS.END, Tile.SPEC.YINYANG);
  tile.addConnection(Tile.POINTS.BL, Tile.POINTS.LB);

  tile = new Tile(0, 0, images[5]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.TR);
  tile.addConnection(Tile.POINTS.RT, Tile.POINTS.BL);
  tile.addConnection(Tile.POINTS.RB, Tile.POINTS.LB, Tile.SPEC.BRIDGE);
  tile.addConnection(Tile.POINTS.BR, Tile.POINTS.LT);

  tile = new Tile(0, 0, images[6]);
  tile.addConnection(Tile.POINTS.TL, Tile.POINTS.LB);
  tile.addConnection(Tile.POINTS.TR, Tile.POINTS.RB);
  tile.addConnection(Tile.POINTS.RT, Tile.POINTS.LT, Tile.SPEC.BRIDGE);
  tile.addConnection(Tile.POINTS.BR, Tile.POINTS.BL);

  hand = new Hand(0, height - 150, 7);
  hand.add(GameObject.all(Tile));

  rotateLeft = new Button(0, 0, rotateArrows[0].width, rotateArrows[0].height, rotateArrows[0], x => {
    let tile = selectedTile();
    if (tile) tile.rotate(1);
  });
  rotateRight = new Button(0, 0, rotateArrows[1].width, rotateArrows[1].height, rotateArrows[1], x => {
    let tile = selectedTile();
    if (tile) tile.rotate(-1);
  });
  rotateLeft.hide();
  rotateRight.hide();

  currentLevel = localStorage.getItem("currentLevel");
  if (currentLevel === null) {
    currentLevel = 0;
  } else {
    currentLevel = parseInt(currentLevel);
  }
  loadLevel(currentLevel);
}

function draw() {
  win = grid.checkConditions();

  background(220);

  for (let o of GameObject.all()) {
    o.draw();
  }

  textAlign(LEFT, TOP);
  textSize(32);
  text("Level " + levels[currentLevel].id, 20, 20);
  textSize(12);
  text("Press ← or → to change level", 15, grid.h + 15);

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
  for (let t of GameObject.all(Tile)) {
    if (t.selected) return t;
  }
  return null;
}

function selectedTile() {
  let tiles = GameObject.all(Tile).filter(x => x.selected);
  if (tiles.length === 0) return null;
  return tiles[0];
}

function draggedTile() {
  let tiles = GameObject.all(Tile).filter(x => x.dragged);
  if (tiles.length === 0) return null;
  return tiles[0];
}

let pointerCursor = false;
let mousedown = false;

function updateMouseInput(e) {
  mouseX = Math.floor(e.touches.item(0).clientX - canvas.offsetLeft);
  mouseY = Math.floor(e.touches.item(0).clientY - canvas.offsetTop);
}

let mouseDownHandler = function(e) {
  mousedown = true;

  if (win) {
    nextLevel();
    return;
  }
  
  for (let o of GameObject.all().reverse()) {
    if (o.onMousePressed()) return;
  }
};

let mouseUpHandler = function(e) {
  mousedown = false;

  for (let o of GameObject.all()) {
    if (o.onMouseReleased()) return;
  }
};

let mouseMoveHandler = function(e) {
  if (mousedown) return;
  if (!hand) return;

  pointerCursor = false;

  let objects = GameObject.all().reverse();
  let hovered = false;
  for (let o of objects) {
    if (!hovered) hovered = o.onMouseMoved();
    else o.hover = false; 
  }
  
  if (pointerCursor) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "auto";
  }
};

let mouseDragHandler = function(e) {
  if (!mousedown) return;

  for (let o of GameObject.all()) {
    o.onMouseDragged();
  }
};

let touchStartHandler = function(e) {
  updateMouseInput(e);
  mouseMoveHandler();
  mouseDownHandler();
};

let touchEndHandler = function(e) {
  mouseUpHandler();
  mouseX = -Infinity;
  mouseY = -Infinity;
  mouseMoveHandler();
};

let touchDragHandler = function(e) {
  updateMouseInput(e);
  if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
    e.preventDefault();
  }
  mouseDragHandler();
};

let mobilecheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

if (mobilecheck()) {
  document.addEventListener("touchstart", touchStartHandler);
  document.addEventListener("touchend", touchEndHandler);
  document.addEventListener("touchmove", touchDragHandler, {passive: false});
} else {
  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mousedown", mouseDownHandler);
  document.addEventListener("mouseup", mouseUpHandler);
  document.addEventListener("mousemove", mouseDragHandler);
}

function unselectAll() {
  for (let t of GameObject.all(Tile)) {
    t.select(false);
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
    nextLevel();
    return;
  }

  switch (keyCode) {
    case 37:
      previousLevel();
      break;
    case 39:
      nextLevel();
      break;
  }
}