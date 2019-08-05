class Scene_Levels extends Scene {

  constructor(currentLevel) {
    super();

    this.start = currentLevel - currentLevel % 10;

    this.nextArrow = new Button(this, width - next.width, 0, next.width, next.height, next, () => {
      this.next();
    });
    this.previousArrow = new Button(this, 0, 0, previous.width, previous.height, previous, () => {
      this.previous();
    });

    let done = JSON.parse(localStorage.getItem("doneLevels"));
    if (!done) {
      done = [];
    }

    this.levels = [];
    let w = width / 5;
    let h = (height - next.height) / 2;
    let m = Math.min(w, h);
    for (let i = 0; i < 10; i++) {
      let x = i % 5;
      let y = Math.floor(i / 5);
      this.levels.push(new Button(this, x * w + (w - m) / 2, next.height + y * h, m, m, done.includes(this.start + i) ? doneTorii : torii, ((i) => {
        return () => this.openLevel(i);
      })(i)));
    }

    this.onResize();
  }

  openLevel(i) {
    setNextScene(new Scene_Level(_game, this.start + i));
  }

  delete() {
    super.delete();
    GameObject.clear();
  }

  previous() {
    this.start = (this.start + 40) % 50;
    this.updateButtons();
  }

  next() {
    this.start = (this.start + 10) % 50;
    this.updateButtons();
  }

  updateButtons() {
    let done = JSON.parse(localStorage.getItem("doneLevels"));
    if (!done) {
      done = [];
    }

    for (let i = 0; i < this.levels.length; i++) {
      this.levels[i].image = done.includes(this.start + i) ? doneTorii : torii;
    }
  }

  draw() {
    background("#55691e");

    image(gradient, 0, 0, width, height);

    for (let x = 0; x < width; x += pattern.width) {
      for (let y = 0; y < width; y+= pattern.height) {
        image(pattern, x, y, pattern, pattern);
      }
    }

    let ratio = Math.min(500, width / 3) / logo.width;
    image(logo, (width - logo.width * ratio) / 2, 0, logo.width * ratio, logo.height * ratio);

    for (let o of GameObject.all()) {
      o.draw();
    }

    textAlign(CENTER, TOP);
    textSize(64);
    text("Choose a level", width / 2, logo.height * ratio);
    
    fill(255);
    textStyle(BOLD);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(this.levels[0].h * 2 / 3);
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 5; x++) {
        let i = y * 5 + x;
        text(x + y * 5 + 1 + this.start, this.levels[i].x + this.levels[i].w / 2, this.levels[i].y + 2 * this.levels[i].h / 3);
      }
    }
  }

  onResize() {
    let logoHeight = logo.height * Math.min(500, width / 3) / logo.width;

    let ratio = Math.min(300, width / 3) / next.width;
    this.nextArrow.setDimensions(next.width * ratio, next.height * ratio);
    this.nextArrow.setPosition(width - next.width * ratio - 20, logoHeight + 64);
    this.previousArrow.setDimensions(next.width * ratio, next.height * ratio);
    this.previousArrow.setPosition(20, logoHeight + 64);

    let headerHeight = logoHeight + 64 + next.height * ratio;

    let w = width / 5;
    let h = (height - headerHeight) / 2;
    let m = Math.min(w, h);
    for (let i = 0; i < 10; i++) {
      let x = i % 5;
      let y = Math.floor(i / 5);
      this.levels[i].setPosition(x * w + (w - m) / 2, headerHeight + y * h + (h - m) / 2);
      this.levels[i].setDimensions(m, m);
    }
  }

  onMouseMoved() {
    let objects = GameObject.all().reverse();
    let hovered = false;
    for (let o of objects) {
      if (!hovered) hovered = o.onMouseMoved();
      else o.hover = false;
    }

    if (hovered) {
      canvas.style.cursor = "pointer";
    } else {
      canvas.style.cursor = "auto";
    }
  };

  onMousePressed() {
    for (let o of GameObject.all().reverse()) {
      if (o.onMousePressed()) return;
    }
  };

  onKeyPressed(keyCode) {
    switch(keyCode) {
      case 37:
        this.previous();
        break;
      case 39:
        this.next();
        break;
    }
  }

}