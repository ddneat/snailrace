(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Game = require("./modules/Game.js").Game;

var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;

// global variables
var camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 100000),
    playerCount = 2;
var controls;

var game = new Game({ camera: camera, playerCount: playerCount });

window.onload = function () {
	//if(animationFrameID){
	//	cancelAnimationFrame(animationFrameID);
	//}
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
}

//initialize scene
function init() {
	// check if WebGl-rendering is supported, otherwise print message
	if (!Detector.webgl) {
		alert("WebGL is not supported or enabled. Please use a modern Browser.");
		Detector.addGetWebGLMessage();
	}

	// set render target
	var container = document.createElement("div");
	document.body.appendChild(container);
	container.id = "viewport";
	container.appendChild(game.renderer.domElement);

	// create scene object, add fog to scene
	game.scene.fog = new THREE.FogExp2("#c1e9e4", 0.01, 10);

	// camera viewport and configuration, PerspectiveCamera(angle, aspect, near, far)
	camera.position.set(10, 10, 10); // set position of the camera
	camera.lastPosition = new THREE.Vector3(10, 10, 10);
	camera.lookAt(new THREE.Vector3(0, 0, 0)); // scene point camera is looking at
	game.scene.add(camera); // add camera to scene
	//camera for finish screen

	// point light, THREE.PointLight(color, density)
	var PointLight = new THREE.PointLight(16777215, 0.2);
	PointLight.position.set(10, 20, -40); // set position of light
	game.scene.add(PointLight); // add light to scene

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
	game.scene.add(directionalLight); // add light to scene

	// dev-cam, free-cam
	controls = new THREE.TrackballControls(camera, game.renderer.domElement);

	// handling window-resize, 100% height and 100% width
	THREEx.WindowResize(game.renderer, camera);
}

},{"./modules/Game.js":4}],2:[function(require,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Floor = require("./Floor.js").Floor;

var Environment = exports.Environment = function Environment(game, floor_width, floor_height, finPosZ) {
    _classCallCheck(this, Environment);

    // soil floor
    var soilSize = { width: floor_height * 20, height: floor_height * 20 };
    var soilPivotCenter = { x: 0, y: 0, z: 0 };
    var soil = new Floor(game.scene, "gras.jpg", soilSize, soilPivotCenter, -0.01, 1, { x: soilSize.width / 5, y: soilSize.height / 5 });
    soil.addPlaneToScene();

    // track floor
    var trackSize = { width: floor_width, height: floor_height };
    var trackPivotCenter = { x: trackSize.width / 2, y: trackSize.height / 2 - 3, z: 0 };
    var track = new Floor(game.scene, "floor_comic.jpg", trackSize, trackPivotCenter, 0, 1, { x: trackSize.width / 5, y: trackSize.height / 5 });
    track.addPlaneToScene();

    // add start and finish-lines
    var opacity = 0.7,
        linePivotCenter,
        lineSize = { width: floor_width, height: 0.3 };
    // start: front snale
    linePivotCenter = { x: lineSize.width / 2, y: lineSize.height / 2 - 3, z: 0 };
    var startCaptionFront = new Floor(game.scene, "", lineSize, linePivotCenter, 0.01, opacity, { x: lineSize.width / 5, y: lineSize.height / 5 });
    startCaptionFront.addPlaneToScene();
    // start: behind snail
    linePivotCenter = { x: lineSize.width / 2, y: lineSize.height / 2 + 1, z: 0 };
    var startCaptionBehind = new Floor(game.scene, "", lineSize, linePivotCenter, 0.01, opacity, { x: lineSize.width / 5, y: lineSize.height / 5 });
    startCaptionBehind.addPlaneToScene();

    // finish
    linePivotCenter = { x: lineSize.width / 2, y: finPosZ, z: 0 };
    var finishLine = new Floor(game.scene, "", lineSize, linePivotCenter, 0.01, opacity, { x: lineSize.width / 5, y: lineSize.height / 5 });
    finishLine.addPlaneToScene();

    // line behind finisharea
    var finishAreaDeepth = 4;
    linePivotCenter = { x: lineSize.width / 2, y: finPosZ + finishAreaDeepth, z: 0 };
    var finishLine = new Floor(game.scene, "", lineSize, linePivotCenter, 0.01, opacity, { x: lineSize.width / 5, y: lineSize.height / 5 });
    finishLine.addPlaneToScene();

    var trackAmount = 4,
        trackWidth = floor_width / trackAmount,
        fontheight = 0.01,
        fontsize = 1;

    // create 1-4 start-caption
    for (var i = 0; i < trackAmount; i++) {
        game.createCaption(i + 1, fontheight, fontsize, { x: trackWidth * i + trackWidth / 2, y: 0, z: 1 }, { x: -Math.PI / 2, y: 0, z: 0 }, 16777215, 0.9, "trackCaption" + i, true, { receiveShadow: true, castShadow: false });
    }
};

},{"./Floor.js":3}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Floor = exports.Floor = (function () {
    function Floor(scene, textureName, size, posCenter, correctionY, opacity, repeatValue) {
        _classCallCheck(this, Floor);

        this.scene = scene;
        this.textureName = textureName;
        this.size = size;
        this.posCenter = posCenter;
        this.correctionY = correctionY;
        this.opacity = opacity;
        this.repeatValue = repeatValue;
    }

    _createClass(Floor, {
        addPlaneToScene: {
            value: function addPlaneToScene() {

                var newObjectGeometry = new THREE.PlaneGeometry(this.size.width, this.size.height, 0); //width, height, segments
                var newObjectTexture, newObjectMaterial;

                if (this.textureName != "") {
                    // if texture is set
                    newObjectTexture = THREE.ImageUtils.loadTexture("img/" + this.textureName);
                    // set texture properties, repeat
                    newObjectTexture.wrapS = newObjectTexture.wrapT = THREE.RepeatWrapping;
                    newObjectTexture.repeat.set(this.repeatValue.x, this.repeatValue.y); //x-repeat, y-repeat
                    newObjectMaterial = new THREE.MeshLambertMaterial({ map: newObjectTexture, transparent: true, opacity: this.opacity });
                } else {
                    newObjectMaterial = new THREE.MeshLambertMaterial({ color: "#fff", transparent: true, opacity: this.opacity });
                }
                // create new mesh from geometry and material
                var newObject = new THREE.Mesh(newObjectGeometry, newObjectMaterial);
                newObject.material.side = THREE.DoubleSide; // set object to doublesided
                newObject.receiveShadow = true; // set receaving shadow
                // rotate floor to x-z
                newObject.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
                // set position of floor
                // !! y an z swaped, because of rotation !!
                newObject.position = { x: this.posCenter.x, y: this.correctionY, z: -this.posCenter.y };
                // add floor to scene
                this.scene.add(newObject);
            }
        }
    });

    return Floor;
})();

},{}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Models = require("./Models.js").Models;

var Environment = require("./Environment.js").Environment;

var Game = exports.Game = (function () {
    function Game(options) {
        _classCallCheck(this, Game);

        this.config = {
            floor_width: 10,
            floor_height: 30,
            snailSpeed: 0.9,
            finPosZ: 23
        };

        this.isGameOver = false;
        this.playerSnails = { snails: [] };
        this.particles = [];
        this.scene = new THREE.Scene();
        this.camera = options.camera;
        this.startTime;
        this.animationFrameID;
        this.renderer = new THREE.WebGLRenderer({ antialias: true, clearColor: 12708324, clearAlpha: 1 });
        this.winner = 0;
        this.playerCount = options.playerCount;
        this.models = new Models({ scene: this.scene, playerSnails: this.playerSnails });

        this.environment = new Environment(this, this.config.floor_width, this.config.floor_height, this.config.finPosZ);

        this.cameraFinish = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);

        var _this = this;
        this.views = [{
            left: 0,
            bottom: 0,
            width: 1,
            height: 1,
            eye: [10, 10, 10], //x,y,z position of camera
            up: [0, 1, 0], //up vector
            updateCamera: function updateCamera(camera) {
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
            updateCamera: function updateCamera(camera) {
                // camera.position.set(0,4, playerSnails[winner].position.z-10);

                camera.position.x = camera.position.x * Math.cos(0.1) + Math.sin(0.1);
                camera.position.z = camera.position.z * Math.cos(0.1) - Math.sin(0.1);

                camera.lookAt(_this.playerSnails.snails[_this.winner].position);
            }
        }];

        this.init();
    }

    _createClass(Game, {
        init: {
            value: function init() {

                // define renderer

                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.renderer.sortElements = false;

                // shadow settings
                this.renderer.shadowMapEnabled = true;
                this.renderer.shadowMapSoft = true;
                this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
                this.renderer.physicallyBasedShading = true;

                this.cameraFinish.position.set(10, 10, 10); // set position of the camera
                this.cameraFinish.lastPosition = new THREE.Vector3(10, 10, 10);
                this.cameraFinish.lookAt(new THREE.Vector3(0, 0, 0)); // scene point camera is looking at

                this.scene.add(this.cameraFinish);

                this.views[0].camera = this.camera;
                this.views[1].camera = this.cameraFinish;
            }
        },
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
                            text = "GO!", color = 52224;
                            // enable user controller
                            _this.addUserInput();
                        }
                        // remove old caption
                        _this.scene.remove(_this.scene.getChildByName(objName));
                        // add new caption
                        _this.createCaption(text, fontheight, fontsize, { x: -1, y: 2.1, z: -2 }, { x: 0, y: Math.PI / 2, z: 0 }, color, 1, objName, true, { receiveShadow: true, castShadow: true });
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
        removeControls: {
            value: function removeControls() {
                // keep movement for 3 seconds enabled
                var _this = this;
                setTimeout(function () {
                    window.removeEventListener("keyup", _this.checkModelMove.bind(_this), false);
                }, 3000);
            }
        },
        setGameOver: {
            value: function setGameOver(winID) {
                this.isGameOver = true;

                this.winner = winID;
                this.setGameOverScreen(winID);
                this.removeControls();
            }
        },
        render: {
            value: function render() {

                if (this.isGameOver) {
                    this.animateParticleSystem();
                    //viewports
                    for (var k = 0; k < this.views.length; ++k) {

                        this.camera = this.views[k].camera;
                        this.views[k].updateCamera(this.camera, this.scene);

                        var left = Math.floor(window.innerWidth * this.views[k].left);
                        var bottom = Math.floor(window.innerHeight * this.views[k].bottom);
                        var width = Math.floor(window.innerWidth * this.views[k].width);
                        var height = Math.floor(window.innerHeight * this.views[k].height);
                        this.renderer.setViewport(left, bottom, width, height);
                        this.renderer.setScissor(left, bottom, width, height);
                        this.renderer.enableScissorTest(true);

                        this.camera.aspect = width / height;
                        this.camera.updateProjectionMatrix();

                        this.renderer.render(this.scene, this.camera);
                    }
                }

                // render scene
                if (!this.isGameOver) this.renderer.render(this.scene, this.camera);
                // render-loop
                var _this = this;
                this.animationFrameID = requestAnimationFrame(function () {
                    _this.render();
                });
            }
        }
    });

    return Game;
})();

},{"./Environment.js":2,"./Models.js":5}],5:[function(require,module,exports){
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
