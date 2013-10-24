function gameController(webgl){
	var startBtn = document.getElementById("startgame");
	startBtn.addEventListener('click', startGame, false);

	function startGame(){
		// hide lobby with slide effect, duration 1 second
		$('#lobbyContainer').hide("slide", {direction:"up", easing: 'easeInCubic'}, 1000 );
		// objname = needed for select from scene.children
		var objName = "countdown", fontheight = 1, fontsize = 4, text, color = 0xff3333;
		// loop to render countdown 5
		// enable user controller on GO!
		function counter(n) {
			(function loop() {
				if (--n) { // sets value of n -= 1 before check 0 or 1
					text = n; // set text to current count-value
					setTimeout(loop, 1000); // recall loop after 1 second
				}
				else{
					text = "GO!", color = 0x00CC00;
					// enable user controller
					addUserInput();
				}
				// remove old caption
				scene.remove(scene.getChildByName(objName));
				// add new caption
				createCaption(text, fontheight, fontsize,
					position = { x: -1, y: 2.1, z: -2 },
					rotation = { x: 0, y: Math.PI / 2, z: 0 },
					color, 1, objName, lambert = true,
					shadow = { receiveShadow: true, castShadow: true });
		    })();
		}
		counter(5); // start coundown
		render(); // start renderer
	}

	function addUserInput(){
		window.addEventListener('keyup', checkModelMove, false);
	}

	function checkModelMove(e){
	    if (e.keyCode == 32 || e.which == 32){
	    	modelMove(0);
	    }
	    else if (e.keyCode == 13 || e.which == 13){
	    	modelMove(1);
	    }
	}

	function modelMove(snailIndex){
		// snailModels[snailIndex].position.z -= 1;
		var player = playerSnails[snailIndex];
		// set new position of snail
		// into negativ z-axis
		player.position.z -= snailSpeed;

		// if devCam is not enabled, set camera to new position
		if(!devCam)
			setCameraInGame();

		// check if user reached finish
		var halfmodel = 1.3; // model-pivot is center, with halfmodel -> head
		if(Math.abs(player.position.z - halfmodel) >= finPosZ && !gameOver)
			setGameOver(snailIndex);

		function setCameraInGame(){
			var position = getFirstAndLastSnailPositionZ();
			var mid = (position.max + position.min) / playerCount;
			camera.lookAt(new THREE.Vector3(0,0,-mid));
			camera.translateX(mid / 96);
			// camera.translateX(mid / 32);

			function getFirstAndLastSnailPositionZ(){
				var min = 10, max = 0, element, z;
				for(var i = 0; i < playerSnails.length; i++){
					element = playerSnails[i];
					z = Math.abs(element.position.z);
					if(z < min){ min = z; }
					if(z > max){ max = z; }
				}
				return {min: min, max: max};
			}
		}
	}

	function setGameOver(winner){
		gameOver = true;
		console.log("snail on track" + winner+1 + " won");
		// render message in webgl
		var text = "CHAMPION 4EVER";
		var objName = "winner", fontheight = 0.01, fontsize = 1.8, color = 0xFFFFFF;
		webgl.createCaption(text, fontheight, fontsize,
			position = { x: floor_width / 4 * winner, y: 0.01, z: -12 },
			rotation = { x: - Math.PI / 2, y: 0, z: Math.PI / 2 },
			color, 0.8, objName, lambert = true, shadow = true);
		// keep movement for 3 seconds enabled
		function removeControlls(){
			window.removeEventListener('keyup', checkModelMove, false);
		}
		setTimeout(removeControlls, 3000);
	}
}