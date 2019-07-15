class GridView extends GameObject {

    constructor(parent, grid) {
      super(parent, 0, 0, 0, 0, 0);

      this.tileWidth = 0;
      this.placeholder = null;
      this.grid = null;
      this.setGrid(grid);
    }

    setGrid(grid) {
      this.grid = grid;
      this.onResize();
    }

    onResize() {
      if (!this.grid.schema) return;

      let diffX = this.grid.schema[0].length;
      let diffY = this.grid.schema.length;
      if (this.w / diffX < this.h / diffY) {
        this.tileWidth = (this.w - 300) / diffX;
      } else {
        this.tileWidth = (this.h - 300) / diffY;
      }
      this.gridX = (this.w - this.tileWidth * diffX) / 2;
      this.gridY = (this.h - this.tileWidth * diffY) / 2;

      for (let y = 0; y < this.grid.data.length; y++) {
        for (let x = 0; x < this.grid.data[y].length; x++) {
          if (!this.grid.data[y][x]) continue;
          let tile = GameObject.all(TileView).filter(t => { return t.tile === this.grid.data[y][x] })[0];
          if (tile) {
            tile.w = this.tileWidth;
            tile.setPosition(this.x + this.gridX + this.tileWidth * x + this.tileWidth / 2, this.y + this.gridY + this.tileWidth * y + this.tileWidth / 2, 1);
          }
        }
      }
    }
  
    setTile(x, y, tile) {
      if (this.grid.setTile(x, y, tile.tile)) {
        tile.setPosition(this.x + this.gridX + this.tileWidth * x + this.tileWidth / 2, this.y + this.gridY + this.tileWidth * y + this.tileWidth / 2, 1);
        tile.setDimensions(this.tileWidth, this.tileWidth);
      }
    }
  
    draw() {
      push();
      translate(this.x, this.y);
      fill("#55691e");
      noStroke();
      rect(0, 0, this.w, this.h);
      image(gradient, 0, 0, this.w, this.h);

      for (let x = 0; x < this.w; x += pattern.width) {
        for (let y = 0; y < this.h; y+= pattern.height) {
          if (x + pattern.width < this.w && y + pattern.height < this.h) {
            image(pattern, x, y, pattern.width, pattern.height);
          } else {
            let w = Math.min(pattern.width, this.w - this.x);
            let h = Math.min(pattern.height, this.h - this.y);
            image(pattern, x, y, w, h, 0, 0, w, h);
          }
        }
      }

      for (let x = 0; x < 20; x++) {
        stroke(0, map(x, 0, 19, 150, 0));
        if (this._parent.hand.position === 2) {
          line(x, 0, x, this.h - 1);
          line(this.w - x - 1, 0, this.w - x - 1, this.h - 1);
        } else {
          line(0, this.h - x - 1, this.w - 1, this.h - x - 1);
        }
      }

      fill(0);
  
      push();
      translate(this.gridX, this.gridY);
      // Draw empty tiles
      for (let y = 0; y < this.grid.data.length; y++) {
        for (let x = 0; x < this.grid.data[y].length; x++) {
          if (this.grid.schema[y][x] === 1 && (!this.grid.data[y][x] || this.placeholder && this.placeholder.x === x && this.placeholder.y === y)) {
            push();
            translate(this.tileWidth * x, this.tileWidth * y);
            fill(255, 255, 255, 75);
            stroke(255);
            strokeWeight(3);
            rect(0, 0, this.tileWidth, this.tileWidth);
            pop();
          }
        }
      }

      // Draw placeholder
      if (this.placeholder) { // Draw placeholder
        push();
        translate(this.tileWidth * this.placeholder.x, this.tileWidth * this.placeholder.y);
        translate(this.tileWidth / 2, this.tileWidth / 2);
        rotate(this.placeholder.tile.rotated * HALF_PI);
        translate(-this.tileWidth / 2, -this.tileWidth / 2);
        tint(255, 125);
        image(this.placeholder.tile.image, 0, 0, this.tileWidth, this.tileWidth);
        pop();
      }

      // Draw conditions
      textStyle(BOLD);
      for (let condition of this.grid.conditions) {
        push();
        translate(this.tileWidth * condition.x, this.tileWidth * condition.y);
        condition.draw(this.tileWidth);
        pop();
      }
      pop();
      pop();
    }

    setPlaceholder(x, y, tile) {
      this.placeholder = {x, y, tile};
    }
  
    getCoordinates(mouseX, mouseY) {
      let x = null,
        y = null;
      let _x = Math.floor((mouseX - this.gridX - this.x) / this.tileWidth);
      let _y = Math.floor((mouseY - this.gridY - this.y) / this.tileWidth);
      if (_y >= 0 && _y < this.grid.data.length && _x >= 0 && _x < this.grid.data[0].length && this.grid.schema[_y][_x] === 1) {
        x = _x;
        y = _y;
      }
      return [x, y];
    }

    remove(tile) {
      this.grid.remove(tile);
    }

    onMousePressed() {
      _scene.unselectAll();

      let [x, y] = this.getCoordinates(mouseX, mouseY);
      this.selected = {x, y};

      let tile = _scene.draggedTile();
      if (tile) {
        this.remove(tile);
        // tile.w = hand.tileWidth;
      }

      return false;
    }

    onMouseReleased() {
      let tile = _scene.draggedTile();
      if (!tile) return;

      this.placeholder = null;

      let [x, y] = this.getCoordinates(tile.x, tile.y);
      if (x !== null && y !== null) {
        this.setTile(x, y, tile);

        if (this.selected.x === x && this.selected.y === y) {
          tile.select();
        }

        return;
      }
      this.remove(tile.tile);
      this._parent.hand.resetTile(tile.tile);
    }

    reset() {
      for (let tile of hand.tiles) {
        // hand.resetTile(tile);
      }
    }

    onMouseDragged() {
      let tile = _scene.draggedTile();
      if (!tile) return;

      let [x, y] = this.getCoordinates(tile.x, tile.y);
      if (x !== null && y !== null) {
        this.setPlaceholder(x, y, tile);
      } else {
        this.placeholder = null;
      }
    }
  
  }