class Condition {

    constructor(x, y, point, type, arg) {
      this.x = x;
      this.y = y;
      this.point = point;
      this.type = type;
      this.arg = arg;
    }
  
    draw(w) {
      fill(255);
      textSize(24);
      let s;
      switch (this.type) {
        case Condition.TYPES.KIOSK: s = 'K'; break;
        case Condition.TYPES.YINYANG: s = 'Y'; break;
        case Condition.TYPES.NUMBER: s = this.arg; break;
        case Condition.TYPES.LINK: s = 'L' + this.arg; break;
        case Condition.TYPES.BRIDGE: s = 'B' + this.arg; break;
      }
      let {x, y} = this.getCoordinates(w);
      switch(this.point) {
        case Tile.POINTS.TL:
        case Tile.POINTS.TR:
          textAlign(CENTER, BOTTOM); break;
        case Tile.POINTS.BL:
        case Tile.POINTS.BR:
          textAlign(CENTER, TOP); break;
        case Tile.POINTS.RT:
        case Tile.POINTS.RB:
          textAlign(LEFT, CENTER); break;
        case Tile.POINTS.LT:
        case Tile.POINTS.LB:
          textAlign(RIGHT, CENTER); break;
      }
      text(s, x, y);
    }
  
    getCoordinates(w) {
      const buffer = w / 20;
      switch (this.point) {
        case Tile.POINTS.TL:
          return {
            x: w / 4, y: -buffer
          };
        case Tile.POINTS.TR:
          return {
            x: 3 * w / 4, y: -buffer
          };
  
        case Tile.POINTS.RT:
          return {
            x: w + buffer, y: w / 4
          };
        case Tile.POINTS.RB:
          return {
            x: w + buffer, y: 3 * w / 4
          };
  
        case Tile.POINTS.BR:
          return {
            x: 3 * w / 4, y: w + buffer
          };
        case Tile.POINTS.BL:
          return {
            x: w / 4, y: w + buffer
          };
  
        case Tile.POINTS.LB:
          return {
            x: -buffer, y: 3 * w / 4
          };
        case Tile.POINTS.LT:
          return {
            x: -buffer, y: w / 4
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

    static get TYPES() {
      return _condition_types;
    }
  
  }
  
  const _condition_types = {
    NONE: 0,
    KIOSK: 1,
    YINYANG: 2,
    NUMBER: 3,
    LINK: 4,
    BRIDGE: 5
  }