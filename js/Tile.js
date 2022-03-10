class Tile {

  constructor(id) {
    this.id = id;
    this.connections = [];
  }

  addConnection(a, b, spec) {
    this.connections.push([a, b, spec ? spec : Tile.SPEC.NONE]);
  }

  infosFrom(p) {
    for (let c of this.connections) {
      if (p == c[0]) return {end: c[1], spec: c[2]};
      if (p == c[1]) return {end: c[0], spec: c[2]};
    }
  }

  rotate(n) {
    while (n < 0) {
      n += 4;
    }
    n %= 4;

    for (let c of this.connections) {
      c[0] = (c[0] + 2 * n) % 8;
      c[1] = (c[1] + 2 * n) % 8;
    }
    
    return n;
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