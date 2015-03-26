/*********************************
project snailrace - computer graphics
by David Neubauer and Joscha Probst
University of Applied Sciences Salzburg
********************************/

"use strict";

function GameController(floorController, modelController, createCaption, finPosZ, floor_width, floor_height, snailSpeed, particles) {

	function addUserInput() {
		window.addEventListener("keyup", checkModelMove, false);
	}
	//user input
	function checkModelMove(e) {
		if (e.keyCode == 81 || e.which == 81) {
			//81 =q
			modelMove(0);
		} else if (e.keyCode == 67 || e.which == 67) {
			// 67 = c
			modelMove(1);
		} else if (e.keyCode == 78 || e.which == 78) {
			// 78 = n
			modelMove(2);
		} else if (e.keyCode == 80 || e.which == 80) {
			// 80 = p
			modelMove(3);
		}
	}
	//moves models on the scene
	function modelMove(snailIndex) {
		// snailModels[snailIndex].position.z -= 1;
		var player = playerSnails[snailIndex];
		// set new position of snail
		// into negativ z-axis
		player.position.z -= snailSpeed;
		addSlime();
		// if devCam is not enabled, set camera to new position
		if (!devCam) setCameraInGame();

		// check if user reached finish
		var halfmodel = 1.3; // model-pivot is center, with halfmodel -> head
		if (Math.abs(player.position.z - halfmodel) >= finPosZ && !gameOver) setGameOver(snailIndex);
		//camera movement
		function setCameraInGame() {
			var position = getFirstAndLastSnailPositionZ();
			var mid = (position.max + position.min) / 2;
			camera.target = new THREE.Vector3(0, 0, -mid);
			camera.lastPosition = camera.position;
			camera.lookAt(camera.target);
			//camera.translateX(mid / 96);
			camera.translateX(mid / 120);

			function getFirstAndLastSnailPositionZ() {
				var min = 10,
				    max = 0,
				    element,
				    z;
				for (var i = 0; i < playerSnails.length; i++) {
					element = playerSnails[i];
					z = Math.abs(element.position.z);
					if (z < min) {
						min = z;
					}
					if (z > max) {
						max = z;
					}
				}
				return { min: min, max: max };
			}
		}
		//draws slime for each snail
		function addSlime() {
			if (player.slimeCounter % 20 == 0) {
				if (player.slimeCounter != 0) {
					var slime = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 2, 1, 1), new THREE.MeshLambertMaterial({ map: slimeTexture, transparent: true, alphaTest: 0.4 }));
				} else {
					var slime = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 2, 1, 1), new THREE.MeshLambertMaterial({ map: slimeTextureBegin, transparent: true, alphaTest: 0.4 }));
				}

				slime.doubleSided = true;
				slime.receiveShadow = true;
				slime.position.set(player.position.x, player.position.y + 0.03, player.position.z + 0.8);
				slime.rotation.set(-(90 * Math.PI / 180), 0, 0);
				scene.add(slime);
			}

			player.slimeCounter++;
		}
	}

	function setGameOver(winID) {
		gameOver = true;
		winner = winID;
		endTime = (new Date().getTime() - startTime) / 1000; //highscore-time
		endTime.toFixed(3);
		gameOverScreen(endTime);
		console.log("snail on track" + (winID + 1) + " won");
		// render message in webgl
		var text = "CHAMPION 4EVER";
		var objName = "winner",
		    fontheight = 0.01,
		    fontsize = 1.8,
		    color = 16777215;
		createCaption(text, fontheight, fontsize, position = { x: floor_width / 4 * winID + 1.3, y: 0, z: -12 }, rotation = { x: -Math.PI / 2, y: 0, z: Math.PI / 2 }, color, 0.9, objName, lambert = true, shadow = true);

		// add ParticleSystem to scene
		addParticleSystem(winID);

		cameraFinish.position.set(1, 4, playerSnails[winID].position.z - 8);

		// keep movement for 3 seconds enabled
		function removeControlls() {
			window.removeEventListener("keyup", checkModelMove, false);
		}
		setTimeout(removeControlls, 3000);
	}
	//name-input for highscore
	function gameOverScreen(endtime) {
		$("#gameOverInput").show(1200);
		$("#playerName").focus(1200);
		$("#timeElapsed").html(endtime + " Sek.");
		$("#highscoreBtn").click(submitScore);
		$("#playerName").keypress(function (e) {
			if (e.keyCode == 13) {
				submitScore();
			}
		});
		//writes highscore to local storage
		function submitScore() {
			var name = $("#playerName").val();
			var highscoreEntry = { name: name, time: endtime };
			if (localStorage.highscore !== undefined) {
				var oldStorage = localStorage.highscore;
				var length = oldStorage.length;
				var substring = oldStorage.substring(1, length - 1);
				oldStorage = "[" + substring + "," + JSON.stringify(highscoreEntry) + "]";
				localStorage.highscore = oldStorage;
			} else {
				localStorage.highscore = "[" + JSON.stringify(highscoreEntry) + "]";
			}

			$("#gameOverInput").hide();

			$("#lobbyContainer").show("slide", { direction: "up", easing: "easeInCubic" }, 1000);
			window.location.reload();
		}
	}

	function addParticleSystem(index) {
		var materials = [],
		    size;
		size = 0.1; // size of particle
		var x = playerSnails[index].position.x;

		for (var i = 0; i < 15; i++) {
			var geometry = new THREE.Geometry();
			// add particle to particle system
			var amount = 1200;
			for (var j = 0; j < amount; j++) {

				var vertex = new THREE.Vector3();
				vertex.x = Math.random() * 2 - 1;
				vertex.y = Math.random() * 15 - 1;
				vertex.z = Math.random() * 30 - 1;
				vertex.velocity = new THREE.Vector3(0, -1, 0);
				geometry.vertices.push(vertex);
			}

			materials[i] = new THREE.ParticleBasicMaterial({ size: size });
			var randomColor = "#000000".replace(/0/g, function () {
				return (~ ~(Math.random() * 16)).toString(16);
			});
			materials[i].color = new THREE.Color(randomColor);
			particles[i] = new THREE.ParticleSystem(geometry, materials[i]);
			particles[i].position.set(x, 1, -26);
			particles[i].sortPosition = true;

			scene.add(particles[i]);
		}
	}
}