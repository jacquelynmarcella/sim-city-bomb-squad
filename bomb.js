// Implement reset button functionality
// Change wire image to cut when clicked
// Change background image when timer=0
// Choose winning wire combo (could be tricky to generate wires); randomize winning combo
// If you click on wire once, dont want to click again (so remove click after 1x)
// Assign cut at random

var time = 30;
var interval;
var wireColors = ["blue", "green","red","white","yellow"];
var wires = [];

var removeEventListeners = function() {
	var wireImages = document.querySelectorAll("#box img");
	for (var i = 0; i < wireImages.length; i++) {
		wireImages[i].removeEventListener("click",wireClicked);
	}
}

var reset = function() {
	generateWires();
	addWireEventListeners();

	var counter = document.getElementById("counter"); 
	counter = 30;

	document.getElementById("wintext").style.display = "none";
	document.getElementById("failtext").style.display = "none";

	document.getElementsByTagName("body")[0].classList.remove("exploded"); 
	document.getElementsByTagName("body")[0].classList.add("unexploded"); 

	var wireImages = document.querySelectorAll("#box img");

	for (var i = 0; i < wireImages.length; i++){
		wireImages[i].src = "img/uncut-" + wireImages[i].id + "-wire.png";
	}

	interval = setInterval(tick, 1000); 

	sirenSound = document.getElementById("siren"); 
	sirenSound.play(); 

	console.log('Reset button was clicked');
}

var gameOver = function() {
	//Change text color to red when it hits 0
	counter.style.color = "red"; 

	//Activate losing message
	document.getElementById("failtext").style.display = "block"; 

	//Change background from city to explosion
	document.getElementsByTagName("body")[0].classList.remove("unexploded"); //Body returns an array, want the first and only one
	document.getElementsByTagName("body")[0].classList.add("exploded"); 
	
	//Stop siren and activate explosion sound 1x
	sirenSound.pause();
	var explosionSound = document.getElementById("explosion"); 
	explosionSound.play();

	//Remove all event listeners so that wires aren't clickable
	removeEventListeners();
}

var doneCuttingWires = function() {
	for (var i = 0; i < wires.length; i++) {
		if (wires[i].cut === true) {
			return false;
		} 
		return true;
	}
	removeEventListeners();
}

var wireIsSafe = function(color) {
	for (var i = 0; i < wires.length; i++) {
		if (wires[i].color === color) { //puts the current Id into the equation below
			if (wires[i].cut) {  //checks to see if click is true; if so, make it false as its now cut
				wires[i].cut = false;  
			}
		}
	}
	return true;
}


var tick = function() {
	time -= 1;
	counter.textContent = time; //Add timer countdown to text each time this is run
	if (time <= 0) {
		clearInterval(interval);  //Stop timer when wrong wire is cut or gets to 0
		gameOver();
	}
	else if (time <= 10) {
		counter.style.color = "yellow"; //Text turns yellow when timer hits 10
	}
}

var wireClicked = function() { 
	console.log("The " + this.id + " wire was cut");
	//Switch wire image to cut wire for the wire that was clicked
	this.src = "img/cut-" + this.id + "-wire.png";

	//Play the buzz sound
	var buzzSound = document.getElementById("buzz"); 
	buzzSound.play();

	//Remove the click event
	this.removeEventListener("click",wireClicked);

	//Handle reaction
	if(wireIsSafe(this.id)){ //First is the wire even safe to cut?
		if(doneCuttingWires()){ //If so, are we are done cutting wires?
			clearInterval(interval); //Stops timer
			counter.style.color = "green";  //Sets back to green if it changed

			document.getElementById("wintext").style.display = "block"; //Activate winning message

			sirenSound.pause(); //Stop siren
			var crowdCheerSound = document.getElementById("crowdyay"); 
			var successSound = document.getElementById("success"); 

			crowdCheerSound.addEventListener("ended", function(){ //waits until first sound is done before calling second sound
				success.play();
			});
			crowdCheerSound.play();
			 //Makes all wires not clickable
		}
	} else {
		gameOver();
	}
}

var generateWires = function() {
	console.log("Generating wires");
	for (var i = 0; i < wireColors.length; i++) {
		wires.push({color: wireColors[i], cut: Math.random() > .5}); //Set up with colors and cut as keys to reference later
	}

	//Turn this on if we want to check order of wires to test game:
	console.log("Wires created", wires[0], wires[1], wires[2], wires[3], wires[4], wires[5]);
}

var addWireEventListeners = function() {
	console.log("Adding wire event listeners");
	//Grab all images and add a click event to them:
	var wireImages = document.querySelectorAll("#box img"); //Grab me all the images that are a child of the box div
	//You can see we now have an array of images

	for (var i = 0; i < wireImages.length; i++) { //Loop through all images in array and add event listeners
		wireImages[i].addEventListener("click",wireClicked); 
	}
}

document.addEventListener("DOMContentLoaded", function() {
	//Define key DOM variables
	var counter = document.getElementById("counter"); 
	var failText = document.getElementById("failtext"); 

	//Add event listeners
	document.getElementById('reset').addEventListener('click',reset); 	
	addWireEventListeners();

	//Start the timer
	interval = setInterval(tick, 1000); // Runs counter every 1 second

	//Start siren audio
	sirenSound = document.getElementById("siren"); 
	sirenSound.play(); 

	//Set up the wires
	generateWires();
});

