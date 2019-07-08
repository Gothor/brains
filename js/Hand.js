class Hand extends GameObject {

    constructor(x, y, size) {
        super(x, y, 0);
        this.tiles = Array(size);
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

    setTile(i, tile) {
        tile.select(false);
        this.tiles[i] = tile;
        tile.setPosition((width / 64) * (i + 1) + (width / 8) * i + width / 16, this.y + 40 + width / 16, 2);
        tile.w = width / 8;
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