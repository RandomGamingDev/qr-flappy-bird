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

// Events
let resize = () => {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    background_canvas.width = c.width / 3;
    background_canvas.height = c.height / 3;
};
resize();
window.addEventListener("resize", resize);

// Globals
let full_rot = 2 * Math.PI;

// Functions
function fill() {
    ctx.fillStyle = `rgb(${ [...arguments] })`;
    ctx.fill();
}
function fille() {
    background_ctx.fillStyle = `rgb(${ [...arguments] })`;
    background_ctx.fill();
}

function oval() {
    //ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    ctx.beginPath();
    ctx.ellipse(...arguments, 0, full_rot);
}

// Draw

let draw = () => {
    // Background
    ctx.rect(0, 0, c.width, c.height);
    fill(112, 197, 205);

    //ctx.stroke();
    //oval(95, 50, 40, 40, 0);

    background_ctx.imageSmoothingEnabled = false;

    // Background background
    background_ctx.rect(0, 0, background_canvas.width, background_canvas.height);
    background_ctx.fillStyle = "rgb(112, 197, 205)";
    background_ctx.fill();

    let cloud_fill = () => fille(234, 253, 219);
    let cloud_radius = background_canvas.width / 8; // height / 8
    let cloud_base = background_canvas.height / 1.5;
    let cloud_max_deviation = background_canvas.height / 8;
    for (let i = 0; i < background_canvas.width; i += background_canvas.width * 1.5 / cloud_radius) {
        background_ctx.imageSmoothingEnabled = false;
        background_ctx.beginPath();
        background_ctx.arc(i, cloud_base + Math.random() * cloud_max_deviation, cloud_radius, 0, 2 * Math.PI);
        cloud_fill();
    }
    background_ctx.rect(0, cloud_base + cloud_max_deviation - cloud_radius, background_canvas.width, background_canvas.height);
    cloud_fill();

    console.log(background_ctx.getImageData(0, 0, 1, 1).data)

    /*
    // Random Circle
    background_ctx.beginPath();
    background_ctx.arc(50, 50, 50, 0, 2 * Math.PI);
    background_ctx.fillStyle = "red";
    background_ctx.fill();
    */
    ctx.imageSmoothingEnabled = false;
    // Draw the Canvas
    ctx.drawImage(background_canvas, 0, 0, c.width, c.height);

    //window.requestAnimationFrame(draw);
}
draw();