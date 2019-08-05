class Game {

  constructor(levels, tiles) {
    this.win = false;
    this.levels = levels;
    this.hand = new Hand(tiles);
    this.grid = null;
    this.currentLevel = 0;
  }

  getCurrentLevel() {
    return this.levels[this.currentLevel];
  }

  checkVictory() {
    this.win = this.grid.checkConditions();
    if (this.win) {
      let done = JSON.parse(localStorage.getItem("doneLevels"));
      if (!done) {
        done = [];
      }
      if (!done.includes(this.currentLevel)) {
        done.push(this.currentLevel);
        localStorage.setItem("doneLevels", JSON.stringify(done));
      }
    }
    return this.win;
  }

  loadLevel(index) {
    while (index < 0) index += this.levels.length;
    index %= this.levels.length;

    this.currentLevel = index;
    localStorage.setItem("currentLevel", this.currentLevel);
    this.grid = new Grid(this.levels[index]);
  }

}