//Jenny Robertson

//All cells outside the grid are assumed to be dead

//get a reference to the canvas
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

//draw the background colour and grid
draw_grid();


//arrays to hold the before and after evolution states
	var initialState = [
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
		];

	var newState = [
			[1,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
		];


//Function to draw the backround
function draw_grid(){
	
	//draw white background
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,100,100);

	//draw the grid lines
	for (var x = 0.5; x < 101; x += 10) {
  		ctx.moveTo(x, 0);
  		ctx.lineTo(x, 100);
	}

	for (var y = 0.5; y < 101; y += 10) {
 		ctx.moveTo(0, y);
  		ctx.lineTo(100, y);
	}

	ctx.strokeStyle = "#ddd";
	ctx.stroke();
}



//Function to handle clicks on the canvas
	c.onclick = function(e) {
		var rect = this.getBoundingClientRect(),   // get absolute position of canvas
		x = e.clientX - rect.left,             // adjust mouse-position
		y = e.clientY - rect.top;
		
		//draw a black square where the user has clicked
		//done by rounding the to the nearest 10 below it
		ctx.fillStyle = "#000000";
		ctx.fillRect(Math.floor(x/ 10) * 10,Math.floor(y/ 10) * 10,10,10);
		                     
		//set this square to filled in the array
		initialState[Math.floor(y/ 10)][Math.floor(x/ 10)] = 1;
	};


//Function that runs every second
function start(){
	timerId = setInterval(function(){

	//clear out any old drawn squares	
	draw_grid();

	//evolve the initalState and save the result as newState
	newState = evolve(initialState);

	//output the new state to the screen
	outputArray(newState);

	//make the new state the inital state for next time
	initialState = newState;

	}, 1000);
}

//Function that stops the game and resets everything to blank
function reset(){

	stop();

	//redraw the background to clear the drawn squares
	draw_grid();

	//reset the initial state to empty
	initialState = [
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
		];
}

//Function pauses the simulation
function stop(){
	clearInterval(timerId);
}

//Function outputs an array as squares into the canvas
function outputArray(gridState){
	//loop through every cell
	for (i = 0; i < gridState.length; i++) { 
		for (a = 0; a < gridState[0].length; a++) { 

			//if the cell is alive
			if(gridState[i][a] == 1){
				//draw it as black
				ctx.fillStyle = "#000000";
				ctx.fillRect(a*10,i*10,10,10);

			}
		}
	}
}

//GOL functions

function underpopulation(cellState, numberOfLiveNeighbours) {
		if(cellState == 1 && numberOfLiveNeighbours >= 2){
			return 1;
		}
		else{
			return 0;
		}
		
	}

	function overcrowding(cellState, numberOfLiveNeighbours) {
		if(cellState == 1 && numberOfLiveNeighbours > 3){
			return 0;
		}
		else{
			return cellState;
		}
		
	}

	function survival(cellState, numberOfLiveNeighbours) {
		if(cellState == 1 && (numberOfLiveNeighbours == 2 || numberOfLiveNeighbours == 3)){
			return 1;
		}
		else{
			return cellState;
		}
				
	}


	function reproduction(cellState, numberOfLiveNeighbours) {
		if(cellState == 0 && numberOfLiveNeighbours == 3){
			return 1;
		}
		else{
			return cellState;
		}
				
	}

	function evolve(gridState){
		//initialise the newState array to be the same size as the gridState
		//(this allows the grid to be rectangular or square of any size)
		var newState = new Array(gridState.length);

	    for (var i = 0; i < gridState.length; i++) {
	       newState[i] = new Array(gridState[0].length);
	    }
	
	    //iterate through each cell of the grid
		for (i = 0; i < gridState.length; i++) { 
			for (a = 0; a < gridState[0].length; a++) { 

				//stores amount of live neighbours
				var amount = 0; 

				//find the number of live neighbours
				//top left
				if (i > 0 && a > 0)
					amount += gridState[i-1][a-1]; 

				//top
				if (i > 0)
					amount += gridState[i-1][a]; 

				//top right
				if (i > 0 && a < gridState[0].length - 1)
					amount += gridState[i-1][a+1]; 

				//left
				if (a > 0)
					amount += gridState[i][a-1];

				//right
				if (a < gridState[0].length - 1)
					amount += gridState[i][a+1];

				//bottom left
				if (i < gridState.length - 1 && a > 0)
					amount += gridState[i+1][a-1];

				//bottom
				if (i < gridState.length - 1)
					amount += gridState[i+1][a];

				//bottom right
				if (i < gridState.length - 1 && a < gridState[0].length - 1)
					amount += gridState[i+1][a+1];

	
				//apply the first function to the grid value
				newState[i][a] = underpopulation(gridState[i][a], amount);
				//now apply the functions to the new value.
				newState[i][a] = overcrowding(newState[i][a], amount);
				newState[i][a] = survival(newState[i][a], amount);
				newState[i][a] = reproduction(newState[i][a], amount);

			}
		}
	
		return newState;
	}

