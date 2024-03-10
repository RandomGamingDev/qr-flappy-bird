let d = document;
let get_2d_context = canvas => canvas.getContext("2d");

// Main Canvas
let c = d.createElement("canvas");
let ctx = get_2d_context(c);

// Pixelated Background Canvas
let background_canvas = new OffscreenCanvas(0, 0);
let background_ctx = get_2d_context(background_canvas);

// Globals
let math = Math;
let pi = math.PI;
let full_rot = 2 * pi;
let seed = math.random();
let two_fifty_five = 255;
let pipe_width = 74;
let pipe_gap = 157;
let spout_width = 80;
let spout_height = 37;
let player_width = 25;
let player_height = 20;

// Empty variables
let dynamic_floor_start;
let dynamic_dirt_start;
let i;
let j;
let temp;
let width;
let height;
let background_width;
let background_height;
let player_x;
let cloud_base;
let bush_base;
let player_rot;
let hit_floor;
let shade_pipe;
let pipe_right_x;
let prerot_point_x;
let prerot_point_y;
let dist_from_origin;
let new_rot;
let new_point_x;
let new_point_y;
let game_over;

// Colors
let edge_color = [84, 56, 71];

// Lambdas
let rgb = a => `rgb(${ a })`;

let background_bar = (color, y, height) => {
    background_fill(...color);
    background_fillRect(0, y, background_width, height);
}

let floor = math.floor;
let random = _ => (seed = math.sin(seed) * 10000) - floor(seed);

let fill = (...args) => {
    ctx.fillStyle = rgb(args);
    ctx.fill();
}
let background_fill = (...args) => {
    background_ctx.fillStyle = rgb(args);
    background_ctx.fill();
}
let fill_arr = arr => fill(...arr);

let stroke = (context, ...args) => {
    context.strokeStyle = rgb(args);
    context.stroke()
}

let fillRect = (...args) => ctx.fillRect(...args);

let background_fillRect = (...args) => background_ctx.fillRect(...args);

let beginPath = _ => ctx.beginPath(ctx);
let background_beginPath = _ => background_ctx.beginPath(background_ctx);

let ellipse = (fill_color, ...args) => {
    beginPath();
    ctx.ellipse(...args, 0, 0, full_rot);
    stroke(ctx, edge_color);
    fill_arr(fill_color);
}

let add_event_listener = addEventListener;

// Calculate whether between the and a pipe are touching
let calc_col = (rx, ry, rw, rh) => {
    for (j = 0; j < full_rot; j += 0.1) {
        prerot_point_x = player_width * math.cos(j);
        prerot_point_y = player_height * math.sin(j);
        dist_from_origin = math.sqrt(prerot_point_x * prerot_point_x + prerot_point_y * prerot_point_y);
        new_rot = math.atan2(prerot_point_y, prerot_point_x) + player_rot;
        new_point_x = player_x + dist_from_origin * math.cos(new_rot);
        new_point_y = player_y + dist_from_origin * math.sin(new_rot);

        if (new_point_x > rx && new_point_x < rx + rw && new_point_y > ry && new_point_y < ry + rh)
          return true;
    }
} 

// Events (there's something that went wrong here)
let sky_fill = [112, 197, 205];
let cloud_fill = [234, 253, 219];
let cloud_radius = 16;
let bush_fill = [130, 228, 140];
let resize = _ => {
    // Set the widths and heights
    // For the main canvas
    width = c.width = innerWidth;
    height = c.height = innerHeight;
    // For the background canvas
    background_width = background_canvas.width = width / 3;
    background_height = background_canvas.height = height / 3;

    // Render the background
    // Background's background
    background_fill(...sky_fill);
    background_fillRect(0, 0, background_width, background_height);

    // Background clouds
    cloud_base = floor(background_height * 0.7);
    // Set the seed for generating the clouds
    temp = seed;
    seed = 5;
    for (i = 0; i < background_width; i += cloud_radius) { // Iterates over x
        background_beginPath(); // Without begin and end path everything turns green
        background_ctx.arc(i, cloud_base + random() * cloud_radius, cloud_radius, 0, full_rot);
        background_fill(...cloud_fill);
    }
    seed = temp;

    // Remove the clouds' aliasing effects
    temp = background_ctx.getImageData(0, 0, background_width, background_height);
    // Don't worry about the array only being 3 long it'll return undefined which'll just result in it keeping its value
    temp.data.map((component, index) => sky_fill[index %= 4] != component && cloud_fill[index] != component ? cloud_fill[index] : component);
    background_ctx.putImageData(temp, 0, 0);

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
    for (i = 0; i < background_width; i += 39)
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
            background_ctx.rect(i - j[0], bush_base - j[1], j[2], j[1]);
            stroke(background_ctx, 161, 214, 215);
            background_fill(216, 243, 204);
        }


    /*
    // Building Windows
    for (i = 0; i < background_width; i += 2)
        for (j = 0; j < background_height; j += 3)
            for (temp = 0; temp < 2; temp++)
                if (to_string(background_ctx.getImageData(i, j + temp, 1, 1).data) == "216,243,204,two_fifty_five")
                    background_ctx.putImageData(new ImageData(new Uint8ClampedArray([193, 232, 192, two_fifty_five]), 1, 1), i, j + temp);
    //*/

    // Bushes
    // Bush base
    background_bar(bush_fill, bush_base, dynamic_floor_start - bush_base);

    // Set the seed for generating the bushes (don't add antialiasing to keep the bushes "furry")
    temp = seed;
    seed = 10;
    for (i = 0; i < 5; i++) { // Iterates over y
        for (j = -random() * 28; j < background_width; j += 28) { // Iterates over x
            background_beginPath(); // Without begin and end path everything turns green
            background_ctx.arc(j, bush_base + 2 * i, 8, 0, pi, true);
            stroke(background_ctx, 109, 202, 135);
            background_fill(...bush_fill);
        }
    }
    seed = temp;

    player_x = width / 2 - player_width;
}

// Functions
let spout_x = resize(); // Call resize here to avoid an extra let since it returns undefined anyways
let pipe_pair = (x, y, collide) => {
    ctx.lineWidth = 3;

    spout_x = x - 3;
    
    // Top pipe pipe & spout
    pipe_rect(x, -3, pipe_width, y + 3, collide);
    pipe_rect(spout_x, y - spout_height, spout_width, spout_height, collide, 1, 0);
    // Bottom pipe pipe & spout
    pipe_rect(x, y + pipe_gap, pipe_width, 3 * dynamic_floor_start - y - pipe_gap + 4, collide);
    pipe_rect(spout_x, y + pipe_gap, spout_width, spout_height, collide, 1, 1);
}

let game_x = width * 0.75;
let pipe_x = 0;
let player_y = height / 2;
let player_vel_y = 0;
let player_terminal_vel_y = 9;
let horizontal_pipe_gap = 200;
let max_player_y = -10;
let beak_color = [234, 80, 64];
let white = [two_fifty_five, two_fifty_five, two_fifty_five];

// Draw
let draw = _ => {
    if (player_y < max_player_y)
        player_y = max_player_y;

    hit_floor = calc_col(0, dynamic_floor_start * 3, width, 1);

    // Background
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(background_canvas, 0, 0, width, height);

    // Grass base
    background_fill(115, 191, 46);
    background_fillRect(0, dynamic_floor_start + 2, background_width, dynamic_dirt_start - dynamic_floor_start);

    // 156 230 89 (Grass stripe)

    // Draw the pipes

    // 186 235 191 for the windows


    // Draw the pipes
    temp = seed;
    for (i = game_x - pipe_x; i < width; i += horizontal_pipe_gap) // Iterates over x
        pipe_pair(i, height * (0.1 + random() * 0.4), math.abs(i - (width / 2 - player_width) + spout_width / 2) - player_width < pipe_width / 2);
    seed = temp;
    // Start rendering from first visible pipe
    if (-game_x + pipe_x > horizontal_pipe_gap) {
        pipe_x -= horizontal_pipe_gap;
        random();
    }

    // Draw the player
    player_rot = player_vel_y / player_terminal_vel_y * (player_vel_y > -1 ? pi / 2 : 0.6);
    ctx.lineWidth = 6;
    ctx.save();
    ctx.translate(player_x, player_y);
    ctx.rotate(player_rot);

    // Draw the main body
   ellipse([212, 191, 39], 0, 0, player_width, player_height);
   ellipse(white, 11, -7, 9, 9);
   ellipse(edge_color, 13, -7, 1, 4);
   ellipse(beak_color, 19, 7, 8, 2);
   ellipse(beak_color, 18, 15, 7, 2);
   ellipse(white, -15, -1, 11, 9);

    ctx.restore();

    beginPath();
    // Apply gravity
    player_vel_y += 0.5;
    if (player_vel_y > player_terminal_vel_y)
        player_vel_y = player_terminal_vel_y;
    player_y += player_vel_y;

    if (!game_over)
        game_x -= horizontal_pipe_gap * player_terminal_vel_y / (2 * 0.4 * height);
    fill(two_fifty_five, two_fifty_five, two_fifty_five);
    ctx.font = "48px Impact";
    // It automatically converts it to a string so it's fine
    ctx.fillText(math.max(floor(-(game_x - player_x) / horizontal_pipe_gap) + 1, 0), width / 2, 85);

    if (!hit_floor)
        requestAnimationFrame(draw);
}
let jump = _ => player_vel_y = -player_terminal_vel_y;

let pipe_color = [115, 191, 46];
let pipe_highlight_color = [155, 227, 89];
let pipe_bright_highlight_color = [228, 253, 139];
let pipe_shadow = [85, 128, 34];

add_event_listener("keydown", event => {
    if (event.key == " ")
        jump();
});
add_event_listener("mousedown", _ => jump());
add_event_listener("resize", resize);
draw();

// The function's at the end so that everything can be in 1 let
function pipe_rect(x, y, width, height, collide, spout, flip) {
    shade_pipe = (x, w = 3) => fillRect(x, y, w, height);

    if (collide && calc_col(...arguments)) {
        player_vel_y = player_terminal_vel_y;
        jump = _ => 0;
        game_over = true;
    }

    // Main body
    fill_arr(pipe_color);
    shade_pipe(x, width);

    // Highlights
    fill_arr(pipe_highlight_color);
    // Left highlight
    shade_pipe(x, 18);
    // Middle Left highlight strand
    shade_pipe(x + 21);

    // Leftmost bright highlight
    fill_arr(pipe_bright_highlight_color);
    fillRect(x + 3, y, 3, height);

    // Scale by left
    pipe_right_x = x + width;

    // Shadows
    fill_arr(pipe_shadow);
    // Right Middle shadow strand
    shade_pipe(pipe_right_x - 14);
    // Right shadow
    shade_pipe(pipe_right_x - 8, 6);

    if (spout) {
        // Dark
        j = y + height - 4;
        fill(85, 128, 34);
        fillRect(x, y, width, 3);
        fillRect(x, j, width, 3);
        j = flip ? y : j;

        // Highlight
        fill_arr(pipe_highlight_color);
        fillRect(x + 3, j, 69, 3);

        // Bright highlight
        fill_arr(pipe_bright_highlight_color);
        fillRect(x + 6, j, 42, 3);
        fillRect(x + 51, j, 3, 3);

        // Body color
        fill_arr(pipe_color);
        fillRect(x + 72, j, 3, 3);
    }

    // Outside stroke
    stroke(ctx, ...edge_color);
    ctx.strokeRect(...arguments)
}

// The initialization stuff's at the end so everything can be one let and for clarity
d.body.style = "margin:0;touch-action:manipulation";
c.style = "display:block";
d.body.appendChild(c);