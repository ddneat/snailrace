/*********************************
project snailrace - computer graphics
by David Neubauer and Joscha Probst
University of Applied Sciences Salzburg
********************************/

function GameController(floorController, createCaption, finPosZ, floor_width, floor_height, snailSpeed, scene, render, playerSnails, devCam, camera, game, cameraFinish){

    var startTime;
    var endTime;


    var slimeTexture = THREE.ImageUtils.loadTexture('img/slime.png');
    // set texture properties, repeat
    slimeTexture.wrapS = slimeTexture.wrapT = THREE.RepeatWrapping;
    slimeTexture.repeat.set(1, 1);
    var slimeTextureBegin = THREE.ImageUtils.loadTexture('img/slimeBegin.png');
    // set texture properties, repeat
    slimeTextureBegin.wrapS = slimeTexture.wrapT = THREE.RepeatWrapping;
    slimeTextureBegin.repeat.set(1, 1);

	function startGame(){
		// set snails, depending on playerCount selected

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
					setTimeout(loop, 1000); // recall loop after 0.1 second
				}
				else{
					startTime = new Date().getTime();
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
					// this.gameStart = new date.timestamp
		    })();
		}
		counter(5.0); // start coundown
		render(); // start renderer
	}

	function addUserInput(){
		window.addEventListener('keyup', checkModelMove, false);
	}
	//moves models on the scene
	function modelMove(snailIndex){
		// set new position of snail
		// into negativ z-axis
		playerSnails.snails[snailIndex].position.z -= snailSpeed;
		addSlime();
		// if devCam is not enabled, set camera to new position
		if(!devCam) setCameraInGame();

		// check if user reached finish
		var halfmodel = 1.3; // model-pivot is center, with halfmodel -> head
		if(Math.abs(playerSnails.snails[snailIndex].position.z - halfmodel) >= finPosZ && !game.isGameOver)
			game.setGameOver(snailIndex);
		//camera movement
		function setCameraInGame(){
			var position = getFirstAndLastSnailPositionZ();
			var mid = (position.max + position.min) / 2;
			camera.target = new THREE.Vector3(0,0,-mid);
			camera.lastPosition = camera.position;
			camera.lookAt(camera.target);
			//camera.translateX(mid / 96);
			camera.translateX(mid / 120);

			function getFirstAndLastSnailPositionZ(){
				var min = 10, max = 0, element, z;
				for(var i = 0; i < playerSnails.snails.length; i++){
					element = playerSnails.snails[i];
					z = Math.abs(element.position.z);
					if(z < min){ min = z; }
					if(z > max){ max = z; }
				}
				return {min: min, max: max};
			}
		}
		//draws slime for each snail
		function addSlime(){
			if(playerSnails.snails[snailIndex].slimeCounter%20 == 0){
				if(playerSnails.snails[snailIndex].slimeCounter != 0){
					var slime = new THREE.Mesh(
						new THREE.PlaneGeometry(0.9, 2, 1, 1),
						new THREE.MeshLambertMaterial({map: slimeTexture, transparent:true, alphaTest: 0.4})
					);
				}else{
					var slime = new THREE.Mesh(
						new THREE.PlaneGeometry(0.9, 2, 1, 1),
						new THREE.MeshLambertMaterial({map: slimeTextureBegin, transparent:true, alphaTest: 0.4})
					);
				}
				
				slime.doubleSided = true;
				slime.receiveShadow = true;
				slime.position.set(playerSnails.snails[snailIndex].position.x, playerSnails.snails[snailIndex].position.y+0.03, playerSnails.snails[snailIndex].position.z+0.8);
				slime.rotation.set(-(90*Math.PI/180), 0, 0);
				scene.add(slime);
			}
			
			playerSnails.snails[snailIndex].slimeCounter++;
		}
	}

	//name-input for highscore
	function gameOverScreen(endtime){
		$('#gameOverInput').show(1200);
		$('#playerName').focus(1200);
		$('#timeElapsed').html(endtime+" Sek.");
		$('#highscoreBtn').click(submitScore);
		$('#playerName').keypress(function(e){
			if(e.keyCode == 13){
				submitScore();
			}
		});
		//writes highscore to local storage
		function submitScore(){
			var name = $('#playerName').val();
			var highscoreEntry = {name: name, time: endtime};
			if(localStorage['highscore'] !== undefined){
				var oldStorage = localStorage['highscore'];
				var length = oldStorage.length;
				var substring = oldStorage.substring(1, length-1);
				oldStorage = "["+substring+","+JSON.stringify(highscoreEntry)+"]";
				localStorage['highscore'] = oldStorage;
			}else{
				localStorage['highscore'] = "["+JSON.stringify(highscoreEntry)+"]";
			}

			$('#gameOverInput').hide();

			$('#lobbyContainer').show("slide", {direction:"up", easing: 'easeInCubic'}, 1000 );
			window.location.reload();
		}
	}

    function checkModelMove(e){
        if (e.keyCode == 81 || e.which == 81){//81 =q
            modelMove(0);
        }
        else if (e.keyCode == 67 || e.which == 67){// 67 = c
            modelMove(1);
        }
        else if (e.keyCode == 78 || e.which == 78){// 78 = n
            modelMove(2);
        }
        else if (e.keyCode == 80 || e.which == 80){// 80 = p
            modelMove(3);
        }
    }

    return {
        checkModelMove: checkModelMove,
        startGame: startGame
    }
}