class GameObject {

    constructor(parent, x, y, z, w, h) {
        _gameObjects.push(this);
        this._parent = parent;

        if (z === undefined) z = -1;
        this.setPosition(x, y, z);
        this.setDimensions(w, h, false);
    }

    delete() {
        for (let p in this) {
            delete this[p];
        }
        let i = _gameObjects.indexOf(this);
        _gameObjects.splice(i, 1);
    }

    static clear() {
        let objects = GameObject.all().filter(x => x._parent === _scene);
        for (let o of objects) {
            o.delete();
        }
    }

    static all(type) {
        if (!type) return [..._gameObjects];

        return [..._gameObjects.filter(x => x instanceof type)];
    }

    setPosition(x, y, z) {
        this.x = x;
        this.y = y;
        if (arguments.length >= 3) {
            this.z = z;
        }
    }

    setDimensions(w, h, callResizeCallback) {
        if (callResizeCallback === undefined)
            callResizeCallback = true;

        this.w = w;
        this.h = h;

        if (callResizeCallback) {
            this.onResize();
        }
    }

    distance(o) {
        let dx = this.x - o.x;
        let dy = this.y - o.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    draw() {}
    onMouseMoved() {}
    onMousePressed() { return false; }
    onMouseReleased() { return false; }
    onMouseDragged() {}
    onResize() {}

    set z(v) {
        this._z = v;
        _gameObjects.sort((a, b) => a.z - b.z);
    }

    get z() {
        return this._z;
    }

}

const _gameObjects = [];