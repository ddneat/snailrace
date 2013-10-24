/*********************************
project snailrace - computer graphics
by David Neubauer and Joscha Probst
University of Applied Sciences Salzburg
********************************/

function modelController(scene, snailModels, finPosZ, floor_width, floor_height){

	function snail(filename, position){
		this.pathObj = "models/" + filename + ".obj";
		this.pathMtl = "models/" + filename + ".mtl";
		this.position = {x: 0, y: 0, z: 0};
	}

	// load flag-model
	loadFlag();

	// load diffrent snail-models
	loadSnail(new snail("snailmodelRed"));
	loadSnail(new snail("snailmodelBlue"));
	loadSnail(new snail("snailmodelGreen"));
	loadSnail(new snail("snailmodelYellow"));

	function loadSnail(snail, newModel){
		var newModel, trackAmount = 4;
		// calculate single track-width
		var trackWidth = floor_width / trackAmount;
		// count up modelsToLoad
		modelsToLoad++;
		var loader = new THREE.OBJMTLLoader();
		loader.addEventListener('load', function (event){
			newModel = event.content;
			newModel.traverse( function ( child ) {
			    if ( child instanceof THREE.Mesh ) {
			        child.castShadow = true;
			    }
			} );
			newModel.updateMatrix();
			newModel.castShadow = true;
			snailModels.push(newModel); // push to snailModels array
			loadComplete(); // call on model loaded, userfeedback
		}, false);
		loader.load(snail.pathObj, snail.pathMtl);
	}
	//set the snails on the map
	modelController.prototype.setPlayerSnails = function(playerCount){
		for(var i=0; i < playerCount; i++){
			setSingleSnail(i);
		}
	}

	function setSingleSnail(playerNumber){
		var trackWidth = floor_width / 4;
		var newModel = snailModels[playerNumber].clone();
		newModel.position.x = trackWidth / 2 + trackWidth * playerNumber;
		playerSnails.push(newModel);
		playerSnails[playerNumber].slimeCounter = 0;
		scene.add(newModel);
	}

	function loadFlag(){
		var newModel, trackAmount = 4;
		// calculate single track-width
		var trackWidth = floor_width / trackAmount;
		// count up modelsToLoad
		modelsToLoad++;

		var loader = new THREE.OBJMTLLoader();
		loader.addEventListener('load', function (event){
			newModel = event.content;
			newModel.traverse( function ( child ) {
			    if ( child instanceof THREE.Mesh ) {
			        child.castShadow = true;
			    }
			} );
			newModel.updateMatrix();
			newModel.scale.set(0.1,0.1,0.1);
			newModel.position.x = trackWidth * trackAmount / 2;
			newModel.position.z = -(finPosZ);
			scene.add(newModel);
			loadComplete();
		}, false);
		loader.load("models/flag.obj", "models/flag.mtl");
	}

	function loadComplete(){
		modelsToLoad--;
		console.log(modelsToLoad, "models to load");
		if(modelsToLoad <= 0){ // game ready to start, remove loading bar
			document.getElementById("loadingBar").style.display = "none";
			// enable start game
			$("#startgame").removeAttr("disabled").removeClass('btn-disabled');
			
		}
	}
}