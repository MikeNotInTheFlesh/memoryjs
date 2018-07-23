
function Card(x, y, cardWidth, id) {
  this.x = x;
  this.y = y;
  this.w = cardWidth;
  this.h = this.w * 3/4;
  this.visible = false;
  this.id = id;
  
  this.show = function() {
    if (this.visible) {
      fill(255, 255, 255, 255);
      stroke(220);
      // strokeWeight(this.w / 15);
      rect(this.x, this.y, this.w, this.h, this.w / 30);
      image(pics[this.id], this.x, this.y, this.w, this.h);
    } else {
      noStroke();
      fill(0, 100, 255, 255);
      rect(this.x, this.y, this.w, this.h, this.w / 30);
      image(cardBack, this.x, this.y, this.w, this.h);
    }
  }
}
