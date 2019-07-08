class Grid {

    constructor(w, h, grid) {
      this.w = w;
      this.h = h;
      this.schema = grid;
      this.tileWidth = 200;
      this.conditions = [];
  
      this.data = Array(this.schema.length);
      for (let i = 0; i < this.schema.length; i++) {
        this.data[i] = Array(this.schema[0].length);
      }
  
      let diffX = this.schema[0].length;
      let diffY = this.schema.length;
      if (this.w / diffX < this.h / diffY) {
        this.tileWidth = (this.w - 200) / diffX;
      } else {
        this.tileWidth = (this.h - 200) / diffY;
      }
      this.x = (this.w - this.tileWidth * diffX) / 2;
      this.y = (this.h - this.tileWidth * diffY) / 2;
    }
  
    setTile(x, y, tile) {
      if (this.schema[y][x] === 1) {
        for (let y = 0; y < this.data.length; y++) {
          for (let x = 0; x < this.data[y].length; x++) {
            if (this.data[y][x] === tile)
              this.data[y][x] = null;
          }
        }
        this.data[y][x] = tile;
      }
    }
  
    addCondition(condition) {
      this.conditions.push(condition);
    }
  
    getCoordinates(mouseX, mouseY) {
      let x = null,
        y = null;
      let _x = Math.floor((mouseX - this.x) / this.tileWidth);
      let _y = Math.floor((mouseY - this.y) / this.tileWidth);
      if (_y >= 0 && _y < this.data.length && _x >= 0 && _x < this.data[0].length && this.schema[_y][_x] === 1) {
        x = _x;
        y = _y;
      }
      return [x, y];
    }
  
    draw() {
      fill("#6b9108");
      noStroke();
      rect(0, 0, this.w, this.h);
      fill(0);
  
      push();
      translate(this.x, this.y);
      for (let y = 0; y < this.data.length; y++) {
        for (let x = 0; x < this.data[y].length; x++) {
          if (this.schema[y][x] === 1) { // Tuile
            push();
            translate(this.tileWidth * x, this.tileWidth * y);
            if (!this.data[y][x]) {
              fill(255, 255, 255, 75);
              stroke(255);
              strokeWeight(3);
              rect(0, 0, this.tileWidth, this.tileWidth);
            } else if (!this.data[y][x].selected) {
              this.data[y][x].draw(this.tileWidth);
            }
            pop();
          }
        }
      }
      for (let y = 0; y < this.data.length; y++) {
        for (let x = 0; x < this.data[y].length; x++) {
          if (this.schema[y][x] === 1 && this.data[y][x] && this.data[y][x].selected) { // Tuile
            push();
            translate(this.tileWidth * x, this.tileWidth * y);
            this.data[y][x].draw(this.tileWidth);
            if (this.data[y][x].selected) {
              let h = this.tileWidth / 3;
              let w = this.tileWidth * rotateArrows[0].width / rotateArrows[0].height / 3;
              image(rotateArrows[0], -w - 20, (this.tileWidth - h) / 2, w, h);
              image(rotateArrows[1], this.tileWidth + 20, (this.tileWidth - h) / 2, w, h);
            }
            pop();
          }
        }
      }
      for (let condition of this.conditions) {
        push();
        translate(this.tileWidth * condition.x, this.tileWidth * condition.y);
        condition.draw(this.tileWidth);
        pop();
      }
      pop();
    }
  
    getPathFrom(x, y, p) {
      let path = [];
      let end;
      let spec;
      let tile;
  
      while (y >= 0 && y < this.data.length && x >= 0 && x < this.data[0].length && this.schema[y][x] === 1 && this.data[y][x]) {
        tile = this.data[y][x];
        path.push({
          tile: this.data[y][x],
          point: p,
          spec: spec ? spec : Tile.SPEC.NONE,
          x,
          y
        });
        let i = tile.infosFrom(p);
        end = i.end;
        spec = i.spec;
        if (end == Tile.POINTS.TL || end == Tile.POINTS.TR) y--; // HAUT
        else if (end == Tile.POINTS.BL || end == Tile.POINTS.BR) y++; // BAS
        else if (end == Tile.POINTS.LT || end == Tile.POINTS.LB) x--; // GAUCHE
        else if (end == Tile.POINTS.RB || end == Tile.POINTS.RT) x++; // DROITE
        if (spec === Tile.SPEC.YINYANG)
          break;
        p = Tile.getFacingPoint(end);
      }
  
      if (tile) {
        path.push({
          tile: tile,
          point: end,
          spec: spec ? spec : Tile.SPEC.NONE,
        });
      }
  
      return path;
    }
  
    checkConditions() {
      for (let c of this.conditions) {
        let path = this.getPathFrom(c.x, c.y, c.point);
        if (path.length === 0) return false;

        if (c.type === Condition.TYPES.KIOSK) {
          let p = path.filter(x => x.spec === Tile.SPEC.KIOSK);
          if (p.length === 0) return false;
        } else if (c.type === Condition.TYPES.YINYANG) {
          let p = path.filter(x => x.spec === Tile.SPEC.YINYANG);
          if (p.length === 0) return false;
        } else if (c.type === Condition.TYPES.NUMBER) {
          if (path.length - 1 != c.arg) return false;
        } else if (c.type === Condition.TYPES.LINK) {
          let end = path[path.length - 1];
          let _x = path[path.length - 2].x;
          let _y = path[path.length - 2].y;

          let found;
          for (let c2 of this.conditions) {
            if (c2.type === Condition.TYPES.LINK && c2.arg === c.arg && c2.x === _x && c2.y === _y && end.point == c2.point) {
              found = true;
              break;
            }
          }
          if (!found) return false;
        } else if (c.type === Condition.TYPES.BRIDGE) {
          let p = path.filter(x => x.spec === Tile.SPEC.BRIDGE);
          if (p.length !== c.arg) return false;
        }
      }
      return true;
    }

    onMousePressed() {
      for (let y = 0; y < this.data.length; y++) {
        for (let x = 0; x < this.data[y].length; x++) {
          if (this.data[y][x] && this.data[y][x].selected) {
            let h = this.tileWidth / 3;
            let w = this.tileWidth * rotateArrows[0].width / rotateArrows[0].height / 3;
            let x2 = this.x + this.tileWidth * x;
            let y2 = this.y + this.tileWidth * y;

            if (mouseX >= x2 - w - 20 && mouseX < x2 - 20 && mouseY >= y2 + (this.tileWidth - h) / 2 && mouseY < y2 + h + (this.tileWidth - h) / 2) {
              this.data[y][x].rotate(1);
              return true;
            } else if (mouseX >= x2 + this.tileWidth + 20 && mouseX < x2 + this.tileWidth + w + 20 && mouseY >= y2 + (this.tileWidth - h) / 2 && mouseY < y2 + h + (this.tileWidth - h) / 2) {
              this.data[y][x].rotate(-1);
              return true;
            }
          }
        }
      }

      let [x, y] = grid.getCoordinates(mouseX, mouseY);
      if (x !== null && y !== null) {
        if (previouslySelected() != null) {
          for (let t of hand) {
            if (t.selected) {
              grid.setTile(x, y, t);
              return true
            }
          }
        } else {
          if (grid.data[y][x])
            grid.data[y][x].select();
            return true;
        }
      }

      return false;
    }

    onMouseMoved() {
      let [x, y] = this.getCoordinates(mouseX, mouseY);
      if (x !== null && y !== null && (previouslySelected() || this.data[y][x])) {
        pointerCursor = true;
      }

      for (let y = 0; y < this.data.length; y++) {
        for (let x = 0; x < this.data[y].length; x++) {
          if (this.data[y][x] && this.data[y][x].selected) {
            let h = this.tileWidth / 3;
            let w = this.tileWidth * rotateArrows[0].width / rotateArrows[0].height / 3;
            let x2 = this.x + this.tileWidth * x;
            let y2 = this.y + this.tileWidth * y;

            if (mouseX >= x2 - w - 20 && mouseX < x2 - 20 && mouseY >= y2 + (this.tileWidth - h) / 2 && mouseY < y2 + h + (this.tileWidth - h) / 2) {
              pointerCursor = true;
              return;
            } else if (mouseX >= x2 + this.tileWidth + 20 && mouseX < x2 + this.tileWidth + w + 20 && mouseY >= y2 + (this.tileWidth - h) / 2 && mouseY < y2 + h + (this.tileWidth - h) / 2) {
              pointerCursor = true;
              return;
            }
          }
        }
      }
    }
  
  }