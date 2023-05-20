var mySound;
var playStopButton;
var jumpButton;
var sliderVolume;
var sliderRate;
var sliderPan;


var fft;
var shake;

var analyzer;
var linelength;
var spin = 0;
var spin2 = 0
var spinspeed = 0;
var spinforce;
var color;
var noise;

var speed = 0.0;
var bgalpha = 0;
var bgred = 255;
var bgblue = 255;
var circleSize = 0;
var bgcolor;
var defaultcolor;
var rot = 0.0
var overallrot = 0.0;
var middlerot = 0.0;
var overallspin = 0.0;
var secondCircleSize = 0;
var linethickness = 7;
var shape = 'rectangle'
let speechRec;
let continuous = true;
var yspeed = 0;
var x1speed = 0;
var x2speed = 0;
var dirchange = 1;
var ypos = 0;
var x1pos = 0;
var x2pos = 0;
var dirchanged = false;
let interimResults = false;

function preload() {
	soundFormats('wav', 'mp3');
	mySound = loadSound('/assets/Kalte_Ohren_(_Remix_).mp3');
}

function setup() {
	createCanvas(900, 600);
	background(180);
	angleMode(degrees);

	bgcolor = color(bgred, bgblue, 224);
	defaultcolor = color(bgred, bgblue, 224);
	speechRec = new p5.SpeechRec('en-US', changeColor);
	speechRec.start(continuous, interimResults);

	playStopButton = createButton('play');
	playStopButton.position(200, 20);
	playStopButton.mousePressed(playStopSound);
	jumpButton = createButton('jump');
	jumpButton.position(250, 20);
	jumpButton.mousePressed(jumpSong);


	if (typeof Meyda === "undefined") {
		console.log("Meyda is not defined");
	} else {
		analyzer = Meyda.createMeydaAnalyzer({
			"audioContext": getAudioContext(),
			"source": mySound,
			"bufferSize": 512,
			"featureExtractors": [
				"rms",
				"spectralKurtosis",
				"spectralCentroid",
				"spectralSkewness",
				"spectralCrest",
				'loudness',
				"spectralFlatness"
			],
			"callback": features => {
				linelength = map(features.rms * 1000, 0, 300, 0, 100);
				spin = map(features.spectralKurtosis, -300, 300, 0, 720);
				shake = map(features.spectralCrest, -4, 20, 0, 2);
				noise = features.spectralFlatness * 500
				color = map(features.spectralCentroid, -50, 50, 0, 25);
				circleSize = map(features.spectralSkewness, -1, 10, 0, 50);
				overallspin = map(features.spectralCentroid ? features.spectralCentroid : 0, -10, 30, -1, 10);
				speed = map(overallspin, -1, 10, 0, 2);

			}
		})
	}

}

function draw() {
	background(bgcolor);
	// background(bgred, bgblue, 224);
	push()
	fill(color * 7, color + 50 * 7, color * 15);
	for (var i = 0; i < noise; i++) {
		rect(random(0, width), random(0, height), 0.2, 0.2)
	}
	pop()
	push()

	if (x1pos < -150) {
		console.log('hello')
		x1speed *= -1
	} else if (x1pos > 500) {
		x1speed *= -1
	}
	x1pos += x1speed
	translate(width / 4 + x1pos, height / 2 + ypos);
	noFill()
	strokeWeight(5)
	stroke(color * 10, color * 10, color * 10)

	rotate(overallrot * 1)
	if (shape == 'circle') {
		circle(0, 0, circleSize * 5)
	}
	else if (shape == 'rectangle') {
		rect(-circleSize, -circleSize, circleSize * 2, circleSize * 2)
	}
	else if (shape == 'triangle') {
		triangle(-circleSize, circleSize, 0, -circleSize, circleSize, circleSize)
	}
	spinner(1)
	pop()

	push()

	translate(width * 2 / 4, height / 2);
	noFill()
	strokeWeight(5)
	stroke(color * 10, color * 10, color * 10)

	rotate(middlerot / 5)
	// if (shape == 'circle') {
	// 	circle(0, 0, circleSize * 5)
	// }
	// else if (shape == 'rectangle') {
	// 	rect(-circleSize, -circleSize, circleSize * 2, circleSize * 2)
	// }
	// else if (shape == 'triangle') {
	triangle(-circleSize, circleSize, 0, -circleSize, circleSize, circleSize)
	// }
	spinner(0)
	scale(2.0)
	pop()

	push()
	if (-500 > x2pos) {
		x2speed *= -1
	} else if (x2pos > 150) {
		x2speed *= -1
	}
	x2pos += x2speed

	translate(width * 3 / 4 + x2pos, height / 2 - ypos);
	noFill()
	strokeWeight(5)
	stroke(color * 10, color * 10, color * 10)
	rotate(overallrot * -1)
	if (shape == 'circle') {
		circle(0, 0, circleSize * 5)
	}
	else if (shape == 'rectangle') {
		rect(-circleSize, -circleSize, circleSize * 2, circleSize * 2)
	}
	else if (shape == 'triangle') {
		triangle(-circleSize, circleSize, 0, -circleSize, circleSize, circleSize)
	}
	spinner(-1)
	pop()

	// if (overallspin > 15) {
	// 	dirchange *= -1
	// }
	if (linelength > 75) {
		dirchange *= -1
	}

	overallrot += (2 * overallspin * dirchange)
	middlerot += (2 * overallspin * dirchange)

	// console.log(rot +=  overallspin)
	ypos += yspeed
	if (linelength != undefined) {
		if (linelength > 75) {
			if (yspeed == 0) {
				yspeed = 1
			} else {
				yspeed *= -1
			}
		}
	}

	if (ypos > 200) {
		yspeed = -1
	} else if (ypos < -200) {
		yspeed = 1
	}

	if (linelength != undefined) {
		if (linelength > 70) {
			if (x1speed == 0 && x2speed == 0) {
				x1speed = 1
				x2speed = -1
			} else {
				x1speed *= -1
				x2speed *= -1
			}
		}
	}

	x1speed += speed / 200
	x2speed -= speed / 200


}


function spinner(dir) {


	push()
	translate(-width / 10, 0);

	rotate(rot)
	translate(0, 0)
	fill(0, 0, 0)
	push()

	fill(41, 78, 115)
	noStroke()
	circle(0, 0, circleSize)
	fill(bgred, bgblue, 224)
	circle(0, 0, circleSize / 1.01)


	strokeWeight(weight = linethickness)
	if (dir == 1) {
		stroke(color * 7, color * 15, (color + 50) * 7);
		extralength = 1
	}
	else if (dir == -1) {
		stroke(color * 15, color * 7, color * 7);
		extralength = 1
	}
	else {
		stroke(color * 15, color * 7, color * 7);
		extralength = 1

	}

	angleMode(DEGREES);
	rotate(spin * 0.99);
	for (i = 0; i < linelength; i++) {
		fill(30, 30, 255, 200);
		line(0, 0, linelength * extralength, 0)
		line(0, 0, -linelength * extralength, 0)
	}
	pop()
	pop()

	push()
	translate(width / 10, 0);

	rotate(rot)
	translate(0, 0)
	fill(0, 0, 0)
	push()

	fill(41, 78, 115)
	noStroke()
	circle(0, 0, circleSize)
	fill(bgred, bgblue, 224)
	circle(0, 0, circleSize / 1.01)


	strokeWeight(weight = linethickness)

	if (dir == 1) {
		stroke(color * 15, color * 7, color * 7);
	}
	else {
		stroke(color * 7, color * 15, (color + 50) * 7);
	}

	angleMode(DEGREES);
	rotate(spin * 0.99);
	for (i = 0; i < linelength; i++) {
		fill(30, 30, 255, 200);
		line(0, 0, linelength * extralength, 0)
		line(0, 0, -linelength * extralength, 0)
	}

	pop()
	pop()
}

function jumpSong() {
	var dur = mySound.duration();
	var t = random(dur);
	mySound.jump(t);
}

function playStopSound() {
	if (mySound.isPlaying()) {
		analyzer.stop();
		mySound.stop();
		playStopButton.html('play');
		background(180);
	} else {

		analyzer.start();
		mySound.loop()
		playStopButton.html('stop');
	}
}

function changeColor() {

	if (speechRec.resultString === 'Red.') { bgcolor = 'red' }
	else if (speechRec.resultString === 'Green.') { bgcolor = 'green' }
	else if (speechRec.resultString === 'Blue.') { bgcolor = 'blue' }
	else if (speechRec.resultString === 'White.') { bgcolor = 'white' }
	else if (speechRec.resultString === 'Black.') { bgcolor = 'black' }
	else if (speechRec.resultString === 'Default.') { bgcolor = defaultcolor }
	else if (speechRec.resultString === 'Rectangle.') { shape = 'rectangle' }
	else if (speechRec.resultString === 'Circle.') { shape = 'circle' }
	else if (speechRec.resultString === 'Triangle.') { shape = 'triangle' }
}