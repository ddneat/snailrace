(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Game = require("./modules/Game.js").Game;

var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;

var playerSnails = { snails: [] };

// global variables
var camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 100000),
    cameraFinish,
    playerCount = 2;
var controls,
    devCam = false;

var view = null;
var render = function render() {
	//free cam
	if (devCam) {
		controls.update();
	}

	if (game.isGameOver) {
		game.animateParticleSystem();
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

var scene = new THREE.Scene();
var game = new Game({ scene: scene, camera: camera, render: render, playerSnails: playerSnails, playerCount: playerCount });

$(game).on("game_over", function () {
	removeControls();
});

// main only
var renderer;
var views;

var animationFrameID = null;

window.onload = function () {
	if (animationFrameID) {
		cancelAnimationFrame(animationFrameID);
	}
	parseLocalStorageData();
	showSettings();
	init();

	var startBtn = document.getElementById("startgame");
	startBtn.addEventListener("click", function () {
		game.startGame();
	}, false);
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
	scene.fog = new THREE.FogExp2("#c1e9e4", 0.01, 10);

	// camera viewport and configuration, PerspectiveCamera(angle, aspect, near, far)
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

			camera.lookAt(playerSnails.snails[game.winner].position);
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
	    floor_width = 10,
	    floor_height = 30,
	    snailSpeed = 0.9,
	    finPosZ = 23;

	// create floors
	FC = new FloorController(game, floor_width, floor_height, finPosZ, scene);

	// handling window-resize, 100% height and 100% width
	THREEx.WindowResize(renderer, camera);
}

var removeControls = function removeControls() {
	// keep movement for 3 seconds enabled
	setTimeout(function () {
		window.removeEventListener("keyup", game.checkModelMove, false);
	}, 3000);
};

},{"./modules/Game.js":2}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Models = require("./Models.js").Models;

var Game = exports.Game = (function () {
    function Game(options) {
        _classCallCheck(this, Game);

        this.isGameOver = false;
        this.playerSnails = options.playerSnails;
        this.particles = [];
        this.scene = options.scene;
        this.camera = options.camera;
        this.render = options.render;
        this.startTime;
        this.winner = 0;
        this.playerCount = options.playerCount;
        this.models = new Models({ scene: this.scene, playerSnails: this.playerSnails });
    }

    _createClass(Game, {
        getEndTime: {
            value: function getEndTime() {
                var endTime = (new Date().getTime() - this.startTime) / 1000; //highscore-time
                endTime.toFixed(3);
                return endTime;
            }
        },
        renderChampionText: {
            value: function renderChampionText(winID) {
                // render message in webgl
                var objName = "winner",
                    fontheight = 0.01,
                    fontsize = 1.8,
                    color = 16777215;
                var floor_width = 10;
                this.createCaption("CHAMPION 4EVER", fontheight, fontsize, { x: floor_width / 4 * winID + 1.3, y: 0, z: -12 }, { x: -Math.PI / 2, y: 0, z: Math.PI / 2 }, color, 0.9, objName, true, true);
            }
        },
        addParticleSystem: {
            value: function addParticleSystem(index) {
                console.log("addParticleSytem");
                var materials = [],
                    size;
                size = 0.1; // size of particle
                var x = this.playerSnails.snails[index].position.x;

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
                    this.particles[i] = new THREE.ParticleSystem(geometry, materials[i]);
                    this.particles[i].position.set(x, 1, -26);
                    this.particles[i].sortPosition = true;
                    this.scene.add(this.particles[i]);
                }
            }
        },
        animateParticleSystem: {

            //animates the particle system

            value: function animateParticleSystem() {

                for (var i = 0; i < this.particles.length; i++) {
                    if (this.particles[i].position.y < -1) {
                        this.particles[i].position.y = 1;
                    }
                    this.particles[i].position.y -= 0.1 * Math.random();
                }
            }
        },
        getFirstAndLastSnailPositionZ: {
            value: function getFirstAndLastSnailPositionZ() {
                var min = 10,
                    max = 0,
                    element,
                    z;
                for (var i = 0; i < this.playerSnails.snails.length; i++) {
                    element = this.playerSnails.snails[i];
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
        },
        setCameraInGame: {
            value: function setCameraInGame() {
                var position = this.getFirstAndLastSnailPositionZ();
                var mid = (position.max + position.min) / 2;
                this.camera.target = new THREE.Vector3(0, 0, -mid);
                this.camera.lastPosition = this.camera.position;
                this.camera.lookAt(this.camera.target);
                //camera.translateX(mid / 96);
                this.camera.translateX(mid / 120);
            }
        },
        addSlime: {
            //draws slime for each snail

            value: function addSlime(snailIndex) {
                if (this.playerSnails.snails[snailIndex].slimeCounter % 20 == 0) {
                    var slime;

                    var slimeTexture = THREE.ImageUtils.loadTexture("img/slime.png");
                    // set texture properties, repeat
                    slimeTexture.wrapS = slimeTexture.wrapT = THREE.RepeatWrapping;
                    slimeTexture.repeat.set(1, 1);
                    var slimeTextureBegin = THREE.ImageUtils.loadTexture("img/slimeBegin.png");
                    // set texture properties, repeat
                    slimeTextureBegin.wrapS = slimeTexture.wrapT = THREE.RepeatWrapping;
                    slimeTextureBegin.repeat.set(1, 1);

                    if (this.playerSnails.snails[snailIndex].slimeCounter != 0) {
                        slime = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 2, 1, 1), new THREE.MeshLambertMaterial({ map: slimeTexture, transparent: true, alphaTest: 0.4 }));
                    } else {
                        slime = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 2, 1, 1), new THREE.MeshLambertMaterial({ map: slimeTextureBegin, transparent: true, alphaTest: 0.4 }));
                    }

                    slime.doubleSided = true;
                    slime.receiveShadow = true;
                    slime.position.set(this.playerSnails.snails[snailIndex].position.x, this.playerSnails.snails[snailIndex].position.y + 0.03, this.playerSnails.snails[snailIndex].position.z + 0.8);
                    slime.rotation.set(-(90 * Math.PI / 180), 0, 0);
                    this.scene.add(slime);
                }

                this.playerSnails.snails[snailIndex].slimeCounter++;
            }
        },
        modelMove: {

            //moves models on the scene

            value: function modelMove(snailIndex) {
                // set new position of snail
                // into negativ z-axis
                var snailSpeed = 0.9;
                this.playerSnails.snails[snailIndex].position.z -= snailSpeed;
                this.addSlime(snailIndex);
                // if devCam is not enabled, set camera to new position
                this.setCameraInGame();

                // check if user reached finish
                var halfmodel = 1.3; // model-pivot is center, with halfmodel -> head
                var finPosZ = 23;
                if (Math.abs(this.playerSnails.snails[snailIndex].position.z - halfmodel) >= finPosZ && !this.isGameOver) this.setGameOver(snailIndex);
            }
        },
        checkModelMove: {
            value: function checkModelMove(e) {
                if (e.keyCode == 81 || e.which == 81) {
                    //81 =q
                    this.modelMove(0);
                } else if (e.keyCode == 67 || e.which == 67) {
                    // 67 = c
                    this.modelMove(1);
                } else if (e.keyCode == 78 || e.which == 78) {
                    // 78 = n
                    this.modelMove(2);
                } else if (e.keyCode == 80 || e.which == 80) {
                    // 80 = p
                    this.modelMove(3);
                }
            }
        },
        addUserInput: {
            value: function addUserInput() {
                var _this = this;
                window.addEventListener("keyup", _this.checkModelMove.bind(_this), false);
            }
        },
        createCaption: {

            //creates 3D-texts on the scene

            value: function createCaption(text, height, size, position, rotation, color, opacity, name, lambert, shadow) {
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
                this.scene.add(newObject); // add object to scene
            }
        },
        startGame: {
            value: function startGame() {

                this.models.setPlayerSnails(this.playerCount);
                // set snails, depending on playerCount selected

                // hide lobby with slide effect, duration 1 second
                $("#lobbyContainer").hide("slide", { direction: "up", easing: "easeInCubic" }, 1000);
                // objname = needed for select from scene.children
                var objName = "countdown",
                    fontheight = 1,
                    fontsize = 4,
                    text,
                    color = 16724787;
                // loop to render countdown 5
                // enable user controller on GO!
                var _this = this;
                function counter(n) {
                    (function loop() {
                        if (--n) {
                            // sets value of n -= 1 before check 0 or 1
                            text = n; // set text to current count-value
                            setTimeout(loop, 1000); // recall loop after 0.1 second
                        } else {
                            _this.startTime = new Date().getTime();
                            console.log(_this.startTime);
                            text = "GO!", color = 52224;
                            // enable user controller
                            _this.addUserInput();
                        }
                        // remove old caption
                        _this.scene.remove(_this.scene.getChildByName(objName));
                        // add new caption
                        _this.createCaption(text, fontheight, fontsize, position = { x: -1, y: 2.1, z: -2 }, rotation = { x: 0, y: Math.PI / 2, z: 0 }, color, 1, objName, lambert = true, shadow = { receiveShadow: true, castShadow: true });
                        // this.gameStart = new date.timestamp
                    })();
                }
                counter(5); // start coundown
                this.render(); // start renderer
            }
        },
        submitScore: {

            //writes highscore to local storage

            value: function submitScore() {
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
        },
        gameOverScreen: {
            value: function gameOverScreen(endtime) {
                var _this = this;
                $("#gameOverInput").show(1200);
                $("#playerName").focus(1200);
                $("#timeElapsed").html(endtime + " Sek.");
                $("#highscoreBtn").click(_this.submitScore);
                $("#playerName").keypress(function (e) {
                    if (e.keyCode == 13) {
                        _this.submitScore();
                    }
                });
            }
        },
        setGameOverScreen: {
            value: function setGameOverScreen(winID) {
                this.gameOverScreen(this.getEndTime());
                this.renderChampionText(winID);
                // add ParticleSystem to scene
                this.addParticleSystem(winID);

                //TODO: uncomment after moving camera
                //cameraFinish.position.set(1, 4, this.playerSnails.snails[winID].position.z - 8);
            }
        },
        setGameOver: {
            value: function setGameOver(winID) {
                this.isGameOver = true;

                this.winner = winID;
                this.setGameOverScreen(winID);
                $(this).trigger("game_over");
            }
        }
    });

    return Game;
})();

},{"./Models.js":3}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Models = exports.Models = (function () {
    function Models(options) {
        _classCallCheck(this, Models);

        this.modelsToLoad = 0;
        this.snailModels = [];
        this.playerSnails = options.playerSnails;
        this.scene = options.scene;

        // load flag-model
        this.loadFlag();

        // load different snail-models
        this.loadSnail(new this.snail("snailmodelRed"));
        this.loadSnail(new this.snail("snailmodelBlue"));
        this.loadSnail(new this.snail("snailmodelGreen"));
        this.loadSnail(new this.snail("snailmodelYellow"));
    }

    _createClass(Models, {
        snail: {
            value: function snail(filename) {
                this.pathObj = "models/" + filename + ".obj";
                this.pathMtl = "models/" + filename + ".mtl";
                this.position = { x: 0, y: 0, z: 0 };
            }
        },
        loadSnail: {
            value: function loadSnail(snail) {
                var newModel,
                    trackAmount = 4;
                // calculate single track-width
                var floor_width = 10;
                var trackWidth = floor_width / trackAmount;
                // count up modelsToLoad
                this.modelsToLoad++;
                var loader = new THREE.OBJMTLLoader();
                var _this = this;

                loader.addEventListener("load", function (event) {
                    newModel = event.content;
                    newModel.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                        }
                    });
                    newModel.updateMatrix();
                    newModel.castShadow = true;
                    _this.snailModels.push(newModel); // push to snailModels array
                    _this.loadComplete(); // call on model loaded, userfeedback
                }, false);
                loader.load(snail.pathObj, snail.pathMtl);
            }
        },
        setPlayerSnails: {
            value: function setPlayerSnails(playerCount) {
                for (var i = 0; i < playerCount; i++) {
                    this.setSingleSnail(i);
                }
            }
        },
        setSingleSnail: {
            value: function setSingleSnail(playerNumber) {
                var floor_width = 10;
                var trackWidth = floor_width / 4;
                var newModel = this.snailModels[playerNumber].clone();
                console.log("yyyy");
                newModel.position.x = trackWidth / 2 + trackWidth * playerNumber;
                this.playerSnails.snails.push(newModel);
                this.playerSnails.snails[playerNumber].slimeCounter = 0;
                this.scene.add(newModel);
            }
        },
        loadFlag: {
            value: function loadFlag() {
                var newModel,
                    trackAmount = 4;
                // calculate single track-width
                var floor_width = 10;
                var trackWidth = floor_width / trackAmount;
                // count up modelsToLoad
                this.modelsToLoad++;
                var finPosZ = 23;

                var _this = this;

                var loader = new THREE.OBJMTLLoader();
                loader.addEventListener("load", function (event) {
                    newModel = event.content;
                    newModel.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                        }
                    });
                    newModel.updateMatrix();
                    newModel.scale.set(0.1, 0.1, 0.1);
                    newModel.position.x = trackWidth * trackAmount / 2;
                    newModel.position.z = -finPosZ;
                    _this.scene.add(newModel);
                    _this.loadComplete();
                }, false);
                loader.load("models/flag.obj", "models/flag.mtl");
            }
        },
        loadComplete: {
            value: function loadComplete() {
                this.modelsToLoad--;
                console.log(this.modelsToLoad, "models to load");
                if (this.modelsToLoad <= 0) {
                    // game ready to start, remove loading bar
                    document.getElementById("loadingBar").style.display = "none";
                    // enable start game
                    $("#startgame").removeAttr("disabled").removeClass("btn-disabled");
                }
            }
        }
    });

    return Models;
})();

},{}]},{},[1]);
