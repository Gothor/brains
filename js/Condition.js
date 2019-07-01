class Condition {

    constructor() {
      this.conditions = [];
    }
  
    addCondition(c, p, arg) {
      this.conditions.push({
        c,
        p,
        arg
      });
    }
  
    draw(w) {
      textSize(24);
      for (let c of this.conditions) {
        let s;
        switch (c.c) {
          case Condition.TYPES.KIOSK: s = 'K'; break;
          case Condition.TYPES.YINYANG: s = 'Y'; break;
          case Condition.TYPES.NUMBER: s = c.arg; break;
          case Condition.TYPES.LINK: s = 'L' + c.arg; break;
          case Condition.TYPES.BRIDGE: s = 'B' + c.arg; break;
        }
        let {x, y} = this.getCoordinates(c.p, w);
        switch(c.p) {
          case Tile.POINTS.TL:
          case Tile.POINTS.TR:
            textAlign(CENTER, TOP); break;
          case Tile.POINTS.BL:
          case Tile.POINTS.BR:
            textAlign(CENTER, BOTTOM); break;
          case Tile.POINTS.RT:
          case Tile.POINTS.RB:
            textAlign(RIGHT, CENTER); break;
          case Tile.POINTS.LT:
          case Tile.POINTS.LB:
            textAlign(LEFT, CENTER); break;
        }
      text(s, x, y);
      }
    }
  
    getCoordinates(p, w) {
      const buffer = w / 20;
      switch (p) {
        case Tile.POINTS.TL:
          return {
            x: w / 4, y: buffer
          };
        case Tile.POINTS.TR:
          return {
            x: 3 * w / 4, y: buffer
          };
  
        case Tile.POINTS.RT:
          return {
            x: w - buffer, y: w / 4
          };
        case Tile.POINTS.RB:
          return {
            x: w - buffer, y: 3 * w / 4
          };
  
        case Tile.POINTS.BR:
          return {
            x: 3 * w / 4, y: w - buffer
          };
        case Tile.POINTS.BL:
          return {
            x: w / 4, y: w - buffer
          };
  
        case Tile.POINTS.LB:
          return {
            x: buffer, y: 3 * w / 4
          };
        case Tile.POINTS.LT:
          return {
            x: buffer, y: w / 4
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