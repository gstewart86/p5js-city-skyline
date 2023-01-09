//TODO tie view scale to mouse input?
//TODO copy lower half of pixel grid and mirror it to create a lakeside effect
//            could offset the position of each pixel just a bit to make it waterlike
//TODO shrubbery maybe, on the lakeside
//TODO the moon could use some texture
//TODO if the moon has texture, maybe stars as well?
//TODO the buildings could use windows as well. that's a tough one

// TODO make it post apocalyptic like this:
//https://www.reddit.com/r/PixelArt/comments/95wpow/game_concept/
// increase building detail
// deploy some method for sky detail - clouds, stars, sketch
// add ground detail - lake, green hills, etc


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  skyline = new Skyline();
}

function draw() {
  skyline.render();
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
