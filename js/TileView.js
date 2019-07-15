class TileView extends GameObject {

  constructor(parent, image, tile) {
    super(parent, 0, 0, 1, 0, 0);

    this.tile = tile;
    this.connections = [];
    this.selected = false;
    this.image = image;
    this.rotated = 0;
    this.hover = false;
    this.lastHoverEvent = 0;
    this.dragged = false;
  }

  draw() {
    if (!this.image) return;

    /*
    let [x, y] = grid.getCoordinates(this.x, this.y);
    if (grid.contains(this) && grid.placeholder && x === grid.placeholder.x && y === grid.placeholder.y) return;
    */

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

  rotate(n) {
    this.rotated += this.tile.rotate(n);
    this.rotated %= 4;
  }
  
  select(b) {
    if (b === undefined) {
      this.selected = true;
    } else {
      this.selected = !!b;
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

  getRect() {
    return {x: this.x - this.w / 2, y: this.y - this.w / 2, w: this.w, h: this.w};
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
      this._parent.hand.remove(this.tile);
      this._parent.grid.remove(this.tile);
    }

    return false;
  }

  onMouseReleased() {
    this.dragged = false;
    return false;
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
  }

  onMouseDragged() {
    if (!this.dragged) return;

    this.x = this.origX + (mouseX - this.origMouseX);
    this.y = this.origY + (mouseY - this.origMouseY);
  }

}
