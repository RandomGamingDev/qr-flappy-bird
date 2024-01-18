// Init
let d = document;
d.body.style = "margin:0;";

let c = d.createElement("canvas");
d.body.appendChild(c);
var ctx = c.getContext("2d");

let resize = () => {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
};
resize();
window.addEventListener("resize", resize);

let draw = () => {
    ctx.rect(0, 0, c.width, c.height);
    ctx.fillStyle = "blue";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(95,50,40,0,2*Math.PI);
    ctx.stroke();
    window.requestAnimationFrame(draw);
}
draw();