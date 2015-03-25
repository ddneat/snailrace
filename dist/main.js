(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Game = require("./modules/Game.js").Game;

var game = new Game();

// main only
var renderer;
var views;
var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;
var animationFrameID = null;

// global variables
var scene,
    camera,
    cameraFinish,
    playerSnails = { snails: [] },
    playerCount = 2,
    winner = 0;
var controls,
    devCam = false,
    particles = [];
//slime textures
var slimeTexture = THREE.ImageUtils.loadTexture("img/slime.png");
// set texture properties, repeat
slimeTexture.wrapS = slimeTexture.wrapT = THREE.RepeatWrapping;
slimeTexture.repeat.set(1, 1);
var slimeTextureBegin = THREE.ImageUtils.loadTexture("img/slimeBegin.png");
// set texture properties, repeat
slimeTextureBegin.wrapS = slimeTexture.wrapT = THREE.RepeatWrapping;
slimeTextureBegin.repeat.set(1, 1);

window.onload = function () {
	if (animationFrameID) {
		cancelAnimationFrame(animationFrameID);
	}
	parseLocalStorageData();
	showSettings();
	init();
};
//loads the values from the local storage and writes it to the screen
function parseLocalStorageData() {
	if (localStorage.highscore !== undefined) {
		var storageContent = JSON.parse(localStorage.highscore);

		storageContent.sort(function (a, b) {
			var x = a.time < b.time ? -1 : 1;
			return x;
		});

		for (var i = 0; i < storageContent.length && i < 10; i++) {
			var elem = storageContent[i];
			$("#high").append("<div class=\"highscoreEntry\"><div class=\"highscoreName\">" + (i + 1) + ". " + elem.name + "</div><div class=\"highscoreTime\">" + elem.time + "</div></div>");
		};
	}
}

// set player count by value
function setPlayerCount(amount) {
	$("#playerCount").html(amount);
}
//shows settings
function showSettings() {
	$("#playerAdd").click(function () {
		if (playerCount < 4) {
			setPlayerCount(++playerCount);
		}
	});
	$("#playerRemove").click(function () {
		if (playerCount > 1) {
			setPlayerCount(--playerCount);
		}
	});

	document.getElementById("changecamera").addEventListener("click", changeCamera, false);
}
//change camera
function changeCamera() {
	devCam = !devCam;
	document.getElementById("changecamera").innerHTML = "devCam: " + devCam;
}
//initialize scene
function init() {
	// check if WebGl-rendering is supported, otherwise print message
	if (!Detector.webgl) {
		alert("WebGL is not supported or enabled. Please use a modern Browser.");
		Detector.addGetWebGLMessage();
	}

	// define renderer
	renderer = new THREE.WebGLRenderer({ antialias: true, clearColor: 12708324, clearAlpha: 1 });

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.sortElements = false;

	// shadow settings
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;
	renderer.physicallyBasedShading = true;

	// set render target
	var container = document.createElement("div");
	document.body.appendChild(container);
	container.id = "viewport";
	container.appendChild(renderer.domElement);

	// create scene object, add fog to scene
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2("#c1e9e4", 0.01, 10);

	// camera viewport and configuration, PerspectiveCamera(angle, aspect, near, far)
	camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 100000);
	camera.position.set(10, 10, 10); // set position of the camera
	camera.lastPosition = new THREE.Vector3(10, 10, 10);
	camera.lookAt(new THREE.Vector3(0, 0, 0)); // scene point camera is looking at
	scene.add(camera); // add camera to scene
	//camera for finish screen
	cameraFinish = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 100000);
	cameraFinish.position.set(10, 10, 10); // set position of the camera
	cameraFinish.lastPosition = new THREE.Vector3(10, 10, 10);
	cameraFinish.lookAt(new THREE.Vector3(0, 0, 0)); // scene point camera is looking at
	scene.add(cameraFinish); // add camera to scene

	//views for different viewports at finish
	views = [{
		left: 0,
		bottom: 0,
		width: 1,
		height: 1,
		eye: [10, 10, 10], //x,y,z position of camera
		up: [0, 1, 0], //up vector
		updateCamera: function updateCamera(camera, scene) {
			camera.position = camera.lastPosition;
			camera.lookAt(camera.target);
		}
	}, {
		left: 0,
		bottom: 0.6,
		width: 0.4,
		height: 0.4,
		eye: [0, 10, 0],
		up: [0, 0, 1],
		updateCamera: function updateCamera(camera, scene) {
			// camera.position.set(0,4, playerSnails[winner].position.z-10);

			camera.position.x = camera.position.x * Math.cos(0.1) + Math.sin(0.1);
			camera.position.z = camera.position.z * Math.cos(0.1) - Math.sin(0.1);

			camera.lookAt(playerSnails.snails[winner].position);
		}
	}];

	views[0].camera = camera;
	views[1].camera = cameraFinish;

	// point light, THREE.PointLight(color, density)
	var PointLight = new THREE.PointLight(16777215, 0.2);
	PointLight.position.set(10, 20, -40); // set position of light
	scene.add(PointLight); // add light to scene

	// directional light, THREE.DirectionalLight(color, density)
	var directionalLight = new THREE.DirectionalLight(16777215, 1);
	directionalLight.position.set(10, 20, 10); // set position
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
	controls = new THREE.TrackballControls(camera, renderer.domElement);

	//game parameters
	var FC,
	    MC,
	    GC,
	    floor_width = 10,
	    floor_height = 30,
	    snailSpeed = 0.9,
	    finPosZ = 23;

	// create floors
	FC = new FloorController(createCaption, floor_width, floor_height, finPosZ, scene);

	// load snail and flag models
	console.log(playerSnails);
	MC = new ModelController(scene, finPosZ, floor_width, floor_height, playerSnails);
	// create gameController
	GC = new GameController(FC, MC, createCaption, finPosZ, floor_width, floor_height, snailSpeed, particles, scene, render, playerSnails, playerCount, slimeTexture, slimeTextureBegin, devCam, camera, game, cameraFinish);

	// handling window-resize, 100% height and 100% width
	THREEx.WindowResize(renderer, camera);
}
//creates 3D-texts on the scene
function createCaption(text, height, size, position, rotation, color, opacity, name, lambert, shadow) {
	var material,
	    shape = new THREE.TextGeometry(text, { font: "helvetiker", weight: "normal",
		height: height, style: "normal", size: size, divisions: 1 });
	// set pivot of text to center of object
	THREE.GeometryUtils.center(shape);
	// create material and mesh-object
	if (lambert) material = new THREE.MeshLambertMaterial({ color: color, transparent: true, opacity: opacity });else material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: opacity });

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
function animateParticleSystem() {

	for (var i = 0; i < particles.length; i++) {
		if (particles[i].position.y < -1) {
			particles[i].position.y = 1;
		}
		particles[i].position.y -= 0.1 * Math.random();
	}
}

var render = function render() {
	//free cam
	if (devCam) {
		controls.update();
	}

	if (game.isGameOver) {
		animateParticleSystem();
		//viewports
		for (var k = 0; k < views.length; ++k) {

			view = views[k];
			camera = view.camera;
			view.updateCamera(camera, scene);

			var left = Math.floor(SCREEN_WIDTH * view.left);
			var bottom = Math.floor(SCREEN_HEIGHT * view.bottom);
			var width = Math.floor(SCREEN_WIDTH * view.width);
			var height = Math.floor(SCREEN_HEIGHT * view.height);
			renderer.setViewport(left, bottom, width, height);
			renderer.setScissor(left, bottom, width, height);
			renderer.enableScissorTest(true);

			camera.aspect = width / height;
			camera.updateProjectionMatrix();

			renderer.render(scene, camera);
		}
	}

	// render scene
	if (!game.isGameOver) renderer.render(scene, camera);
	// render-loop
	animationFrameID = requestAnimationFrame(function () {
		render();
	});
};

},{"./modules/Game.js":2}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});
var startTime = 0;
var floor_width;
var winner;
var playerSnails = [{
    position: {
        z: 0
    }
}];
function gameOverScreen() {}
function createCaption() {}
function addParticleSystem() {}
var cameraFinish = {
    position: {
        set: function set() {}
    }
};

var Game = exports.Game = (function () {
    function Game() {
        _classCallCheck(this, Game);

        this.isGameOver = false;
    }

    _createClass(Game, {
        getEndTime: {
            value: function getEndTime() {
                var endTime = (new Date().getTime() - startTime) / 1000; //highscore-time
                endTime.toFixed(3);
                return endTime;
            }
        },
        removeControls: {
            value: function removeControls() {
                // keep movement for 3 seconds enabled
                setTimeout(function () {
                    window.removeEventListener("keyup", checkModelMove, false);
                }, 3000);
            }
        },
        renderChampionText: {
            value: function renderChampionText(winID) {
                // render message in webgl
                var objName = "winner",
                    fontheight = 0.01,
                    fontsize = 1.8,
                    color = 16777215;
                createCaption("CHAMPION 4EVER", fontheight, fontsize, { x: floor_width / 4 * winID + 1.3, y: 0, z: -12 }, { x: -Math.PI / 2, y: 0, z: Math.PI / 2 }, color, 0.9, objName, true, true);
            }
        },
        setGameOverScreen: {
            value: function setGameOverScreen(winID) {
                gameOverScreen(this.getEndTime());
                this.renderChampionText(winID);
                // add ParticleSystem to scene
                addParticleSystem(winID);

                cameraFinish.position.set(1, 4, playerSnails[winID].position.z - 8);
            }
        },
        setGameOver: {
            value: function setGameOver(winID) {
                this.isGameOver = true;

                winner = winID;
                this.setGameOverScreen(winID);
                this.removeControls();
            }
        }
    });

    return Game;
})();

},{}]},{},[1]);
