let d = document;
d.body.style = "margin:0;";
let c = d.createElement("canvas");
//c.width = 200;
//c.height = 200;
c.style = "width:100%;height:100%;display:block;";
d.body.appendChild(c);
var ctx = c.getContext("2d");

ctx.rect(0, 0, c.width, c.height);
ctx.fillStyle = "blue";
ctx.fill();

ctx.beginPath();
ctx.arc(95,50,40,0,2*Math.PI);
ctx.stroke();
