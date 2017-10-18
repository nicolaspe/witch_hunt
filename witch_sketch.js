/* Hollywood's Witch Hunt!
 *
 * nicolás peña-escarpentier
 * Physical computing - ITP - Fall 2017 */

// serial communication setup
var portName = '/dev/cu.usbmodem1421';
var serial;

// variable initialization
// 		Arduino variables
let button = 0;
let lastButton = 0;
let fire_intensity = 40;
let knob = 200;
// 		image variables
let bg;
let faces = [];
let currFace = 0;
let bodyAnimation, bodySpeed;
//		other game variables
let fireHue = 30;
let fireSat = 85;
let fireBri = 100;
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
	noiseSeed(random(100000));

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
	bodySpeed = 4;
	bodyAnimation.frameDelay = bodySpeed;
}

function draw(){
	background(255);
	image(bg, width/2, height/2);

	// keyboard control
	if(moveLeft){
		knob -= 6;
	} else if (moveRight) {
		knob += 6;
  }
	knob = constrain(knob, 60, width-60);

	// change abuser
	if (button == 1 && lastButton == 0){
		changeAbuser();
	}
	lastButton = button;

	// display
	drawBody(knob, height*.6);
	drawFire();
}

// Process incomming data
function parseData(){
	var inData = serial.readLine();
	if (inData.length > 0){
		var values = inData.split(',');
		// readLine() returns Strings! convert it to int to use it
		button = int(values[0]);
		fire_intensity = int(values[1]); // calibrated value (0-100)
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
	} else if (keyCode == UP_ARROW) {
		fire_intensity += 4;
	} else if (keyCode == DOWN_ARROW) {
		fire_intensity -= 4;
	} if (key == ' ') {
  	changeAbuser();
  }
	fire_intensity = constrain(fire_intensity, 0, 100);
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
	// calculate body shaking
	let distanceFire = abs(posX - 470);
	// bodySpeed = map(distanceFire, 340, 180, 8, 2);
	// bodySpeed = constrain(bodySpeed, 2, 8);
	// bodyAnimation.frameDelay = bodySpeed;

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

	// fire intensity calculations
	let wobble = map(random(), 0, 1, -1, 1)
	let fire_iterations = int( map(fire_intensity, 0, 100, 2, 18) +wobble);
	let fire_alpha = 7 +wobble*0.5;

	// FIRE: set color
	noStroke();
	let fireColor = color(fireHue, fireSat, fireBri, fire_alpha);
	fill(fireColor);
	// FIRE: draw overlapping
	let x_dim = 140;
	let y_dim = 250;
	for (let i = 0; i < fire_iterations; i++) {
		// let x_dim = 140 + i*14;
		// let y_dim = 250 + i*16;
		x_dim += 14;
		y_dim += 16;
		arc(0, 0, x_dim, y_dim, PI+0.02, TWO_PI-0.02);
	}

	// DARKNESS: setup
	let border = 500;
	strokeWeight(border);
	stroke(0, 5);
	noFill();
	// DARKNESS: draw overlaping
	for (let i = 0; i < 24; i++) {
		ellipse(0, 0, x_dim+border, y_dim+border);
		x_dim += 14;
		y_dim += 16;
	}
	// return coordinates
	pop();
}
