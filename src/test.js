// Init
let d = document;

// Main Canvas
let c = d.createElement("canvas");
let ctx = c.getContext("2d");

// Pixelated Background Canvas
let background_canvas = new OffscreenCanvas(0, 0);
let background_ctx = background_canvas.getContext("2d");

// Globals
let pi = Math.PI;
let full_rot = 2 * pi;
let dynamic_floor_start;
let dynamic_dirt_start;
let i;
let j;
let temp;
let seed = Math.random();
let width;
let height;
let background_width;
let background_height;
let pipe_width = 74;
// Pipe parameters
let pipe_gap = 157;
// Pipe parameters
let spout_width = 80;
let spout_height = 37;

// Colors
let edge_color = [84, 56, 71];

// Lambdas
let to_string = String;
let rgb = a => `rgb(${ a })`;

let background_bar = (color, y, height) => {
    background_fill(...color);
    background_fillRect(0, y, background_width, height);
}

let floor = x => Math.floor(x);
let random = _ => (seed = Math.sin(seed) * 10000) - floor(seed);

let general_fill = (context, ...args) => {
    context.fillStyle = rgb(args);
    context.fill();
}

let fill = (...args) => general_fill(ctx, ...args);
let background_fill = (...args) => general_fill(background_ctx, ...args);

let general_stroke = (context, ...args) => {
    context.strokeStyle = rgb(args);
    context.stroke();
}

let stroke = (...args) => general_stroke(ctx, ...args);
let background_stroke = (...args) => general_stroke(background_ctx, ...args);

let oval = (...args) => {
    //ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    beginPath();
    ctx.ellipse(...args, 0, full_rot);
}

let fillRect = (...args) => ctx.fillRect(...args);

let background_rect = (...args) => background_ctx.rect(...args);

let background_fillRect = (...args) => background_ctx.fillRect(...args);

let background_strokeRect = (...args) => background_ctx.strokeRect(...args);

let general_beginPath = (context, ...args) => context.beginPath(...args);

let beginPath = _ => general_beginPath(ctx);
let background_beginPath = _ => general_beginPath(background_ctx);

let add_event_listener = addEventListener;

// Calculate whether between the and a pipe are touching
let calc_col = (x, y, w, h) => { // Maybe use ...args?
    console.log("calc_col NOT IMPLEMENTED YET");
    /*
    let player_x = calc_player_x();
    for (let a = 0; a < full_rot; a += 0.01) {
        for (let i = 0; i < 2; i++) {
            let trig_func
        }
    }
    */
    /*
    for (let a = 0; a < full_rot; a += 0.01) {
        const prerot_point = [player_x + player_width / 2 * cos(a), player_y + player_height / 2 * sin(a)];
        const dist_from_origin = Math.sqrt(prerot_point[0] ** 2 + prerot_point[1] ** 2);
        const new_rot = Math.atan2(prerot_point[1], prerot_point[0]) + r;
        const new_point = [dist_from_origin * cos(new_rot), dist_from_origin * sin(new_rot)]
        
        if (new_point[0] > rx && new_point[0] < rx + rw && new_point[1] > ry && new_point[1] < ry + rh)
          return true;
    }
    */
} 

/*
function strokeFillRect() {
    fillRect(...arguments);
    ctx.strokeRect(...arguments);
}
*/

// Events (there's something that went wrong here)
let sky_fill = [112, 197, 205, 255];
let cloud_fill = [234, 253, 219, 255];
let cloud_radius = 16;
let cloud_base;
let bush_base;
let bush_fill = [130, 228, 140];
let bush_radius = 8;
let resize = _ => {
    // Set the widths and heights
    // For the main canvas
    width = c.width = innerWidth;
    height = c.height = innerHeight;
    // For the background canvas
    background_width = background_canvas.width = floor(width / 3);
    background_height = background_canvas.height = floor(height / 3);

    // Render the background
    // Background's background
    background_fill(...sky_fill);
    background_fillRect(0, 0, background_width, background_height);

    // Background clouds
    cloud_base = floor(background_height * 0.7);
    // Set the seed for generating the clouds
    temp = seed;
    seed = 5;
    background_beginPath(); // Without begin and end path everything turns green
    for (i = 0; i <= background_width; i += cloud_radius) // Iterates over x
        background_ctx.arc(i, cloud_base + random() * cloud_radius, cloud_radius, 0, full_rot);
    background_fill(...cloud_fill);
    background_beginPath();
    seed = temp;

    // Remove the clouds' aliasing effects
    for (i = 0; i < background_width; i++) // Iterates over x
        for (j = cloud_base - cloud_radius; j < cloud_base; j++) // Iterates over y
            if (![to_string(sky_fill), to_string(cloud_fill)].includes(to_string(background_ctx.getImageData(i, j, 1, 1).data)))
                background_ctx.putImageData(new ImageData(new Uint8ClampedArray(cloud_fill), 1, 1), i, j);

    dynamic_floor_start = floor(background_height * 0.875);
    dynamic_dirt_start = floor(background_height * 0.895);

    for (i = 0; i < 4; i++)
        background_bar([
            edge_color,
            [228, 253, 139],
            [85, 128, 34],
            [215, 168, 76]
        ][i], (i < 2 ? dynamic_floor_start : dynamic_dirt_start) + i, 1);

    // Dirt
    background_bar([222, 216, 149], dynamic_dirt_start + 4, background_height - dynamic_dirt_start - 4);
    // Fill in the cloud base
    background_bar(cloud_fill, cloud_base, dynamic_floor_start - cloud_base);

    bush_base = floor(background_height * 0.82);

    background_ctx.lineWidth = 2;

    // Buildings
    for (i = 0; i <= background_width; i += 39)
        for (j of 
                // x, y & height, width
                [
                    // Building tops
                    [18, 17, 5], // Left building
                    [4, 21, 3], // Middle building
                    [0, 17, 3], // Right build

                    // Main buildings
                    [22, 14, 9], // Left building
                    [9, 19, 8], // Middle building
                    [0, 15, 7], // Right building
                    [14, 9, 4]
                ]
            ) {
            background_beginPath();
            background_rect(i - j[0], bush_base - j[1], j[2], j[1]);
            background_stroke(161, 214, 215);
            background_fill(216, 243, 204);
        }

    background_beginPath();

    // Building Windows
    /*
    for (let x = 0; x < background_width; x += 2)
        for (let y = 0; y < background_height; y += 3)
            if (String(background_ctx.getImageData(x, y, 1, 1).data) == "216,243,204,255")
                for (i = 0; i < 2; i++)
                    background_ctx.putImageData(new ImageData(new Uint8ClampedArray([193, 232, 192, 255]), 1, 1), x, y + i);
    */

    // Bushes
    // Bush base
    background_bar(bush_fill, bush_base, dynamic_floor_start - bush_base);

    // Set the seed for generating the bushes (don't add antialiasing to keep the bushes "furry")
    temp = seed;
    seed = 10;
    for (i = 0; i < 5; i++) { // Iterates over y
        for (j = -random() * 28; j <= background_width; j += 28) { // Iterates over x
            background_beginPath(); // Without begin and end path everything turns green
            background_ctx.arc(j, bush_base + 2 * i, bush_radius, 0, pi, true);
            background_stroke(109, 202, 135);
            background_fill(...bush_fill);
            background_beginPath();
        }
    }
    seed = temp;

    beginPath();
};

// Functions
let spout_x = resize(); // Call resize here to avoid an extra let since it returns undefined anyways
let pipe_pair = (x, y, collide) => {
    ctx.lineWidth = 3;

    spout_x = x - 3;
    
    // Top pipe pipe & spout
    pipe_rect(x, -3, pipe_width, y + 3);
    pipe_rect(spout_x, y - spout_height, spout_width, spout_height, 1);
    // Bottom pipe pipe & spout
    pipe_rect(x, y + pipe_gap, pipe_width, 3 * dynamic_floor_start - y - pipe_gap + 4);
    pipe_rect(spout_x, y + pipe_gap, spout_width, spout_height, 1, 1);

    // Test for collisions against the player
    if (collide) {
        calc_col();

        // Replaces all fillRect with calc_col once it's done
        fill(255, 0, 0);
        fillRect(x, -3, pipe_width, y + 3);
        fillRect(x, y + pipe_gap, pipe_width, 3 * dynamic_floor_start - y - pipe_gap + 4);
    }
}

let game_x = 0;//width * 0.75;
let pipe_x = 0;
let start;
let deltaTime;
let player_y = height / 2;
let calc_player_x = _ => width / 2 - player_width;
let player_vel_y = 0;
let player_terminal_vel_y = 9;
let player_width = 25;
let player_height = 20;
let horizontal_pipe_gap = 200;
let player_rot;

// Draw
let draw = _ => {
    deltaTime = new Date() - start ? start : 0;
    start = new Date();

    // Background
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(background_canvas, 0, 0, width, height);

    // Grass base
    background_fill(115, 191, 46);
    background_fillRect(0, dynamic_floor_start + 2, background_width, dynamic_dirt_start - dynamic_floor_start);

    //background_fill(255, 0, 0);
    // 156 230 89 (Grass stripe)

    // Draw the pipes

    // 186 235 191 for the windows


    // Draw the pipes
    temp = seed;
    for (i = game_x - pipe_x; i < width; i += horizontal_pipe_gap) // Iterates over x
        pipe_pair(i, height * (0.1 + random() * 0.4), Math.abs(i - (width / 2 - player_width) + pipe_width / 2) - player_width < pipe_width / 2);
    seed = temp;
    // Start rendering from first visible pipe
    if (-game_x + pipe_x > horizontal_pipe_gap) {
        pipe_x -= horizontal_pipe_gap;
        random();
    }

    // Draw the player
    player_rot = player_vel_y / player_terminal_vel_y * (player_vel_y > 0 ? pi / 2 : 0.4);
    oval(calc_player_x(), player_y, player_width, player_height, player_rot, 0, full_rot);
    fill(255, 0, 0);
    beginPath();
    // Apply gravity
    //player_vel_y += 0.5;
    if (player_vel_y > player_terminal_vel_y)
        player_vel_y = player_terminal_vel_y;
    player_y += player_vel_y;

    //game_x -= 2;
    game_x -= 0.5;

    requestAnimationFrame(draw);
}
let jump = _ => player_vel_y = -9;

let shade_pipe;
let pipe_right_x;
let sides;
let outer_side;

add_event_listener("keydown", (event) => {
    if (event.key == " ")
        jump();
});
add_event_listener("mousedown", jump);
add_event_listener("resize", resize);
draw();

// The function's at the end so that everything can be in 1 let
function pipe_rect(x, y, width, height, spout, flip) {
    shade_pipe = (x, w) => fillRect(x, y, w, height);

    /*
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
    pipe_right_x = x + width;

    // Shadows
    fill(85, 128, 34);
    // Right Middle shadow strand
    shade_pipe(pipe_right_x - 14, 3);
    // Right shadow
    shade_pipe(pipe_right_x - 8, 6);
    */

    if (spout) {
        sides = [y, y + height - 4]
        outer_side = flip ? sides[0] : sides[1];
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

// The initialization stuff's at the end so everything can be one let and for clarity
d.body.style = "margin:0";
c.style = "display:block"
d.body.appendChild(c);