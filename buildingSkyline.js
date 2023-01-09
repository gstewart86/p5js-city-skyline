
class Skyline {
  /*
  *
  *  Skyline
  * 
  *  A class to create a skyline with buildings and a moon
  *
  */
  constructor() {

    // Make a night sky
    let sky_colors = [];
    for (let i = 0; i < 100; i += 8) {
      sky_colors.push(color(i, i, i));
    }
    this.sky = new Sky(sky_colors);

    this.moon = new Moon(400, 100, 50);
    this.buildings = [];
    this.buildingBase = -50;

    // Generate buildings
    while (this.buildingBase < windowWidth + 50) {
      let building_color = (random(255), random(100, 200), random(100, 200), random(200, 255));
      let building = new Building(this.buildingBase, building_color);
      this.buildings.push(building);
      var random_spacing = random(-15, 2);
      this.buildingBase += building.buildingWidth + random_spacing;
    }

    console.log("skyline created", this)
  }

  render() {
    // Sky
    this.sky.render()

    // Moon
    this.moon.render()

    // Buildings
    for (let i = 0; i < this.buildings.length; i++) {
      this.buildings[i].render();
    }

  }

}

class Sky {
  /**
   * Generates a sky by mapping a gradient from an array of colors.
   *
   * @param {Array} colors - The colors to use in the gradient
   * @param {number} x - The x-coordinate at which to start drawing the gradient (optional, default is 0)
   * @param {number} y - The y-coordinate at which to start drawing the gradient (optional, default is 0)
   * @param {number} width - The width of the gradient to draw (optional, default is the window width)
   * @param {number} height - The height of the gradient to draw (optional, default is the window height)
   */
  constructor(colors = [color(0, 0, 0), color(32, 32, 32), color(64, 64, 64), color(96, 96, 96), color(128, 128, 128), color(160, 160, 160), color(192, 192, 192), color(224, 224, 224)], x = 0, y = 0, width = windowWidth, height = windowHeight) {
    this.x = x;
    this.y = y;
    this.colors = colors;
    this.width = width;
    this.height = height;

    console.log("Sky object created:", this);
  }

  render() {
    let num_colors = this.colors.length;
    for (let i = this.y; i <= this.y + this.height; i++) {
      let inter = map(i, this.y, this.y + this.height, 0, 1);
      let index = Math.floor(map(inter, 0, 1, 0, num_colors - 1));
      let c1 = this.colors[index];
      let c2 = this.colors[index + 1] || this.colors[index];
      let inter2 = map(inter, index / num_colors, (index + 1) / num_colors, 0, 1);
      let c = lerpColor(c1, c2, inter2);
      stroke(c);
      line(this.x, i, this.x + this.width, i);
    }
  }
}


class Moon {
  /**
   * Constructs a new Moon object.
   *
   * @param {number} x - The x-coordinate at which the moon is centered
   * @param {number} y - The y-coordinate at which the moon is centered
   * @param {number} r - The radius of the moon
   * @param {number} texture_detail - A value between 0 and 1 that influences the size and amount of textures on the moon (optional, default is 0.5)
   */
  constructor(x, y, r, texture_detail = 0.5, texture_smoothness = 0.5) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.texture = [];

    // Generate shape texture
    let num_vertices = Math.round(10 * texture_detail);
    for (let i = 0; i < num_vertices; i++) {
      let angle = map(i, 0, num_vertices, 0, TWO_PI);
      let noise = random(-1, 1) * texture_smoothness;
      let x = this.x + cos(angle) * (this.r * texture_detail + this.r * noise * texture_smoothness);
      let y = this.y + sin(angle) * (this.r * texture_detail + this.r * noise * texture_smoothness);
      this.texture.push({ x, y });
    }

    // Generate ellipse texture
    let num_textures = Math.round(10 * texture_detail);
    for (let i = 0; i < num_textures; i++) {
      let r = random(this.r / 5, this.r / 3) * texture_detail;
      let x = random(this.x - this.r + r, this.x + this.r - r);
      let y = random(this.y - this.r + r, this.y + this.r - r);
      // Ensure the texture is within the circumference of the moon
      let d = dist(this.x, this.y, x, y);
      if (d + r > this.r) {
        let angle = atan2(y - this.y, x - this.x);
        x = this.x + cos(angle) * (this.r - r);
        y = this.y + sin(angle) * (this.r - r);
      }
      this.texture.push({ x, y, r });
    }

    console.log("moon created", this)
  }

  render() {
    push();

    // Draw the moon
    noStroke();
    for (let i = this.r; i > 0; i -= 1) {
      fill(200 - i);
      ellipse(this.x, this.y, i * 2);
    }

    // Draw the texture of the moon (ellipse)
    noStroke();
    for (let { x, y, r } of this.texture) {
      fill(100, 25);
      ellipse(x, y, r * 2);
    }

    // arbitary shape
    fill(100, 20);
    noStroke();
    beginShape();
    for (let { x, y } of this.texture) {
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }
}


class Building {

  constructor(buildingBase, buildingColor = color(random(0, 255), random(0, 255), random(0, 255)), windowColor = 'yellow') {
    this.x = buildingBase;
    this.y = 0;

    // building dimensions
    // A;; 
    this.yOffset = random(10, 20);
    this.buildingScale = 1;
    this.minHeight = 50;
    this.maxHeight = 200;
    this.minWidth = 20;
    this.maxWidth = 40;
    this.buildingWidth = random(this.minWidth, this.maxWidth) * this.buildingScale;
    this.buildingHeight = (random(this.minHeight, this.maxHeight) - this.yOffset) * this.buildingScale;
    this.buildingSideWidth = this.buildingWidth / random(0, 5);

    //color
    this.fillOffset = random(.1, .3);
    this.buildingColor = buildingColor;
    this.windowColor = windowColor;

  }

  render() {
    push()

    // Move the origin to the bottom left corner of the window, and flip the y-axis
    translate(0, windowHeight)
    scale(1, -1)

    // Draw the building
    noStroke();
    fill(this.buildingColor)
    rect(this.x, this.y, this.buildingWidth, this.buildingHeight);

    // Draw the side of the building
    push();
    let fillOffset = this.buildingColor.levels[4] * this.fillOffset;
    fill(fillOffset);
    rect(this.x, this.y, this.buildingWidth, this.buildingHeight);
    pop();

    // Draw the windows
    fill(this.windowColor);
    for (let y = 0; y < this.buildingHeight; y += this.buildingHeight / 8) {
      // Check if the current row of windows is within the height of the building
      if (y + (this.buildingHeight / 24) <= this.buildingHeight) {
        for (let x = 0; x < this.buildingWidth; x += this.buildingWidth / 4) {
          // Check if the current window is within the width of the building
          if (x < this.buildingWidth) {
            push();
            translate(this.x + x, this.y + y);
            rect(0, 0, this.buildingWidth / 8, this.buildingHeight / 24);
            pop();
          }
        }
      }
    }

    pop()
  }


}
