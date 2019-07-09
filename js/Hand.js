class Hand extends GameObject {

    constructor(x, y, w, h, position, size) {
        super(x, y, 0, w, h);
        this.tiles = Array(size);

        this.position = position;
        this.onResize();
    }

    add(tiles) {
        if (!(tiles instanceof Array)) tiles = [tiles];
        
        let c = 0;
        for (let i = 0; i < this.tiles.length && c < tiles.length; i++) {
            if (!this.tiles[i]) {
                this.setTile(i, tiles[c++]);
            }
        }
    }

    onResize() {
        switch(this.position) {
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
        for (let i = 0; this.tiles && i < this.tiles.length; i++) {
            if (!grid || !grid.contains(this.tiles[i]))
                this.setTile(i, this.tiles[i]);
        }
    }

    setTile(i, tile) {
        if (!tile) return;
        
        tile.select(false);
        this.tiles[i] = tile;
        let x, y;
        switch(this.position) {
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
                    i -= 4;
                    let gutterY = (this.h - (this.tileWidth * 2)) / 3;
                    let gutterX = (this.w - (this.tileWidth * 3)) / 4;
                    x = this.tileWidth * i + gutterX * (i + 1);
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
                    i -= 4;
                    let gutterY = (this.h - (this.tileWidth * 3)) / 4;
                    let gutterX = 10;
                    x = this.w - this.tileWidth - gutterX;
                    y = this.tileWidth * i + gutterY * (i + 1);
                }
                break;
        }
        tile.setPosition(this.x + this.tileWidth / 2 + x, this.y + this.tileWidth / 2 + y, 2);
        tile.w = this.tileWidth;
    }

    remove(tile) {
        if (tile instanceof Tile) {
            let i = this.tiles.indexOf(tile);
            if (i != -1) {
                this.tiles[i] = null;
            }
        } else if (typeof(tile) === 'number') {
            tile = Math.floor(tile);
            if (tile >= 0 && tile < this.tiles.length) {
                this.tiles[i] = null;
            }
        }
    }

    resetTile(tile) {
        this.setTile(this.tiles.indexOf(tile), tile);
    }

    draw() {};

    contains(tile) {
        return this.tiles.includes(tile);
    }

}