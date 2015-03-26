import { Game } from './modules/Game.js';

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

var playerSnails = {snails: []};

// global variables
var camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH/SCREEN_HEIGHT, 0.1, 100000), cameraFinish, playerCount = 2;
var controls, devCam = false;

var view = null;
var render = function render(){
    //free cam
    if(devCam){
        controls.update();
    }

    if(game.isGameOver){
        game.animateParticleSystem();
        //viewports
        for ( var k = 0; k < views.length; ++k ) {

            view = views[k];
            camera = view.camera;
            view.updateCamera( camera, game.scene);

            var left   = Math.floor( SCREEN_WIDTH  * view.left );
            var bottom = Math.floor( SCREEN_HEIGHT * view.bottom );
            var width  = Math.floor( SCREEN_WIDTH  * view.width );
            var height = Math.floor( SCREEN_HEIGHT * view.height );
            renderer.setViewport( left, bottom, width, height );
            renderer.setScissor( left, bottom, width, height );
            renderer.enableScissorTest ( true );

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.render(game.scene, camera);
        }


    }

    // render scene
    if(!game.isGameOver)
        renderer.render(game.scene, camera);
    // render-loop
    animationFrameID = requestAnimationFrame(function(){
        render();
    });
};

var game = new Game({camera: camera, render: render, playerSnails: playerSnails, playerCount: playerCount});

$(game).on('game_over', function() {
    removeControls();
});

// main only
var renderer;
var views;

var animationFrameID = null;



window.onload = function(){
	if(animationFrameID){
		cancelAnimationFrame(animationFrameID);
	}
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

	document.getElementById("changecamera").addEventListener('click', changeCamera, false);
}
//change camera
function changeCamera(){
	devCam = !devCam;
	document.getElementById("changecamera").innerHTML = "devCam: " + devCam;
}
//initialize scene
function init(){
	// check if WebGl-rendering is supported, otherwise print message
	if (!Detector.webgl){
		alert("WebGL is not supported or enabled. Please use a modern Browser.");
		Detector.addGetWebGLMessage();
	}

	// define renderer
	renderer = new THREE.WebGLRenderer( {antialias: true, clearColor: 0xc1e9e4, clearAlpha: 1 } );

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.sortElements = false;

	// shadow settings
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
	renderer.physicallyBasedShading = true;

	// set render target
	var container = document.createElement( 'div' );
	document.body.appendChild( container );
	container.id = 'viewport';
	container.appendChild( renderer.domElement );

	// create scene object, add fog to scene
	game.scene.fog = new THREE.FogExp2("#c1e9e4", 0.01, 10);
	
	// camera viewport and configuration, PerspectiveCamera(angle, aspect, near, far)
	camera.position.set(10, 10, 10); // set position of the camera
	camera.lastPosition = new THREE.Vector3(10,10,10);
	camera.lookAt(new THREE.Vector3(0,0,0)); // scene point camera is looking at
	game.scene.add(camera); // add camera to scene
	//camera for finish screen
	cameraFinish = new THREE.PerspectiveCamera(45, SCREEN_WIDTH/SCREEN_HEIGHT, 0.1, 100000);
	cameraFinish.position.set(10, 10, 10); // set position of the camera
	cameraFinish.lastPosition = new THREE.Vector3(10,10,10);
	cameraFinish.lookAt(new THREE.Vector3(0,0,0)); // scene point camera is looking at
	game.scene.add(cameraFinish); // add camera to scene

	//views for different viewports at finish
	views = [
				{ 
					left: 0,
					bottom: 0,
					width: 1.0,
					height: 1.0,
					eye: [ 10, 10, 10 ],//x,y,z position of camera
					up: [ 0, 1, 0 ],//up vector
					updateCamera: function ( camera ) {
					  camera.position = camera.lastPosition;
					  camera.lookAt( camera.target );
					}
				},
				{ 
					left: 0,
					bottom: 0.6,
					width: 0.4,
					height: 0.4,
					eye: [ 0, 10, 0 ],
					up: [ 0, 0, 1 ],
					updateCamera: function ( camera) {
					  	// camera.position.set(0,4, playerSnails[winner].position.z-10);

					  	camera.position.x = camera.position.x * Math.cos(0.1) + Math.sin(0.1);
						camera.position.z = camera.position.z * Math.cos(0.1) - Math.sin(0.1);

					 	camera.lookAt( playerSnails.snails[game.winner].position );
					}
				}
			];

	
		views[0].camera = camera;
		views[1].camera = cameraFinish;
	

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
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	
	//game parameters
	var FC, floor_width = 10, floor_height = 30, snailSpeed = 0.9, finPosZ = 23;

	// create floors
	FC = new FloorController(game, floor_width, floor_height, finPosZ, game.scene);

	// handling window-resize, 100% height and 100% width
	THREEx.WindowResize(renderer, camera);
}





var removeControls = function() {
    // keep movement for 3 seconds enabled
    setTimeout(function(){
        window.removeEventListener('keyup', game.checkModelMove, false);
    }, 3000);
};