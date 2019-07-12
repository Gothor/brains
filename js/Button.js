class Button extends GameObject {

  constructor(parent, x, y, w, h, image, action) {
    super(parent, x, y, 2, w, h);
    this.image = image;
    this.action = action;
    this.hover = false;
    this.hidden = false;
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