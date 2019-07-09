class Tile extends GameObject {

  constructor(x, y, image) {
    super(x, y, 1, image.width, image.height);

    this.connections = [];
    this.selected = false;
    this.image = image;
    this.rotated = 0;
    this.hover = false;
    this.lastHoverEvent = 0;
    this.dragged = false;
  }

  addConnection(a, b, spec) {
    this.connections.push([a, b, spec ? spec : Tile.SPEC.NONE]);
  }

  draw() {
    if (!this.image) return;
    let [x, y] = grid.getCoordinates(this.x, this.y);
    if (grid.contains(this) && grid.placeholder && x === grid.placeholder.x && y === grid.placeholder.y) return;
    
    let d = Date.now() - this.lastHoverEvent;
    d = constrain(d, 0, 100);
    if (this.hover)
      d = map(d, 0, 100, 1.0, 1.1);
    else
      d = map(d, 0, 100, 1.1, 1.0);

    push();
    translate(this.x, this.y);
    scale(d, d);
    rotate(this.rotated * HALF_PI);
    image(this.image, -this.w / 2, -this.w / 2, this.w, this.w);
    if (this.selected) {
      strokeWeight(4);
      stroke(0, 200, 0);
      noFill();
      rect(-this.w / 2, -this.w / 2, this.w, this.w);
    }
    pop();

    return;
  }
  
  static getCurveFor(p) {
    switch(p) {
      case Tile.POINTS.LT:
      case Tile.POINTS.TL:
        return {x: 1/3, y: 1/3};
      case Tile.POINTS.TR:
      case Tile.POINTS.RT:
        return {x: 2/3, y: 1/3};
      case Tile.POINTS.LB:
      case Tile.POINTS.BL:
        return {x: 1/3, y: 2/3};
      case Tile.POINTS.BR:
      case Tile.POINTS.RB:
        return {x: 2/3, y: 2/3};
    }
    return {x: 0.5, y: 0.5};
  }
  
  select(b) {
    if (b === undefined) {
      this.selected = true;
    } else {
      this.selected = !!b;
    }
  }

  infosFrom(p) {
    for (let c of this.connections) {
      if (p == c[0]) return {end: c[1], spec: c[2]};
      if (p == c[1]) return {end: c[0], spec: c[2]};
    }
  }

  getCoordinates(p, w) {
    switch (p) {
      case Tile.POINTS.TL:
        return {
          x: w / 3, y: 0
        };
      case Tile.POINTS.TR:
        return {
          x: 2 * w / 3, y: 0
        };

      case Tile.POINTS.RT:
        return {
          x: w, y: w / 3
        };
      case Tile.POINTS.RB:
        return {
          x: w, y: 2 * w / 3
        };

      case Tile.POINTS.BR:
        return {
          x: 2 * w / 3, y: w
        };
      case Tile.POINTS.BL:
        return {
          x: w / 3, y: w
        };

      case Tile.POINTS.LB:
        return {
          x: 0, y: 2 * w / 3
        };
      case Tile.POINTS.LT:
        return {
          x: 0, y: w / 3
        };
      case Tile.POINTS.END:
        return {
          x: w / 2, y: w / 2
        }
    }
    return {
      x: null,
      y: null
    };
  }

  get rect() {
    return [
      this.x,
      this.y,
      this.w,
      this.h
    ];
  }

  rotate(n) {
    this.rotated += n;
    
    while (n < 0) {
      n += 4;
    }
    n %= 4;

    for (let c of this.connections) {
      c[0] = (c[0] + 2 * n) % 8;
      c[1] = (c[1] + 2 * n) % 8;
    }
  }

  onMousePressed() {
    let r = this.getRect();
    this.hover = mouseX >= r.x && mouseX < r.x + r.w && mouseY >= r.y && mouseY < r.y + r.h;
    if (this.hover) {
      this.dragged = true;
      this.z = 1.5;
      this.origX = this.x;
      this.origY = this.y;
      this.origMouseX = mouseX;
      this.origMouseY = mouseY;
    }

    return false;
  }

  onMouseDragged() {
    if (!this.dragged) return;

    this.x = this.origX + (mouseX - this.origMouseX);
    this.y = this.origY + (mouseY - this.origMouseY);
  }

  getRect() {
    return {x: this.x - this.w / 2, y: this.y - this.w / 2, w: this.w, h: this.w};
  }

  onMouseMoved() {
    let hover;

    let r = this.getRect();
    hover = mouseX >= r.x && mouseX < r.x + r.w && mouseY >= r.y && mouseY < r.y + r.h;

    if (this.hover != hover) {
      this.hover = hover;
      this.lastHoverEvent = Date.now();

      if (this.hover) {
        this.z = 1.5;
      } else {
        this.z = 1;
      }
    }

    pointerCursor |= this.hover;
  }

  onMouseReleased() {
    this.dragged = false;
    return false;
  }

  static getFacingPoint(p) {
    if (p % 2 === 0) {
      return (p + 5) % 8;
    }
    return (p + 3) % 8;
  }

  static get POINTS() {
    return _tile_points;
  }

  static get SPEC() {
    return _tile_spec;
  }

}

const _tile_points = {
  TL: 0,
  TR: 1,
  RT: 2,
  RB: 3,
  BR: 4,
  BL: 5,
  LB: 6,
  LT: 7,
  END: 8
};

const _tile_spec = {
  NONE: 0,
  BRIDGE: 1,
  KIOSK: 2,
  YINYANG: 3
}