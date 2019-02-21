"use strict";

(function() {

	var CANVAS_HEIGHT = 400;
	var CANVAS_WIDTH = 400;
	var MAX_X = 10;
	var MAX_Y = 10;

	var clickedCount = 0;
	var endAnimate = false;
	var clickReport = [];


	function initial() {
		//fill scene with a canvas with specific height and width .
		fillScene();
		var square = document.querySelectorAll(".square");
		for (var i = square.length - 1; i >= 0; i--) {
			square[i].onclick = animate;
		}
		var endButton = document.getElementById("end");
		endButton.onclick = end;
	}

	//Create an canvas with 
	function fillScene() {
		var canvasArea = document.getElementById("canvas");
		canvasArea.style.height = CANVAS_HEIGHT + "px";
		canvasArea.style.width = CANVAS_WIDTH + "px";
		//canvasArea.style.backgroundColor = "grey";

		var xPixel = CANVAS_WIDTH / MAX_X; //number of pixel in width of each square
		var yPixel = CANVAS_HEIGHT / MAX_Y; //number of pixel in height of each square

		var xPosition = 0;
		var yPosition = 0;
		for (var j = 1; j <= MAX_Y; j++){
			xPosition = 0;
			for (var i = 1; i <= MAX_X; i++){
				var square = document.createElement("div");
				square.classList.add("square");
				square.id = i + " " + j;

				square.style.top = yPosition + 'px';
				square.style.left = xPosition + 'px';

				square.style.height = yPixel;
				square.style.width = xPixel;

				canvasArea.appendChild(square);
				xPosition += xPixel;
			}
			yPosition += yPixel;
		}

	}

	function animate() {
		if (!endAnimate) {
			//click a checked point will again mark black
			if (this.classList.contains("checkedSquare")) {
				this.classList.remove("checkedSquare");
			}
			this.classList.add("clickedSquare");
			clickedCount++;
			var position = this.id.split(" ");
			var xValue = parseInt(position[0]);
			var yValue = parseInt(position[1]);

			var point = {x: xValue, y: yValue};
			clickReport.push(point);
			console.log(point);

			
			//ajax pass x, y to python
			//var $SCRIPT_ROOT = {{request.script_root|tojson|safe}};

            $.ajax({
            	type: "POST",
	            url: "/task.py",
	            dataType: "json",
	            data : {
	            	//"clickedCount" : clickedCount,
                    "clickedX" : xValue, 
                    "clickedY": yValue,
	        	},
                error: function( XMLResponse ) {
                    alert( XMLResponse.responseText )
                },
                success : function ( data, textStatus ) {
       				markCheckedPoint(data.contains, data.postX, data.postY);
                }
             } );

			// var checkedX = xValue + 1;
			// var checkedY = yValue - 1;
			// if (checkedX <= 10 && checkedY > 0) {
			// 	//mark the point (X+1, Y-1) on the grid with a red dot
			// 	markCheckedPoint(checkedX, checkedY);

			// } else {
			// 	console.log("( " + checkedX + " , " + checkedY + " ) is not accessible");
			// }

		}

	}

	function markCheckedPoint(contains, x, y){
		if (contains == 0) {
			console.log("( " + checkedX + " , " + checkedY + " ) is not accessible");
		} else {
			var nextPoint = document.getElementById(x + " " + y);
			nextPoint.classList.add("checkedSquare");			
		}

	}


	function end() {
		endAnimate = true;
	}

	window.onload = initial;
})();