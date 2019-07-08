class Button extends GameObject {

  constructor(x, y, w, h, image, action) {
    super(x, y, 2);
    this.w = w;
    this.h = h;
    this.image = image;
    this.action = action;
    this.hover = false;
    this.hidden = true;
  }

  draw() {
    if (this.hidden) return;

    push();
    translate(this.x, this.y);
    image(this.image, 0, 0, this.w, this.h);
    pop();
  }

  hide() {
    this.hidden = true;
  }

  show() {
    this.hidden = false;
  }

  onMouseMoved() {
    if (this.hidden) return false;

    this.hover = (mouseX >= this.x && mouseX < this.x + this.w && mouseY >= this.y && mouseY < this.y + this.h);
    pointerCursor |= this.hover;

    return this.hover;
  }

  onMousePressed() {
    if (this.hidden) return false;

    if (this.hover) {
      this.action(this);
      return true;
    }
    return false;
  }

}