const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');
const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')

// Animation function
function draw(){
  // clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Wobble the cube using a sine wave
  var wobble = Math.sin(Date.now()/250)*200/50;
  
  // draw the cube
  drawCube(
    200/2,
    200/2 + wobble + 100/2,
    100,
    100,
    100,
    '#ff8d4b'
    );
}

draw();

// Colour adjustment function
// Nicked from http://stackoverflow.com/questions/5560248
function shadeColor(color, percent) {
  color = color.substr(1);
  var num = parseInt(color, 16),
  amt = Math.round(2.55 * percent),
  R = (num >> 16) + amt,
  G = (num >> 8 & 0x00FF) + amt,
  B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

// Draw a cube to the specified specs
function drawCube(x, y, wx, wy, h, color) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - wx, y - wx * 0.5);
  ctx.lineTo(x - wx, y - h - wx * 0.5);
  ctx.lineTo(x, y - h * 1);
  ctx.closePath();
  ctx.fillStyle = shadeColor(color, -10);
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + wy, y - wy * 0.5);
  ctx.lineTo(x + wy, y - h - wy * 0.5);
  ctx.lineTo(x, y - h * 1);
  ctx.closePath();
  ctx.fillStyle = shadeColor(color, 10);
  ctx.strokeStyle = shadeColor(color, 50);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x, y - h);
  ctx.lineTo(x - wx, y - h - wx * 0.5);
  ctx.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5));
  ctx.lineTo(x + wy, y - h - wy * 0.5);
  ctx.closePath();
  ctx.fillStyle = shadeColor(color, 20);
  ctx.strokeStyle = shadeColor(color, 60);
  ctx.stroke();
  ctx.fill();
}

for(let i; i<100; i++) {
  draw();
  
  var out = fs.createWriteStream(__dirname + '/state_'+ i +'.png');
  var stream = canvas.createPNGStream();

  stream.on('data', function(chunk){
    out.write(chunk);
  });
}


