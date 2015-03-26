import { Game } from './modules/Game.js';

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

var playerSnails = {snails: []};

// global variables
var camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH/SCREEN_HEIGHT, 0.1, 100000), playerCount = 2;
var controls;

var game = new Game({camera: camera, playerSnails: playerSnails, playerCount: playerCount});

$(game).on('game_over', function() {
    removeControls();
});




window.onload = function(){
	//if(animationFrameID){
	//	cancelAnimationFrame(animationFrameID);
	//}
	parseLocalStorageData();
	showSettings();
	init();


    var startBtn = document.getElementById("startgame");
    startBtn.addEventListener('click', function(){
        game.startGame();
    }, false);


};
//loads the values from the local storage and writes it to the screen
function parseLocalStorageData(){
	if(localStorage['highscore'] !== undefined){
		var storageContent = JSON.parse(localStorage['highscore']);

		storageContent.sort(function(a,b){ 
		    var x = a.time < b.time? -1:1; 
		    return x; 
		});
		
		for (var i = 0; i < storageContent.length && i < 10; i++) {
			var elem = storageContent[i];
			$('#high').append('<div class="highscoreEntry"><div class="highscoreName">'+(i+1)+'. '+elem.name+'</div><div class="highscoreTime">'+elem.time+'</div></div>');
		};
	}
	
}

// set player count by value
function setPlayerCount(amount){
	$("#playerCount").html(amount);
}
//shows settings
function showSettings(){
	$("#playerAdd").click(function() {
		if(playerCount < 4){
			setPlayerCount(++playerCount);
		}
	});
	$("#playerRemove").click(function() {
		if(playerCount > 1){
			setPlayerCount(--playerCount);
		}
	});

}

//initialize scene
function init(){
	// check if WebGl-rendering is supported, otherwise print message
	if (!Detector.webgl){
		alert("WebGL is not supported or enabled. Please use a modern Browser.");
		Detector.addGetWebGLMessage();
	}


	// set render target
	var container = document.createElement( 'div' );
	document.body.appendChild( container );
	container.id = 'viewport';
	container.appendChild( game.renderer.domElement );

	// create scene object, add fog to scene
	game.scene.fog = new THREE.FogExp2("#c1e9e4", 0.01, 10);
	
	// camera viewport and configuration, PerspectiveCamera(angle, aspect, near, far)
	camera.position.set(10, 10, 10); // set position of the camera
	camera.lastPosition = new THREE.Vector3(10,10,10);
	camera.lookAt(new THREE.Vector3(0,0,0)); // scene point camera is looking at
	game.scene.add(camera); // add camera to scene
	//camera for finish screen


	// point light, THREE.PointLight(color, density)
	var PointLight = new THREE.PointLight(0xffffff, 0.2);
	PointLight.position.set(10,20,-40); // set position of light
  	game.scene.add(PointLight); // add light to scene
      
	// directional light, THREE.DirectionalLight(color, density)
	var directionalLight  = new THREE.DirectionalLight(0xffffff, 1.0);
	directionalLight.position.set(10,20,10); // set position
	// shadow settings
	directionalLight.shadowDarkness = 0.7;
	directionalLight.shadowCameraRight = 30;
	directionalLight.shadowCameraLeft = -30;
	directionalLight.shadowCameraTop = 30;
	directionalLight.shadowCameraBottom = -30;
	directionalLight.shadowCameraNear = 1;
	directionalLight.shadowCameraFar = 60;
	// enable light is casting shadow
	directionalLight.castShadow = true;
	game.scene.add(directionalLight); // add light to scene

	// dev-cam, free-cam
	controls = new THREE.TrackballControls( camera, game.renderer.domElement );
	
	//game parameters
	var FC, floor_width = 10, floor_height = 30, snailSpeed = 0.9, finPosZ = 23;

	// create floors
	FC = new FloorController(game, floor_width, floor_height, finPosZ, game.scene);

	// handling window-resize, 100% height and 100% width
	THREEx.WindowResize(game.renderer, camera);
}





var removeControls = function() {
    // keep movement for 3 seconds enabled
    setTimeout(function(){
        window.removeEventListener('keyup', game.checkModelMove, false);
    }, 3000);
};