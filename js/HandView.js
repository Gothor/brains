class HandView extends GameObject {

  constructor(parent, hand, tileImages) {
    super(parent, 0, 0, 0, 0, 0);
    this.position = 0;
    this.tileWidth = 0;

    this.tiles = null;
    this.hand = null;
    this.setHand(hand, tileImages);
  }

  setHand(hand, tileImages) {
    this.hand = hand;
    this.tiles = Array(hand.tiles.length);
    for (let i = 0; i < hand.tiles.length; i++) {
      this.tiles[i] = new TileView(this._parent, tileImages[i], hand.tiles[i]);
      this.tiles[i].select(false);
    }
  }

  onResize() {
    switch (this.position) {
      case 0:
        this.tileWidth = width / 8;
        break;
      case 1:
        let m = Math.min(this.w / 4, this.h / 2);
        this.tileWidth = m - 20;
        break;
      case 2:
        this.tileWidth = this.h / 4 - 20;
        break;
    }
    for (let tile of this.tiles) {
      if (this.hand.contains(tile.tile))
        this.resetTile(tile.tile);
    }
  }

  setTile(i, tile) {
    if (!tile) return;

    let x, y;
    switch (this.position) {
      case 0: // bottom
        x = this.tileWidth / 8 * (i + 1) + this.tileWidth * i;
        y = (this.h - this.tileWidth) / 2;
        break;
      case 1: // bottom on two lines
        if (i < 4) {
          let gutterY = (this.h - (this.tileWidth * 2)) / 3;
          let gutterX = (this.w - (this.tileWidth * 4)) / 5;
          x = this.tileWidth * i + gutterX * (i + 1);
          y = gutterY;
        } else {
          let gutterY = (this.h - (this.tileWidth * 2)) / 3;
          let gutterX = (this.w - (this.tileWidth * 3)) / 4;
          x = this.tileWidth * (i - 4) + gutterX * (i - 4 + 1);
          y = gutterY * 2 + this.tileWidth;
        }
        break;
      case 2: // sides
        if (i < 4) {
          let gutterY = (this.h - (this.tileWidth * 4)) / 5;;
          let gutterX = 10;
          x = gutterX;
          y = this.tileWidth * i + gutterY * (i + 1);
        } else {
          let gutterY = (this.h - (this.tileWidth * 3)) / 4;
          let gutterX = 10;
          x = this.w - this.tileWidth - gutterX;
          y = this.tileWidth * (i - 4) + gutterY * (i - 4 + 1);
        }
        break;
    }

    this.tiles[i].setPosition(this.x + this.tileWidth / 2 + x, this.y + this.tileWidth / 2 + y);
    this.tiles[i].setDimensions(this.tileWidth, this.tileWidth);
    this.tiles[i].select(false);

    this.hand.add(tile);
  }

  remove(tile) {
    this.hand.remove(tile);
  }

  resetTile(tile) {
    this.setTile(this.tiles.map(x => x.tile).indexOf(tile), tile);
  }

  draw() {};

  contains(tile) {
    return this.tiles.includes(tile);
  }

}