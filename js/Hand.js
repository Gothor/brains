class Hand {

    // Public

    constructor(tiles) {
        this.tiles = [];
        
        if (tiles) {
            this.add(tiles);
        }
    }

    add(tiles) {
        if (!(tiles instanceof Array)) tiles = [tiles];

        for (let tile of tiles) {
            if (tile instanceof Tile)
                this.tiles.push(tile);
        }
    }

    remove(tile) {
        if (tile instanceof Tile) {
            this._removeTile(tile);
        } else if (typeof(tile) === 'number') {
            this._removeTileAt(tile);
        }
    }

    contains(tile) {
        return this.tiles.includes(tile);
    }
    
    // Private

    _removeTile(tile) {
        let index = this.tiles.indexOf(tile);
        if (index != -1) {
            return this.tiles.splice(index, 1)[0];
        }
        return undefined;
    }

    _removeTileAt(index) {
        index = Math.floor(index);
        return this.tiles.splice(index, 1)[0];
    }

}