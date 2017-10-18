/* Hollywood's Witch Hunt!
 *
 * nicolás peña-escarpentier
 * Physical computing - ITP - Fall 2017 */

// serial communication setup
var portName = '/dev/cu.usbmodem1421';
var serial;

// game variables
let button = 0;
let lastButton = 0;
let fire_intensity = 0;
let fireHue = 30;
let fireSat = 85;
let fireBri = 100;
let knob = 200;
let bg;
let faces = [];
let currFace = 0;
let bodyAnimation;
let moveLeft, moveRight;

function preload(){
	// load background
	bg = loadImage("imgs/background.jpg")
	// load faces
	faces[0] = loadImage("imgs/0_harveyweinstein.png");
	faces[1] = loadImage("imgs/1_woodyallen.png");
	faces[2] = loadImage("imgs/2_caseyaffleck.png");
	faces[3] = loadImage("imgs/3_melgibson.png");
	faces[4] = loadImage("imgs/4_charliesheen.png");
	faces[5] = loadImage("imgs/5_oliverstone.png");
	faces[6] = loadImage("imgs/6_seanpenn.png");
	faces[7] = loadImage("imgs/7_romanpolanski.png");
	faces[8] = loadImage("imgs/8_billcosby.png");
	faces[9] = loadImage("imgs/9_donaldtrump.png");

	bodyAnimation = loadAnimation("imgs/body_001.png", "imgs/body_003.png");
}

function setup(){
	createCanvas(860, 280);
	noStroke();

	// initialize serial communication
	serial = new p5.SerialPort();
	serial.open(portName);
	serial.on('data', parseData);			// function to read incomming data
	serial.on('error', serialError);	// function to catch errors

	// define game variables
	imageMode(CENTER);
	colorMode(HSB, 360, 100, 100, 100);
	fireHue = 30;
	fireSat = 85;
	fireBri = 100;

	// load and create body sprite animation
	bodyAnimation.frameDelay = 10;
}

function draw(){
	background(255);
	image(bg, width/2, height/2);

	// keyboard control
	if(moveLeft){
		knob -= 2;
	} else if (moveRight) {
		knob += 2;
  }
	knob = constrain(knob, 60, width-60);

	// change abuser
	if (button == 1 && lastButton == 0){
		changeAbuser();
	}
	lastButton = button;

	// display
	drawFire();
	drawBody(knob, height*.6);
}

// Process incomming data
function parseData(){
	var inData = serial.readLine();
	if (inData.length > 0){
		var values = inData.split(',');
		// readLine() returns Strings! convert it to int to use it
		button = int(values[0]);
		fire_intensity = map(int(values[1]), 0, 1023, 0, 100);
		knob = map(int(values[2]), 0, 1023, 60, width-60);
	}
}
function serialError(err){
	// console.log("ERROR:",err);
	console.log("Serial communication ERROR");
}

// key controls
function keyPressed() {
	if(keyCode == LEFT_ARROW){
		moveLeft  = true;
		moveRight = false;
	} else if (keyCode == RIGHT_ARROW) {
		moveLeft  = false;
		moveRight = true;
	} else if (key == ' ') {
  	changeAbuser();
  }
}
function keyReleased() {
	if(keyCode == LEFT_ARROW){
		moveLeft  = false;
	} else if (keyCode == RIGHT_ARROW) {
		moveRight = false;
	}
}

// mouse control
function mousePressed(){
	console.log("Mouse pos:", mouseX, " , ", mouseY);
}

// display the body, centered at (posX, posY)
function drawBody(posX, posY){
	// change coordinates
	push();
	translate(posX, posY);
	animation(bodyAnimation, 0, 0, 20, 20);
	image(faces[currFace], 0, -70);
	//return to coordinates
	pop();
}
function changeAbuser(){
	currFace++;
	if(currFace >= faces.length){
		currFace = 0;
	}
}
function drawFire(){
	// change coordinates
	push();
	translate(470, 233);

	// FIRE: set color
	let fireColor = color(fireHue, fireSat, fireBri, 7);
	noStroke();
	fill(fireColor);
	// FIRE: draw overlapping
	for (let i = 0; i < 18; i++) {
		let x_dim = 140 + i*14;
		let y_dim = 250 + i*16;
		arc(0, 0, x_dim, y_dim, PI+0.02, TWO_PI-0.02);
	}

	// DARKNESS

	// return coordinates
	pop();
}
