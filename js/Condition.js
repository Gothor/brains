class Condition {

    constructor(x, y, point, type, arg) {
      this.x = x;
      this.y = y;
      this.point = point;
      this.type = type;
      this.arg = arg;
    }
  
    draw(tw) {
      let s;
      let img;
      switch (this.type) {
        case Condition.TYPES.KIOSK: img = kiosk; break;
        case Condition.TYPES.YINYANG: img = yinyang; break;
        case Condition.TYPES.NUMBER: img = number; s = this.arg; break;
        case Condition.TYPES.LINK: img = links[this.arg - 1]; break;
        case Condition.TYPES.BRIDGE: img = bridge; s = this.arg; break;
      }
      fill(255);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      textFont("sans-serif");
      let w = Math.min(120, tw / 4);
      let {x, y} = this.getCoordinates(tw, w / 2);
      textSize(w * 64 / 120);
      push();
      translate(x, y);
      if (img)
        image(img, -w / 2, -w / 2, w, w);
      if (s)
        text(s, 0, w / 32);
      pop();
    }
  
    getCoordinates(w, buffer) {
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