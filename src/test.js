// Init
let d = document;
d.body.style = "margin:0";

// Main Canvas
let c = d.createElement("canvas");
c.style = "display:block"
d.body.appendChild(c);
var ctx = c.getContext("2d");

// Pixelated Background Canvas
let background_canvas = new OffscreenCanvas(0, 0);
let background_ctx = background_canvas.getContext("2d");

// Globals
let full_rot = 2 * Math.PI;
let dynamic_floor_start;
let dynamic_dirt_start;
let temp;
let seed;

// Colors
let edge_color = [84, 56, 71];

// Lambdas
let background_bar = (fill, y, height) => {
    background_fill(...fill);
    background_fillRect(0, y, background_canvas.width, height);
}

let background_pxbar = (fill, y) => background_bar(fill, y, 1);

let floor = (x) => Math.floor(x);
let random = () => (seed = Math.sin(seed) * 10000) - floor(seed);

// Events (there's something that went wrong here)
let resize = () => {
    // Set the widths and heights
    // For the main canvas
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    // For the background canvas
    background_canvas.width = floor(c.width / 3);
    background_canvas.height = floor(c.height / 3);

    // Render the background
    // Background's background
    background_fill(112, 197, 205);
    background_fillRect(0, 0, background_canvas.width, background_canvas.height);

    // Background clouds
    let cloud_fill = [234, 253, 219, 255];
    let cloud_radius = 16;
    let cloud_base = floor(background_canvas.height * 0.7);
    // Set the seed for generating the clouds
    temp = seed;
    seed = 5;
    background_ctx.beginPath(); // Without begin and end path everything turns green
    for (let x = 0; x <= background_canvas.width; x += cloud_radius) {
        background_ctx.arc(x, cloud_base + random() * cloud_radius, cloud_radius, 0, full_rot);
    }
    background_fill(...cloud_fill);
    background_ctx.beginPath();
    seed = temp;

    // Remove the clouds' aliasing effects
    for (let x = 0; x < background_canvas.width; x++)
        for (let y = cloud_base - cloud_radius; y < cloud_base; y++)
            if (!["112,197,205,255", String(cloud_fill)].includes(String(background_ctx.getImageData(x, y, 1, 1).data)))
                background_ctx.putImageData(new ImageData(new Uint8ClampedArray(cloud_fill), 1, 1), x, y);

    dynamic_floor_start = floor(background_canvas.height * 0.875);
    dynamic_dirt_start = floor(background_canvas.height * 0.895);

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

    let bush_base_start = floor(background_canvas.height * 0.82);

    // Buildings
    for (let x = 0; x <= background_canvas.width; x += 39) {
        background_ctx.lineWidth = 2;
        background_ctx.beginPath();

        // Left building
        background_rect(x - 22, bush_base_start - 14, 9, 14);
        background_rect(x - 18, bush_base_start - 17, 5, 2);
        // Middle building
        background_rect(x - 9, bush_base_start - 19, 8, 19);
        background_rect(x - 4, bush_base_start - 21, 3, 2);
        // Right building
        background_rect(x, bush_base_start - 15, 7, 15);
        background_rect(x, bush_base_start - 17, 3, 1);

        background_stroke(161, 214, 215);
        background_fill(216, 243, 204);


        // Bottom left building
        background_ctx.beginPath();
        background_rect(x - 14, bush_base_start - 9, 4, 9);
        background_stroke(161, 214, 215);
        background_fill(216, 243, 204);
    }
    background_ctx.beginPath();

    // Bushes
    // Bush base
    background_bar([130, 228, 140], bush_base_start, dynamic_floor_start - bush_base_start);

    // Test bush
    background_ctx.beginPath(); // Without begin and end path everything turns green
    background_ctx.arc(100, 270, 8, 0, full_rot / 2, true);
    background_ctx.lineWidth = 2;
    background_stroke(110, 203, 136);
    background_fill(130, 228, 140);
    background_ctx.beginPath();
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

function general_stroke(context) {
    context.strokeStyle = rgb([...arguments].slice(1));
    context.stroke();
}

function stroke() {
    general_stroke(ctx, ...arguments);
}
function background_stroke() {
    general_stroke(background_ctx, ...arguments);
}

function oval() {
    //ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    ctx.beginPath();
    ctx.ellipse(...arguments, 0, full_rot);
    ctx.closePath();
}

function fillRect() {
    ctx.fillRect(...arguments);
}

function background_rect() {
    background_ctx.rect(...arguments);
}

function background_fillRect() {
    background_ctx.fillRect(...arguments);
}

function background_strokeRect() {
    background_ctx.strokeRect(...arguments);
}

/*
function strokeFillRect() {
    fillRect(...arguments);
    ctx.strokeRect(...arguments);
}
*/

function pipe_rect(x, y, width, height, spout, flip) {
    let shade_pipe = (x, w) => fillRect(x, y, w, height);

    // Main body
    fill(115, 191, 46);
    shade_pipe(x, width);

    // Highlights
    fill(155, 227, 89);
    // Left highlight
    shade_pipe(x, 18);
    // Middle Left highlight strand
    shade_pipe(x + 21, 3);

    // Leftmost bright highlight
    fill(228, 253, 139);
    fillRect(x + 3, y, 3, height);

    // Scale by left
    let pipe_right_x = x + width;

    // Shadows
    fill(85, 128, 34);
    // Right Middle shadow strand
    shade_pipe(pipe_right_x - 14, 3);
    // Right shadow
    shade_pipe(pipe_right_x - 8, 6);

    if (spout) {
        let sides = [y, y + height - 4]
        let outer_side = flip ? sides[0] : sides[1];
        // Dark
        fill(85, 128, 34);
        sides.forEach(shadow_y => fillRect(x, shadow_y, width, 3));

        // Highlight
        fill(155, 227, 89); // spout_x
        fillRect(x + 3, outer_side, 69, 3);

        // Bright highlight
        fill(228, 253, 139);
        fillRect(x + 6, outer_side, 42, 3);
        fillRect(x + 51, outer_side, 3, 3);

        // Body color
        fill(115, 191, 46);
        fillRect(x + 72, outer_side, 3, 3);
    }

    // Outside stroke
    stroke(...edge_color);
    ctx.strokeRect(...arguments);
}

function pipe_pair(x, y) {
    ctx.lineWidth = 3;

    // Pipe parameters
    let pipe_gap = c.height / 4;
    let pipe_width = 74;
    // Pipe parameters
    let spout_x = x - 3;
    let spout_width = 80;
    let spout_height = 37;
    
    // Top pipe pipe & spout
    pipe_rect(x, -3, pipe_width, y + 3);
    pipe_rect(spout_x, y - spout_height, spout_width, spout_height, 1);
    // Bottom pipe pipe & spout
    pipe_rect(x, y + pipe_gap, pipe_width, floor(dynamic_floor_start + 1 - (y + pipe_gap) / 3) * 3);
    pipe_rect(spout_x, y + pipe_gap, spout_width, spout_height, 1, 1);
}

let game_x = 0;

// Draw
let draw = () => {
    // Background
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(background_canvas, 0, 0, c.width, c.height);

    // Grass base
    background_fill(115, 191, 46);
    background_fillRect(0, dynamic_floor_start + 2, background_canvas.width, dynamic_dirt_start - dynamic_floor_start);

    //background_fill(255, 0, 0);
    // 156 230 89 (Grass stripe)

    // Draw the pipes
    let pipe_gap = 200;

    // 186 235 191 for the windows

    // Maybe use another canvas for the stripes?
    for (let x = game_x; x < c.width; x += pipe_gap)
        pipe_pair(x, 300);

    window.requestAnimationFrame(draw);
}
draw();