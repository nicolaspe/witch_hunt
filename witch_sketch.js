/* Hollywood's Witch Hunt!
 *
 * nicolás peña-escarpentier
 * Physical computing - ITP - Fall 2017 */

// serial communication setup
var portName = '/dev/cu.usbmodem1421';
var serial;

// game variables
var button = 0;
var lastButton = 0;
var fire_intensity = 0;
var knob = 200;
var faces = [];
var currFace = 0;
var bodyAnimation;

function preload(){
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
	createCanvas(windowWidth, windowHeight);
	noStroke();
	imageMode(CENTER);

	// initialize serial communication
	serial = new p5.SerialPort();
	serial.open(portName);
	serial.on('data', parseData);			// function to read incomming data
	serial.on('error', serialError);	// function to catch errors

	// load and create body sprite animation
	bodyAnimation.frameDelay = 10;
}

function draw(){
	background(knob);
	if (button == 1 && lastButton == 0){
		fill(0);
		ellipse(width/2, height/2, 200, 200);
	}
	lastButton = button;

	drawBody(mouseX, mouseY);
}

// Process incomming data
function parseData(){
	var inData = serial.readLine();
	if (inData.length > 0){
		var values = inData.split(',');
		// readLine() returns Strings! convert it to int to use it
		button = int(values[0]);
		fire_intensity = map(int(values[1]), 0, 1023, 0, 100);
		knob = map(int(values[2]), 0, 1023, 0, 255);
	}
}
function serialError(err){
	// console.log("ERROR:",err);
}

// display the body, centered at (posX, posY)
function drawBody(posX, posY){
	// change coordinates
	push();
	translate(posX, posY);
	animation(bodyAnimation, 0, 0, 20, 20);
	image(faces[currFace], 0, -400);

	//return to coordinates
	pop();
}
