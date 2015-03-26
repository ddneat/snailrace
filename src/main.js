import { Game } from './modules/Game.js';
import { Models } from './modules/Models.js';



var playerSnails = {snails: []};

// global variables
var camera, cameraFinish, playerCount = 2, winner = 0;
var controls, devCam = false, particles = {particles: []};


var scene = new THREE.Scene();
var game = new Game();
var models = new Models({ scene: scene, playerSnails: playerSnails });

$(game).on('game_over', function() {
    removeControls();
});

// main only
var renderer;
var views;
var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
var animationFrameID = null;
var GC;



window.onload = function(){
	if(animationFrameID){
		cancelAnimationFrame(animationFrameID);
	}
	parseLocalStorageData();
	showSettings();
	init();


    var startBtn = document.getElementById("startgame");
    startBtn.addEventListener('click', function(){
        console.log(GC);
        models.setPlayerSnails(playerCount);
        GC.startGame();
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
	scene.fog = new THREE.FogExp2("#c1e9e4", 0.01, 10);
	
	// camera viewport and configuration, PerspectiveCamera(angle, aspect, near, far)
	camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH/SCREEN_HEIGHT, 0.1, 100000);
	camera.position.set(10, 10, 10); // set position of the camera
	camera.lastPosition = new THREE.Vector3(10,10,10);
	camera.lookAt(new THREE.Vector3(0,0,0)); // scene point camera is looking at
	scene.add(camera); // add camera to scene
	//camera for finish screen
	cameraFinish = new THREE.PerspectiveCamera(45, SCREEN_WIDTH/SCREEN_HEIGHT, 0.1, 100000);
	cameraFinish.position.set(10, 10, 10); // set position of the camera
	cameraFinish.lastPosition = new THREE.Vector3(10,10,10);
	cameraFinish.lookAt(new THREE.Vector3(0,0,0)); // scene point camera is looking at
	scene.add(cameraFinish); // add camera to scene

	//views for different viewports at finish
	views = [
				{ 
					left: 0,
					bottom: 0,
					width: 1.0,
					height: 1.0,
					eye: [ 10, 10, 10 ],//x,y,z position of camera
					up: [ 0, 1, 0 ],//up vector
					updateCamera: function ( camera, scene) {
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
					updateCamera: function ( camera, scene) {
					  	// camera.position.set(0,4, playerSnails[winner].position.z-10);

					  	camera.position.x = camera.position.x * Math.cos(0.1) + Math.sin(0.1);
						camera.position.z = camera.position.z * Math.cos(0.1) - Math.sin(0.1);

					 	camera.lookAt( playerSnails.snails[winner].position );
					}
				}
			];

	
		views[0].camera = camera;
		views[1].camera = cameraFinish;
	

	// point light, THREE.PointLight(color, density)
	var PointLight = new THREE.PointLight(0xffffff, 0.2);
	PointLight.position.set(10,20,-40); // set position of light
  	scene.add(PointLight); // add light to scene
      
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
	scene.add(directionalLight); // add light to scene

	// dev-cam, free-cam
	controls = new THREE.TrackballControls( camera, renderer.domElement );
	
	//game parameters
	var FC, floor_width = 10, floor_height = 30, snailSpeed = 0.9, finPosZ = 23;

	// create floors
	FC = new FloorController(createCaption, floor_width, floor_height, finPosZ, scene);

	// create gameController
	GC = new GameController(FC, createCaption, finPosZ, floor_width, floor_height, snailSpeed, particles, scene, render, playerSnails, devCam, camera, game, cameraFinish);

	// handling window-resize, 100% height and 100% width
	THREEx.WindowResize(renderer, camera);
}
//creates 3D-texts on the scene
function createCaption(text, height, size, position, rotation, color, opacity, name, lambert, shadow){
	var material, shape = new THREE.TextGeometry(text, { font: 'helvetiker', weight: "normal",
								height: height, style : "normal", size: size, divisions: 1 });
	// set pivot of text to center of object
	THREE.GeometryUtils.center(shape);
	// create material and mesh-object
	if(lambert) material = new THREE.MeshLambertMaterial({color: color, transparent: true, opacity: opacity});
	else material = new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: opacity});

	var newObject = new THREE.Mesh(shape, material);
	newObject.name = name;

	newObject.castShadow = shadow.castShadow;
	newObject.receiveShadow = shadow.receiveShadow;

	// alternative to newObject.rotation is to use THREE.Matrix
	// newObject.applyMatrix(new THREE.Matrix4().makeRotationZ( Math.PI / 2 ))
	// newObject.applyMatrix(new THREE.Matrix4().makeRotationX( - Math.PI / 2 ));
	newObject.rotation = rotation;
	newObject.position.set(position.x, position.y, position.z);
	scene.add(newObject); // add object to scene
}


//animates the particle system
function animateParticleSystem(){
	
	for (var i = 0; i < particles.particles.length; i++) {
		if(particles.particles[i].position.y < -1){
			particles.particles[i].position.y = 1;
		}
		particles.particles[i].position.y -= 0.1*Math.random();
	}
}

var removeControls = function() {
    // keep movement for 3 seconds enabled
    setTimeout(function(){
        window.removeEventListener('keyup', GC.checkModelMove, false);
    }, 3000);
};

var view = null;
var render = function render(){
    //free cam
    if(devCam){
        controls.update();
    }

    if(game.isGameOver){
        animateParticleSystem();
        //viewports
        for ( var k = 0; k < views.length; ++k ) {

            view = views[k];
            camera = view.camera;
            view.updateCamera( camera, scene);

            var left   = Math.floor( SCREEN_WIDTH  * view.left );
            var bottom = Math.floor( SCREEN_HEIGHT * view.bottom );
            var width  = Math.floor( SCREEN_WIDTH  * view.width );
            var height = Math.floor( SCREEN_HEIGHT * view.height );
            renderer.setViewport( left, bottom, width, height );
            renderer.setScissor( left, bottom, width, height );
            renderer.enableScissorTest ( true );

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.render(scene, camera);
        }


    }

    // render scene
    if(!game.isGameOver)
        renderer.render(scene, camera);
    // render-loop
    animationFrameID = requestAnimationFrame(function(){
        render();
    });
}