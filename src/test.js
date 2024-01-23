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
let dynamic_floor_start;
let dynamic_dirt_start;

// Colors
let edge_color = [84, 56, 71];

// Lambdas
let background_bar = (fill, y, height) => {
    background_fill(...fill);
    background_ctx.fillRect(0, y, background_canvas.width, height);
}

let background_pxbar = (fill, y) => background_bar(fill, y, 1);

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
    background_fill(112, 197, 205);
    background_ctx.fillRect(0, 0, background_canvas.width, background_canvas.height);

    // Background clouds
    let cloud_fill = [234, 253, 219, 255];
    let cloud_radius = 16;
    let cloud_base = Math.floor(background_canvas.height / 1.35);
    for (let i = 0; i <= background_canvas.width; i += cloud_radius) {
        background_ctx.beginPath();
        background_ctx.arc(i, cloud_base + Math.random() * cloud_radius, cloud_radius, 0, full_rot);
        background_fill(...cloud_fill);
    }

    // Remove the clouds' aliasing effects
    for (let x = 0; x < background_canvas.width; x++)
        for (let y = 0; y < background_canvas.height; y++)
            if (!["112,197,205,255", String(cloud_fill)].includes(String(background_ctx.getImageData(x, y, 1, 1).data)))
                background_ctx.putImageData(new ImageData(new Uint8ClampedArray(cloud_fill), 1, 1), x, y);

    dynamic_floor_start = Math.floor(background_canvas.height * 0.921);
    dynamic_dirt_start = Math.floor(background_canvas.height * 0.941);

    // Top black line (scale up pixel spefic by 3)
    background_pxbar(edge_color, dynamic_floor_start);
    // Glistening Green
    background_pxbar([228, 253, 139], dynamic_floor_start + 1);
    // Grass underside
    background_pxbar([85, 128, 34], dynamic_dirt_start + 2);
    // Grass shadow
    background_pxbar([215, 168, 76], dynamic_dirt_start + 3);

    // Dirt
    background_bar([222, 216, 149], dynamic_dirt_start + 4, background_canvas.height - dynamic_dirt_start - 4);
    // Fill in the cloud base
    background_bar(cloud_fill, cloud_base, dynamic_floor_start - cloud_base);
};
resize();
window.addEventListener("resize", resize);

// Functions
function rgb() {
    return `rgb(${ [...arguments] })`;
}

function general_fill(context) {
    context.fillStyle = rgb([...arguments].slice(1));
    context.fill();
}

function fill() {
    general_fill(ctx, ...arguments);
}
function background_fill() {
    general_fill(background_ctx, ...arguments);
}

function stroke() {
    ctx.strokeStyle = rgb(...arguments);
}

function oval() {
    //ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    ctx.beginPath();
    ctx.ellipse(...arguments, 0, full_rot);
}

function pipe(x, y) {
    ctx.lineWidth = 3;

    ctx.beginPath();
    stroke(...edge_color);
    ctx.rect(x, y, 100, c.height - y - dynamic_floor_start / 3);
    fill(115, 191, 46);
    ctx.stroke()

    fill(255, 0, 0)
    ctx.fillRect(500, 200, 100, c.height - y - dynamic_floor_start / 3);

    //dynamic_floor_start
}

// Draw

let draw = () => {
    // Background
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(background_canvas, 0, 0, c.width, c.height);

    //background_ctx.fillRect(430, 175, 10, 10);

    //background_ctx.beginPath();
    //background_ctx.arc(0,0,0,0,0); // This line appears to be issue
    // Grass base
    background_fill(115, 191, 46);
    let a = Math.floor(background_canvas.height * 0.921);
    background_ctx.fillRect(0, a + 2, background_canvas.width, Math.ceil(background_canvas.height * 0.019));

    // Maybe use another canvas for the stripes?
    pipe(100, 300);

    //*/
    //background_fill(255, 0, 0);
    // 156 230 89 (Grass stripe)

    window.requestAnimationFrame(draw);
}
draw();