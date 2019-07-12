class Grid {

    constructor(level) {
      this.schema = null;
      this.data = null;
      this.conditions = [];
  
      this.setSchema(level.grid);
      
      for (let c of level.conditions) {
        this.addCondition(new Condition(c.x, c.y, Tile.POINTS[c.point.toUpperCase()], Condition.TYPES[c.type.toUpperCase()], c.arg));
      }
    }

    setSchema(schema) {
      this.schema = schema;

      this.data = Array(this.schema.length);
      for (let i = 0; i < this.schema.length; i++) {
        this.data[i] = Array(this.schema[0].length);
      }
    }

    isValid(x, y) {
      return this.schema[y][x] === 1;
    }
  
    setTile(x, y, tile) {
      if (this.schema[y][x] !== 1) return false;

      this.remove(tile);
      if (this.data[y][x]) _scene.hand.resetTile(this.data[y][x]);
      this.data[y][x] = tile;
      return true;
    }

    contains(tile) {
      for (let y = 0; y < this.data.length; y++) {
        for (let x = 0; x < this.data[y].length; x++) {
          if (this.data[y][x] && this.data[y][x] === tile)
            return true;
        }
      }
      return false;
    }

    remove(tile) {
      for (let y = 0; y < this.data.length; y++) {
        for (let x = 0; x < this.data[y].length; x++) {
          if (this.data[y][x] && this.data[y][x] === tile) {
            this.data[y][x] = null;
            return;
          }
        }
      }
    }
  
    addCondition(condition) {
      this.conditions.push(condition);
    }

    getPositionOf(tile) {
      let x = null, y = null;
      if (tile) {
        for (let _y = 0; _y < this.data.length; _y++) {
          for (let _x = 0; _x < this.data.length; _x++) {
            if (this.data[_y][_x] === tile) {
              return {x: _x, y: _y};
            }
          }
        }
      }
      return {x, y};
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

    clear() {
      for (let y = 0; y < this.data.length; y++) {
        for (let x = 0; x < this.data[y].length; x++) {
          if (this.schema[y][x] === 1) {
            this.data[y][x] = null;
          }
        }
      }
    }
  
  }