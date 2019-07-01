class Tile {

  constructor(image) {
    this.connections = [];
    this.selected = false;
    this.image = image;
    this.rotated = 0;
  }

  addConnection(a, b, spec) {
    this.connections.push([a, b, spec ? spec : Tile.SPEC.NONE]);
  }

  draw(w) {
    if (this.image) {
      push();
      translate(w/2, w/2);
      rotate(this.rotated * HALF_PI);
      translate(-w/2,-w/2);
      image(this.image, 0, 0, w, w);
      pop();

    if (this.selected) {
      strokeWeight(4);
      stroke(0, 200, 0);
      noFill();
      rect(0, 0, w, w);
    }
      return;
    }
    
    strokeWeight(4);
    noFill();
    for (let c of this.connections) {
      let {
        x: x1,
        y: y1
      } = this.getCoordinates(c[0], w);
      let {
        x: x2,
        y: y2
      } = this.getCoordinates(c[1], w);

      switch (c[2]) {
        case Tile.SPEC.NONE:
          stroke(0);
          break;
        case Tile.SPEC.BRIDGE:
          stroke(200, 100, 0);
          break;
        case Tile.SPEC.KIOSK:
          stroke(0, 200, 0);
          break;
        case Tile.SPEC.YINYANG:
          stroke(150, 150, 150);
          break;
      }

        let {x: a, y: b} = Tile.getCurveFor(c[0]);
        let {x: d, y: e} = Tile.getCurveFor(c[1]);
        bezier(x1, y1, a * w, b * w, d * w, e * w, x2, y2);

      if (c[2] === Tile.SPEC.YINYANG) {
        fill(150, 150, 150);
        ellipse(w / 2, w / 2, w / 3);
        noFill();
      }
    }

    if (this.selected) {
      stroke(0, 200, 0);
    }
    rect(0, 0, w, w);
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