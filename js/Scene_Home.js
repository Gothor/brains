class Scene_Home extends Scene {

  constructor(currentLevel) {    
    super();

    const numberOfTile = 3;

    this.start = Date.now();
    this.last = Date.now();
    this.alpha = 0;
    this.grid = Array(numberOfTile + 1);
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = Array(numberOfTile + 1);
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j] = { tile: floor(random(images.length)), rotate: Math.floor(random(4))};
      }
    }
    this.offset = {x: 0, y: 0};
    this.tileOffset = {x: 0, y: 0};
    this.tileWidth = Math.max(width, height) / numberOfTile;
  }

  idle() {
    let t = Date.now();
    let d = t - this.start;
    let d2 = t - this.last;

    this.alpha = map(Math.cos(d * PI / 1000), -1, 1, 0, 255);

    this.offset.x -= d2 / 30;
    this.offset.y -= d2 / 40;

    if (this.offset.x < - this.tileWidth) {
      this.offset.x += this.tileWidth;
      this.tileOffset.x++;
    }
    if (this.offset.y < - this.tileWidth) {
      this.offset.y += this.tileWidth;
      this.tileOffset.y++;
    }

    this.last = t;
  }

  draw() {
    background("#55691e");

    for (let x = 0; (x - 1) * this.tileWidth < width; x++) {
      for (let y = 0; (y - 1) * this.tileWidth < height; y++) {
        let _x = (x + this.tileOffset.x) % this.grid.length;
        let _y = (y + this.tileOffset.y) % this.grid.length;
        let tile = this.grid[_y][_x].tile;

        push();
        translate(x * this.tileWidth + this.offset.x, y * this.tileWidth + this.offset.y);
        translate(this.tileWidth / 2, this.tileWidth / 2);
        rotate(this.grid[_y][_x].rotate * HALF_PI);
        translate(-this.tileWidth / 2, -this.tileWidth / 2);
        image(images[tile], 0, 0, this.tileWidth, this.tileWidth);
        pop();
      }
    }
    
    image(shade, 0, 0, width, height);

    push();
    translate(width / 2, height / 2);
    image(logo, -logo.width / 2, -logo.height / 2);
    pop();

    fill(255, this.alpha);
    textStyle(BOLD);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(64);
    textFont("Amatic SC");
    text("Cliquez n'importe où pour commencer", width / 2, height - 50);
  }

  onResize() {
    this.tileWidth = Math.max(width, height) / (this.grid.length - 1);
  }

  onMousePressed() {
    let currentLevel = localStorage.getItem("currentLevel");
    if (currentLevel === null) {
      currentLevel = 0;
    } else {
      currentLevel = parseInt(currentLevel);
    }

    setNextScene(new Scene_Levels(currentLevel));
  };

}