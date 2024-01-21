// Init
let d = document;
d.body.style = "margin:0;";

// Main Canvas
let c = d.createElement("canvas");
d.body.appendChild(c);
var ctx = c.getContext("2d");

// Pixelated Background Canvas
let background_canvas = new OffscreenCanvas(0, 0);
let background_ctx = background_canvas.getContext("2d");

// Globals
let full_rot = 2 * Math.PI;

// Events (there's something that went wrong here)
let resize = () => {
    // Set the widths and heights
    // For the main canvas
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    // For the background canvas
    background_canvas.width = c.width / 3;
    background_canvas.height = c.height / 3;

    // Render the background
    // Background's background
    background_ctx.rect(0, 0, background_canvas.width, background_canvas.height);
    background_fill(112, 197, 205);

    // Background clouds
    let cloud_fill = () => background_fill(234, 253, 219);
    let cloud_radius = background_canvas.height / 8;
    let cloud_base = background_canvas.height / 1.5;
    for (let i = 0; i <= background_canvas.width; i += background_canvas.width / cloud_radius) {
        background_ctx.beginPath();
        background_ctx.arc(i, cloud_base + Math.random() * cloud_radius, cloud_radius, 0, full_rot); // This line appears to be issue
        cloud_fill();
    }
    background_ctx.rect(0, cloud_base, background_canvas.width, background_canvas.height);
    cloud_fill();

    // Remove aliasing effects
    for (let x = 0; x < background_canvas.width; x++)
        for (let y = 0; y < background_canvas.height; y++) {
            let data = String(background_ctx.getImageData(x, y, 1, 1).data);
            if (data != "112,197,205,255" && data != "234,253,219,255")
                background_ctx.putImageData(new ImageData(new Uint8ClampedArray([234,253,219,255]), 1, 1), x, y);
        }
};
resize();
window.addEventListener("resize", resize);

// Functions
function general_fill(context) {
    context.fillStyle = `rgb(${ [...arguments].slice(1) })`;
    context.fill();
}

function fill() {
    general_fill(ctx, ...arguments);
}
function background_fill() {
    general_fill(background_ctx, ...arguments);
}

function oval() {
    //ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    ctx.beginPath();
    ctx.ellipse(...arguments, 0, full_rot);
}

// Draw

let draw = () => {
    // Background
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(background_canvas, 0, 0, c.width, c.height);

    //rect(0, 0, 100, 100);
    //fill(84, 56, 71);

    //ctx.stroke();
    //oval(95, 50, 40, 40, 0);

    window.requestAnimationFrame(draw);
}
draw();