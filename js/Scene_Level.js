class Scene_Level extends Scene {

  constructor(game, currentLevel) {
    super();

    this.game = game;
    this.game.loadLevel(currentLevel);

    this.rotateLeft = new Button(this, 0, 0, rotateArrows[0].width, rotateArrows[0].height, rotateArrows[0], x => {
      let tile = this.selectedTile();
      if (tile) tile.rotate(1);
    });
    this.rotateRight = new Button(this, 0, 0, rotateArrows[1].width, rotateArrows[1].height, rotateArrows[1], x => {
      let tile = this.selectedTile();
      if (tile) tile.rotate(-1);
    });
    this.rotateLeft.hide();
    this.rotateRight.hide();

    this.hand = new HandView(this, game.hand, images);
    this.grid = new GridView(this, game.grid);

    this.computeDimensions();
    this.hand.onResize();
    this.grid.onResize();
  }

  delete() {
    super.delete();
    GameObject.clear();
  }

  computeDimensions() {
    let handPosition; // 0: bottom, 1: bottom on two lines, 2: sides
    let handWidth, handHeight, handX, handY;
    let gridWidth, gridHeight, gridX, gridY;

    if (height > 3 * width / 5) {
      handWidth = width;
      handHeight = height;
      gridWidth = width;
      gridX = 0;
      gridY = 0;
      handX = 0;
      if (height / width > 1.2) {
        handPosition = 1;
        handHeight = width / 2;
      } else {
        handPosition = 0;
        handHeight = width / 8 + 20;
      }
      gridHeight = height - handHeight;
      handY = gridHeight;
    } else {
      let handSideWidth = height / 4;
      handPosition = 2;
      gridWidth = width - 2 * handSideWidth;
      gridHeight = height;
      handWidth = width;
      handHeight = height;
      handX = handY = gridY = 0;
      gridX = handSideWidth;
    }

    this.grid.setPosition(gridX, gridY);
    this.grid.setDimensions(gridWidth, gridHeight);

    this.hand.setPosition(handX, handY);
    this.hand.setDimensions(handWidth, handHeight);
    this.hand.position = handPosition;
  }

  idle() {
    this.game.checkVictory();

    let tile = this.selectedTile();
    if (tile) {
      let h = this.grid.tileWidth;
      let w = h * this.rotateLeft.image.width / this.rotateLeft.image.height;
      let r = tile.getRect();
      this.rotateLeft.setDimensions(w, h);
      this.rotateRight.setDimensions(w, h);
      this.rotateLeft.setPosition(r.x - w - 20, r.y);
      this.rotateRight.setPosition(r.x + r.w + 20, r.y);
      this.rotateLeft.show();
      this.rotateRight.show();
    } else {
      this.rotateLeft.hide();
      this.rotateRight.hide();
    }
  }

  draw() {
    background("#3f4f14");
    
    for (let x = 0; x < width; x += pattern.width) {
      for (let y = 0; y < width; y+= pattern.height) {
        image(pattern, x, y, pattern.width, pattern.height);
      }
    }

    for (let o of GameObject.all()) {
      o.draw();
    }

    textStyle(BOLD);
    textAlign(LEFT, TOP);
    textSize(64);
    fill(255);
    text("Level " + (this.game.currentLevel + 1), this.grid.x + 20, this.grid.y + 20);

    if (this.game.win) {
      textSize(256);
      textStyle(BOLD);
      fill(255);
      noStroke();
      textAlign(CENTER, CENTER);
      text('You win !', width / 2, this.grid.h / 2);
      noStroke();
    }
    textSize(12);
  }

  onResize() {
    this.computeDimensions();
    this.hand.onResize();
    this.grid.onResize();
  }

  onMousePressed() {
    this.mouseDown = true;

    if (this.game.win) {
      this.nextLevel();
      return;
    }

    for (let o of GameObject.all().reverse()) {
      if (o.onMousePressed()) return;
    }
  };

  onMouseReleased() {
    this.mouseDown = false;

    for (let o of GameObject.all()) {
      if (o.onMouseReleased()) return;
    }
  };

  onMouseMoved() {
    if (!this.hand) return;

    let pointerCursor = false;

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

  onMouseDragged() {
    for (let o of GameObject.all()) {
      o.onMouseDragged();
    }
  };

  unselectAll() {
    for (let t of GameObject.all(TileView)) {
      t.select(false);
    }
  }

  previousLevel() {
    for (let tile of this.hand.tiles) {
      this.hand.resetTile(tile.tile);
    }
    let level = this.game.currentLevel;
    if (level === 0)
      level = this.game.levels.length - 1;
    else
      level--;
    this.game.loadLevel(level);
    this.grid.setGrid(this.game.grid);
  }

  nextLevel() {
    for (let tile of this.hand.tiles) {
      this.hand.resetTile(tile.tile);
    }
    let level = (this.game.currentLevel + 1) % this.game.levels.length;
    this.game.loadLevel(level);
    this.grid.setGrid(this.game.grid);
  }

  draggedTile() {
    return GameObject.all(TileView).filter(x => x.dragged)[0];
  }

  selectedTile() {
    return GameObject.all(TileView).filter(x => x.selected)[0];
  }

  onKeyPressed(keyCode) {
    if (this.game.win) {
      nextLevel();
      return;
    }

    switch (keyCode) {
      case 27:
        setNextScene(new Scene_Levels(this.game.currentLevel));
        break;
      case 37:
        this.previousLevel();
        break;
      case 39:
        this.nextLevel();
        break;
    }
  }
}