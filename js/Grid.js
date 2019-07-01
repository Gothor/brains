class Grid {

    constructor(w, h, grid) {
      this.w = w;
      this.h = h;
      this.schema = grid;
      this.tileWidth = 200;
  
      this.data = Array(this.schema.length);
      for (let i = 0; i < this.schema.length; i++) {
        this.data[i] = Array(this.schema[0].length);
      }
  
      let maxX = 0,
        minX = this.schema[0].length - 1;
      let maxY = 0,
        minY = this.schema.length - 1;
  
      for (let y = 0; y < this.schema.length; y++) {
        for (let x = 0; x < this.schema[0].length; x++) {
          if (this.schema[y][x] === 1) {
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
          }
        }
      }
  
      let diffX = maxX - minX + 1;
      let diffY = maxY - minY + 1;
      if (this.w / diffX < this.h / diffY) {
        this.tileWidth = (this.w - 200) / diffX;
      } else {
        this.tileWidth = (this.h - 200) / diffY;
      }
      this.x = (this.w - this.tileWidth * diffX) / 2;
      this.y = (this.h - this.tileWidth * diffY) / 2;
      this.minX = minX;
      this.minY = minY;
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
  
    setCondition(x, y, condition) {
      if (this.schema[y][x] !== 2) return;
  
      this.data[y][x] = condition;
    }
  
    getCoordinates(mouseX, mouseY) {
      let x = null,
        y = null;
      let _x = Math.floor((mouseX - this.x) / this.tileWidth) + this.minX;
      let _y = Math.floor((mouseY - this.y) / this.tileWidth) + this.minY;
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
            translate(this.tileWidth * (x - this.minX), this.tileWidth * (y - this.minY));
            if (!this.data[y][x]) {
              fill(255, 255, 255, 75);
              stroke(255);
              strokeWeight(3);
              rect(0, 0, this.tileWidth, this.tileWidth);
            } else {
              this.data[y][x].draw(this.tileWidth);
            }
            pop();
          } else if (this.schema[y][x] === 2) { // Condition
            push();
            translate(this.tileWidth * (x - this.minX), this.tileWidth * (y - this.minY));
            this.data[y][x].draw(this.tileWidth);
            pop();
          }
        }
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
      for (let y = 0; y < this.data.length; y++) {
        for (let x = 0; x < this.data[y].length; x++) {
          if (this.schema[y][x] !== 2) continue;
          for (let c of this.data[y][x].conditions) {
            let _x = x,
              _y = y;
            if (c.p == Tile.POINTS.TL || c.p == Tile.POINTS.TR) _y--; // HAUT
            else if (c.p == Tile.POINTS.BL || c.p == Tile.POINTS.BR) _y++; // BAS
            else if (c.p == Tile.POINTS.LT || c.p == Tile.POINTS.LB) _x--; // GAUCHE
            else if (c.p == Tile.POINTS.RB || c.p == Tile.POINTS.RT) _x++; // DROITE
            let path = this.getPathFrom(_x, _y, Tile.getFacingPoint(c.p));
            if (path.length === 0) return false;
  
            if (c.c === Condition.TYPES.KIOSK) {
              let p = path.filter(x => x.spec === Tile.SPEC.KIOSK);
              if (p.length === 0) return false;
            } else if (c.c === Condition.TYPES.YINYANG) {
              let p = path.filter(x => x.spec === Tile.SPEC.YINYANG);
              if (p.length === 0) return false;
            } else if (c.c === Condition.TYPES.NUMBER) {
              if (path.length - 1 != c.arg) return false;
            } else if (c.c === Condition.TYPES.LINK) {
              let end = path[path.length - 1];
              _x = path[path.length - 2].x;
              _y = path[path.length - 2].y;
              let facing = Tile.getFacingPoint(end.point);
  
              if (end.point == Tile.POINTS.TL || end.point == Tile.POINTS.TR) _y--; // HAUT
              else if (end.point == Tile.POINTS.BL || end.point == Tile.POINTS.BR) _y++; // BAS
              else if (end.point == Tile.POINTS.LT || end.point == Tile.POINTS.LB) _x--; // GAUCHE
              else if (end.point == Tile.POINTS.RB || end.point == Tile.POINTS.RT) _x++; // DROITE
  
              let found = false;
              if (_y >= 0 && _y < this.data.length && _x >= 0 && _x < this.data[0].length && this.schema[_y][_x] === 2 && this.data[_y][_x]) {
                for (let c2 of this.data[_y][_x].conditions) {
                  if (c2.p === facing && c2.c === c.c && c2.arg === c.arg) {
                    found = true;
                  }
                }
                if (!found) return false;
              } else {
                return false;
              }
            } else if (c.c === Condition.TYPES.BRIDGE) {
              let p = path.filter(x => x.spec === Tile.SPEC.BRIDGE);
              if (p.length !== c.arg) return false;
            }
          }
        }
      }
      return true;
    }
  
  }