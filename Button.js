function Button(x, y, w, h, id) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.id = id;
  this.visible = false;
  
  this.show = function() {
    if (! this.visible) {
      return;
    }
    push();
    stroke(184, 134, 11, 255);
    if (mouseX > this.x && mouseX < this.x+this.w
    && mouseY > this.y && mouseY < this.y + this.h
    ){
      fill(255, 215, 0, 255);
      stroke(218, 165, 0, 255);
    } else {
      fill(218, 165, 0, 255);
    }
    
    rect(this.x, this.y, this.w, this.h, this.w / 8);
    textAlign(CENTER, CENTER);
    textSize(this.h / 1.5);
    fill(255);
    text(8 + 2 * this.id, this.x + this.w / 2, this.y + this.h / 2.5);
    pop();
  }
  
  this.checkPressed = function() {
    if (mouseX > this.x && mouseX < this.x+this.w
    && mouseY > this.y && mouseY < this.y + this.h
    ) {
      return true;
    } 
    else return false;
  }
  
  this.action = function() {
    newGame(8 + 2 * this.id);
  }
}
