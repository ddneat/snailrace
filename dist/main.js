(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Highscore = require("./modules/Highscore.js").Highscore;

var Game = require("./modules/Game.js").Game;

var Snailrace = (function () {
    /**
     * constructor
     * e.g.: new Snailrace()
     */

    function Snailrace() {
        _classCallCheck(this, Snailrace);

        this.highscore = new Highscore();
        this.game = new Game();

        this.addStartButton();
        this.addConfigOptions();
        this.loadHighscore();
    }

    _createClass(Snailrace, {
        addStartButton: {
            /**
             * Snailrace.addStartButton
             * e.g.: Snailrace.addStartButton();
             */

            value: function addStartButton() {
                document.getElementById("startgame").addEventListener("click", (function () {
                    $("#lobbyContainer").hide("slide", { direction: "up", easing: "easeInCubic" }, 1000);
                    this.addControls();
                    this.game.startGame(this.gameOverCallback.bind(this));
                }).bind(this), false);
            }
        },
        loadHighscore: {
            /**
             * Snailrace.loadHighscore
             * e.g.: Snailrace.loadHighscore();
             */

            value: function loadHighscore() {
                $("#high").append(this.highscore.getHTML());
            }
        },
        addConfigOptions: {
            /**
             * Snailrace.addConfigOptions
             * e.g.: Snailrace.addConfigOptions();
             */

            value: function addConfigOptions() {
                $("#playerAdd").click((function () {
                    this.game.playerCount < 4 && $("#playerCount").html(++this.game.playerCount);
                }).bind(this));

                $("#playerRemove").click((function () {
                    this.game.playerCount > 1 && $("#playerCount").html(--this.game.playerCount);
                }).bind(this));
            }
        },
        playerInput: {
            /**
             * Snailrace.playerInput
             * e.g.: Snailrace.playerInput();
             */

            value: function playerInput(e) {
                if (e.keyCode == 81 || e.which == 81) {
                    // q
                    this.game.modelMove(0);
                } else if (e.keyCode == 67 || e.which == 67) {
                    // c
                    this.game.modelMove(1);
                } else if (e.keyCode == 78 || e.which == 78) {
                    // n
                    this.game.modelMove(2);
                } else if (e.keyCode == 80 || e.which == 80) {
                    // p
                    this.game.modelMove(3);
                }
            }
        },
        addControls: {
            /**
             * Snailrace.addControls
             * e.g.: Snailrace.addControls();
             */

            value: function addControls() {
                $(window).on("keyup", this.playerInput.bind(this));
            }
        },
        removeControls: {
            /**
             * Snailrace.removeControls
             * e.g.: Snailrace.removeControls();
             */

            value: function removeControls() {
                setTimeout(function () {
                    $(window).off("keyup");
                }, 3000);
            }
        },
        gameOverCallback: {
            /**
             * Snailrace.gameOverCallback
             * e.g.: Snailrace.gameOverCallback();
             */

            value: function gameOverCallback() {
                $("#gameOverInput").show(1200);
                $("#timeElapsed").html(this.game.endTime + " Sek.");

                $("#highscoreBtn").click((function () {
                    this.saveHighscore();
                }).bind(this));

                $("#playerName").focus(1200).keypress((function (e) {
                    if (e.keyCode == 13) this.saveHighscore();
                }).bind(this));

                this.removeControls();
            }
        },
        saveHighscore: {
            /**
             * Snailrace.saveHighscore
             * e.g.: Snailrace.saveHighscore();
             */

            value: function saveHighscore() {
                this.highscore.saveItem($("#playerName").val(), this.game.endTime, function () {
                    window.location.reload();
                });
            }
        }
    });

    return Snailrace;
})();

new Snailrace();

},{"./modules/Game.js":9,"./modules/Highscore.js":10}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Confetti = exports.Confetti = (function () {
    /**
     * constructor
     * e.g.: new Confetti()
     *
     * Winner Confetti Animation
     *
     * @param scene {Object}
     * @param config {Object}
     * @param track {Number} 1-4
     */

    function Confetti(scene, config, track) {
        _classCallCheck(this, Confetti);

        this.scene = scene;
        this.config = config;
        this.track = track;

        this.particles = [];
        this.init();
    }

    _createClass(Confetti, {
        init: {
            /**
             * Confetti.init
             * e.g.: Confetti.init();
             */

            value: function init() {
                for (var i = 0; i < 15; i++) {
                    this.particles[i] = new THREE.ParticleSystem(this.getParticleGeometry(), this.getParticleMaterial());
                    this.particles[i].position = { x: this.getTrackPositionX(), y: 1, z: -26 };
                    this.particles[i].sortPosition = true;

                    this.scene.add(this.particles[i]);
                }
            }
        },
        getTrackPositionX: {
            /**
             * Confetti.getTrackPositionX
             * e.g.: Confetti.getTrackPositionX();
             *
             * @return {Number}
             */

            value: function getTrackPositionX() {
                return this.config.trackWidth * (this.track - 1) + 1.3;
            }
        },
        getParticleGeometry: {
            /**
             * Confetti.getParticleGeometry
             * e.g.: Confetti.getParticleGeometry();
             *
             * @return {Object}
             */

            value: function getParticleGeometry() {
                var geometry = new THREE.Geometry();

                for (var j = 0; j < 1200; j++) {
                    var vertex = new THREE.Vector3();
                    vertex.x = Math.random() * 2 - 1;
                    vertex.y = Math.random() * 15 - 1;
                    vertex.z = Math.random() * 30 - 1;
                    vertex.velocity = new THREE.Vector3(0, -1, 0);
                    geometry.vertices && geometry.vertices.push(vertex);
                }

                return geometry;
            }
        },
        getParticleMaterial: {
            /**
             * Confetti.getParticleMaterial
             * e.g.: Confetti.getParticleMaterial();
             *
             * @return {Object}
             */

            value: function getParticleMaterial() {
                var material = new THREE.ParticleBasicMaterial({ size: 0.1 });
                material.color = new THREE.Color(this.getRandomColor());
                return material;
            }
        },
        getRandomColor: {
            /**
             * Confetti.getRandomColor
             * e.g.: Confetti.getRandomColor();
             *
             * return {String} #000000
             */

            value: function getRandomColor() {
                return "#000000".replace(/0/g, function () {
                    return (~ ~(Math.random() * 16)).toString(16);
                });
            }
        },
        animate: {
            /**
             * Confetti.animate
             * e.g.: Confetti.animate();
             */

            value: function animate() {
                for (var i = 0; i < this.particles.length; i++) {
                    if (this.particles[i].position.y < -1) {
                        this.particles[i].position.y = 1;
                    }
                    this.particles[i].position.y -= 0.1 * Math.random();
                }
            }
        }
    });

    return Confetti;
})();

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Counter = exports.Counter = (function () {
    /**
     * constructor
     * e.g.: new Counter()
     *
     * Countdown starts automatically
     *
     * @param scene {Object}
     * @param callback {function} optional
     */

    function Counter(scene, callback) {
        _classCallCheck(this, Counter);

        this.scene = scene;
        this.callback = callback || function () {};
        this.count = 5;
        this.timer = null;

        this.start();
    }

    _createClass(Counter, {
        start: {
            /**
             * Counter.start
             * e.g.: Counter.start();
             *
             * Starts the Countdown with an interval of 1s
             */

            value: function start() {
                this.timer = setInterval(this.decrement.bind(this), 1000);
            }
        },
        decrement: {
            /**
             * Counter.decrement
             * e.g.: Counter.decrement();
             */

            value: function decrement() {
                this.removeText();
                --this.count ? this.createText(this.count, 16724787) : this.stop();
            }
        },
        stop: {
            /**
             * Counter.decrement
             * e.g.: Counter.stop();
             */

            value: function stop() {
                clearInterval(this.timer);
                this.createText("GO!", 3407667);
                this.callback();
            }
        },
        createText: {
            /**
             * Counter.decrement
             * e.g.: Counter.createText("Go!", 0x33ff33);
             *
             * Adds the given text to the scene
             */

            value: function createText(text, color) {
                this.geometry = new THREE.TextGeometry(text, { font: "helvetiker", height: 1, size: 4, divisions: 1 });
                this.material = new THREE.MeshLambertMaterial({ color: color, transparent: true, opacity: 1 });
                this.mesh = new THREE.Mesh(this.geometry, this.material);
                this.mesh.name = "counter";

                this.mesh.castShadow = true;
                this.mesh.receiveShadow = true;
                this.mesh.rotation = { x: 0, y: Math.PI / 2, z: 0 };
                this.mesh.position = { x: -1, y: 2.1, z: -2 };

                THREE.GeometryUtils.center(this.geometry);
                this.scene.add(this.mesh);
            }
        },
        removeText: {
            /**
             * Counter.decrement
             * e.g.: Counter.removeText();
             *
             * Removes the counter visualisation from the scene
             */

            value: function removeText() {
                this.scene.remove(this.scene.getChildByName("counter"));
            }
        }
    });

    return Counter;
})();

},{}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Environment = exports.Environment = (function () {
    /**
     * constructor
     * e.g.: new Environment()
     *
     * Adds Floor, Lines and StartCaption
     *
     * @param scene {Object}
     * @param config {function}
     */

    function Environment(scene, config) {
        _classCallCheck(this, Environment);

        this.config = config;
        this.scene = scene;

        this.lines = [2.8, -1.3, -this.config.finPosZ, -(this.config.finPosZ + 4)];

        this.floors = [{
            size: {
                x: this.config.floorWidth,
                y: this.config.floorHeight
            },
            position: {
                x: this.config.floorWidth / 2,
                y: -(this.config.floorHeight / 2 - 2.9)
            },
            texture: "floor.jpg",
            repeat: this.config.floorWidth / 5
        }, {
            size: {
                x: this.config.floorWidth * 40,
                y: this.config.floorHeight * 40
            },
            position: {
                x: -(this.config.floorWidth * 10),
                y: -(this.config.floorHeight * 10)
            },
            texture: "gras.jpg",
            repeat: this.config.floorWidth * 20
        }];

        this.addFloors();
        this.addLines();
        this.addFog();
        this.addStartCaption();
    }

    _createClass(Environment, {
        addFloors: {
            /**
             * Environment.addFloors
             * e.g.: Environment.addFloors();
             */

            value: function addFloors() {
                this.group = new THREE.Object3D();

                for (var i = 0; i < this.floors.length; i++) {
                    var floor = this.floors[i];

                    var texture = THREE.ImageUtils.loadTexture("img/" + floor.texture);
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(floor.repeat, floor.repeat);

                    var geometry = new THREE.PlaneGeometry(floor.size.x, floor.size.y, 0);
                    var material = new THREE.MeshLambertMaterial({ map: texture, transparent: true });
                    var mesh = new THREE.Mesh(geometry, material);

                    mesh.material.side = THREE.DoubleSide;
                    mesh.receiveShadow = true;

                    mesh.rotation = { x: -Math.PI / 2, y: 0, z: 0 };
                    mesh.position = { x: floor.position.x, y: -0.01 * (i + 1), z: floor.position.y };

                    this.group.add(mesh);
                }

                this.scene.add(this.group);
            }
        },
        addLines: {
            /**
             * Environment.addLines
             * e.g.: Environment.addLines();
             */

            value: function addLines() {
                this.group = new THREE.Object3D();

                for (var i = this.lines.length; i >= 0; --i) {
                    var geometry = new THREE.PlaneGeometry(this.config.floorWidth, 0.3, 0);
                    var material = new THREE.MeshLambertMaterial({ color: 16777215, transparent: true, opacity: 0.7 });
                    var mesh = new THREE.Mesh(geometry, material);

                    mesh.material.side = THREE.DoubleSide;
                    mesh.receiveShadow = true;

                    mesh.rotation = { x: -Math.PI / 2, y: 0, z: 0 };
                    mesh.position = { x: this.config.floorWidth / 2, y: 0.01, z: this.lines[i] };

                    this.group.add(mesh);
                }

                this.scene.add(this.group);
            }
        },
        addStartCaption: {
            /**
             * Environment.addStartCaption
             * e.g.: Environment.addStartCaption();
             *
             * Adds StartCaptions from 1-4
             */

            value: function addStartCaption() {
                this.group = new THREE.Object3D();

                for (var i = 0; i < 4; i++) {
                    var geometry = new THREE.TextGeometry(i, { font: "helvetiker", height: 0.01, size: 0.9 });
                    var material = new THREE.MeshLambertMaterial({ color: 16777215 });
                    var mesh = new THREE.Mesh(geometry, material);

                    mesh.rotation = { x: -Math.PI / 2, y: 0, z: 0 };
                    mesh.position = { x: this.config.trackWidth * i + this.config.trackWidth / 2, y: 0, z: 1 };

                    THREE.GeometryUtils.center(geometry);
                    this.group.add(mesh);
                }

                this.scene.add(this.group);
            }
        },
        addFog: {
            /**
             * Environment.addFog
             * e.g.: Environment.addFog();
             */

            value: function addFog() {
                this.scene.fog = new THREE.FogExp2("#c1e9e4", 0.01, 10);
            }
        },
        addWinnerCaption: {
            /**
             * Environment.addWinnerCaption
             * e.g.: Environment.addWinnerCaption(1);
             *
             * @param track {Number} 1-4
             */

            value: function addWinnerCaption(track) {
                this.group = new THREE.Object3D();
                var text = "CHAMPION 4EVER";

                var geometry = new THREE.TextGeometry(text, { font: "helvetiker", height: 0.01, size: 1.8 });
                var material = new THREE.MeshLambertMaterial({ color: 16777215, opacity: 0.9 });
                var mesh = new THREE.Mesh(geometry, material);

                mesh.rotation = { x: -Math.PI / 2, y: 0, z: Math.PI / 2 };
                mesh.position = { x: this.config.trackWidth * (track - 1) + 1.3, y: 0, z: -12 };

                THREE.GeometryUtils.center(geometry);
                this.group.add(mesh);

                this.scene.add(this.group);
            }
        }
    });

    return Environment;
})();

},{}],5:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Model = exports.Model = (function () {
    /**
     * constructor
     * e.g.: new Model()
     *
     * @param modelArray {Array}
     * @param modelName {String}
     * @param config {Object}
     * @param loadedCallback {function}
     */

    function Model(modelArray, modelName, config, loadedCallback) {
        _classCallCheck(this, Model);

        this.modelArray = modelArray;
        this.modelName = modelName;
        this.scale = config.scale || { x: 1, y: 1, z: 1 };
        this.position = config.position || { x: 1, y: 0, z: 1 };
        this.loadedCallback = loadedCallback;
        this.model = undefined;

        this.loadModel();
    }

    _createClass(Model, {
        loadModel: {
            /**
             * Model.loadModel
             * e.g.: Model.loadModel();
             */

            value: function loadModel() {
                var newModel;
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
                    newModel.scale.set(_this.scale.x, _this.scale.y, _this.scale.z);
                    newModel.position.set(_this.position.x, _this.position.y, _this.position.z);

                    _this.model = newModel;
                    _this.modelArray.push(_this);
                    _this.loadedCallback(_this);
                }, false);
                loader.load("models/" + this.modelName + ".obj", "models/" + this.modelName + ".mtl");
            }
        }
    });

    return Model;
})();

},{}],6:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Model = require("./Model.js").Model;

var Snail = require("./Snail.js").Snail;

var Models = exports.Models = (function () {
    /**
     * constructor
     * e.g.: new Models()
     *
     * @param options {Object}
     * @param config {Object}
     */

    function Models(options, config) {
        _classCallCheck(this, Models);

        this.modelsToLoad = 5;
        this.snailModels = [];
        this.playerSnails = options.playerSnails;
        this.sceneModels = [];
        this.scene = options.scene;
        this.config = config;

        this.loadSnailModels();
        this.loadFlagModel();
    }

    _createClass(Models, {
        loadSnailModels: {
            /**
             * Models.loadSnailModels
             * e.g.: Models.loadSnailModels();
             */

            value: function loadSnailModels() {
                new Snail(this.snailModels, "snailmodelGreen", this.config, this.loadComplete.bind(this));
                new Snail(this.snailModels, "snailmodelBlue", this.config, this.loadComplete.bind(this));
                new Snail(this.snailModels, "snailmodelRed", this.config, this.loadComplete.bind(this));
                new Snail(this.snailModels, "snailmodelYellow", this.config, this.loadComplete.bind(this));
            }
        },
        loadFlagModel: {
            /**
             * Models.loadFlagModel
             * e.g.: Models.loadFlagModel();
             */

            value: function loadFlagModel() {
                var scale = { x: 0.1, y: 0.1, z: 0.1 };
                var position = { x: 5, y: 0, z: -(this.config.finPosZ - 0.5) };

                new Model(this.sceneModels, "flag", { scale: scale, position: position }, (function (object) {
                    this.scene.add(object.model);
                    this.loadComplete();
                }).bind(this));
            }
        },
        setPlayerSnails: {
            /**
             * Models.setPlayerSnails
             * e.g.: Models.setPlayerSnails();
             */

            value: function setPlayerSnails(playerCount) {
                for (var i = 0; i < playerCount; i++) {
                    this.setSingleSnail(i);
                }
            }
        },
        setSingleSnail: {
            /**
             * Models.setSingleSnail
             * e.g.: Models.setSingleSnail();
             */

            value: function setSingleSnail(playerNumber) {
                this.snailModels[playerNumber].model.position.x = this.config.trackWidth / 2 + this.config.trackWidth * playerNumber;
                this.playerSnails.snails.push(this.snailModels[playerNumber]);
                this.scene.add(this.snailModels[playerNumber].model);
            }
        },
        loadComplete: {
            /**
             * Models.loadComplete
             * e.g.: Models.loadComplete();
             */

            value: function loadComplete() {
                this.modelsToLoad--;
                if (this.modelsToLoad <= 0) {
                    document.getElementById("loadingBar").style.display = "none";
                    $("#startgame").removeAttr("disabled").removeClass("btn-disabled");
                }
            }
        }
    });

    return Models;
})();

},{"./Model.js":5,"./Snail.js":8}],7:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Renderer = exports.Renderer = (function () {
    /**
     * constructor
     * e.g.: new Renderer()
     */

    function Renderer(game, scene) {
        _classCallCheck(this, Renderer);

        this.game = game;
        this.scene = scene;

        this.addInGameCamera();
        this.addFinishCamera();
        this.addMultipleViewports();

        this.addRenderer();
        this.addPointLight();
        this.addDirectionalLight();
        this.setRenderTarget();
    }

    _createClass(Renderer, {
        addRenderer: {
            /**
             * Renderer.addRenderer
             * e.g.: Renderer.addRenderer();
             */

            value: function addRenderer() {
                this.webglRenderer = new THREE.WebGLRenderer({ antialias: true, clearColor: 12708324, clearAlpha: 1 });
                this.webglRenderer.setSize(window.innerWidth, window.innerHeight);
                this.webglRenderer.sortElements = false;

                this.webglRenderer.shadowMapEnabled = true;
                this.webglRenderer.shadowMapSoft = true;
                this.webglRenderer.shadowMapType = THREE.PCFSoftShadowMap;
                this.webglRenderer.physicallyBasedShading = true;

                THREEx.WindowResize(this.webglRenderer, this.camera);
            }
        },
        addInGameCamera: {
            /**
             * Renderer.addInGameCamera
             * e.g.: Renderer.addInGameCamera();
             */

            value: function addInGameCamera() {
                this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
                this.camera.position.set(10, 10, 10);
                this.camera.lastPosition = new THREE.Vector3(10, 10, 10);
                this.camera.lookAt(new THREE.Vector3(0, 0, 0));
                this.scene.add(this.camera);
            }
        },
        updateInGameCamera: {
            /**
             * Renderer.updateInGameCamera
             * e.g.: Renderer.updateInGameCamera();
             *
             * @param lookAtZ {Number}
             */

            value: function updateInGameCamera(lookAtZ) {
                this.camera.target = new THREE.Vector3(0, 0, -lookAtZ);
                this.camera.lastPosition = this.camera.position;
                this.camera.lookAt(this.camera.target);
                this.camera.translateX(lookAtZ / 120);
            }
        },
        addFinishCamera: {
            /**
             * Renderer.addFinishCamera
             * e.g.: Renderer.addFinishCamera();
             */

            value: function addFinishCamera() {
                this.cameraFinish = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
                this.cameraFinish.position.set(10, 10, 10);
                this.cameraFinish.lastPosition = new THREE.Vector3(10, 10, 10);
                this.cameraFinish.lookAt(new THREE.Vector3(0, 0, 0));
                this.scene.add(this.cameraFinish);
            }
        },
        addMultipleViewports: {
            /**
             * Renderer.addMultipleViewports
             * e.g.: Renderer.addMultipleViewports();
             *
             * TODO: enable this feature again
             */

            value: function addMultipleViewports() {
                var _this = this;
                this.views = [{
                    left: 0, bottom: 0, width: 1, height: 1, eye: [10, 10, 10], up: [0, 1, 0],
                    updateCamera: function updateCamera(camera) {
                        camera.position = camera.lastPosition;
                        camera.lookAt(camera.target);
                    }
                }, {
                    left: 0, bottom: 0.6, width: 0.4, height: 0.4, eye: [0, 10, 0], up: [0, 0, 1],
                    updateCamera: function updateCamera(camera) {
                        camera.position.x = camera.position.x * Math.cos(0.1) + Math.sin(0.1);
                        camera.position.z = camera.position.z * Math.cos(0.1) - Math.sin(0.1);
                        camera.lookAt(_this.playerSnails.snails[_this.winner].position);
                    }
                }];

                this.views[0].camera = this.camera;
                this.views[1].camera = this.cameraFinish;
            }
        },
        addPointLight: {
            /**
             * Renderer.addDirectionalLight
             * e.g.: Renderer.addDirectionalLight();
             */

            value: function addPointLight() {
                var PointLight = new THREE.PointLight(16777215, 0.2);
                PointLight.position.set(10, 20, -40);
                this.scene.add(PointLight);
            }
        },
        addDirectionalLight: {
            /**
             * Renderer.addDirectionalLight
             * e.g.: Renderer.addDirectionalLight();
             */

            value: function addDirectionalLight() {
                var directionalLight = new THREE.DirectionalLight(16777215, 1);
                directionalLight.position.set(10, 20, 10);

                directionalLight.shadowDarkness = 0.7;
                directionalLight.shadowCameraRight = 30;
                directionalLight.shadowCameraLeft = -30;
                directionalLight.shadowCameraTop = 30;
                directionalLight.shadowCameraBottom = -30;
                directionalLight.shadowCameraNear = 1;
                directionalLight.shadowCameraFar = 60;

                directionalLight.castShadow = true;
                this.scene.add(directionalLight);
            }
        },
        setRenderTarget: {
            /**
             * Renderer.setRenderTarget
             * e.g.: Renderer.setRenderTarget();
             */

            value: function setRenderTarget() {
                var container = document.createElement("div");
                document.body.appendChild(container);
                container.id = "viewport";
                container.appendChild(this.webglRenderer.domElement);
            }
        },
        render: {
            /**
             * Renderer.render
             * e.g.: Renderer.render();
             */

            value: function render() {
                if (this.game.isGameOver) {
                    this.game.confetti.animate();

                    //TODO: enable multiple views
                    //cameraFinish.position.set(1, 4, this.playerSnails.snails[winID].position.z - 8);
                    this.webglRenderer.render(this.scene, this.camera);
                    //viewports
                    /*            for ( var k = 0; k < this.views.length; ++k ) {
                    
                                    this.camera = this.views[k].camera;
                                    this.views[k].updateCamera( this.camera, this.scene);
                    
                                    var left   = Math.floor( window.innerWidth  * this.views[k].left );
                                    var bottom = Math.floor( window.innerHeight * this.views[k].bottom );
                                    var width  = Math.floor( window.innerWidth  * this.views[k].width );
                                    var height = Math.floor( window.innerHeight * this.views[k].height );
                                    this.webglRenderer.setViewport( left, bottom, width, height );
                                    this.webglRenderer.setScissor( left, bottom, width, height );
                                    this.webglRenderer.enableScissorTest ( true );
                    
                                    this.camera.aspect = width / height;
                                    this.camera.updateProjectionMatrix();
                    
                                    this.webglRenderer.render(this.scene, this.camera);
                                }*/
                }

                if (!this.game.isGameOver) {
                    this.webglRenderer.render(this.scene, this.camera);
                }

                var _this = this;
                requestAnimationFrame(function () {
                    _this.render();
                });
            }
        }
    });

    return Renderer;
})();

},{}],8:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Model = require("./Model.js").Model;

var Snail = exports.Snail = (function (_Model) {
    /**
     * constructor
     * e.g.: new Snail()
     *
     * @param modelArray {Array}
     * @param modelName {String}
     * @param config {Object}
     * @param loadedCallback {Function}
     */

    function Snail(modelArray, modelName, config, loadedCallback) {
        _classCallCheck(this, Snail);

        _get(Object.getPrototypeOf(Snail.prototype), "constructor", this).call(this, modelArray, modelName, config, loadedCallback);
        this.slimeCounter = 0;
        this.config = config;
    }

    _inherits(Snail, _Model);

    _createClass(Snail, {
        move: {
            /**
             * Snail.move
             * e.g.: Snail.move();
             */

            value: function move() {
                this.model.position.z -= this.config.snailSpeed;
            }
        },
        getModelCenter: {
            /**
             * Snail.getModelCenter
             * e.g.: Snail.getModelCenter();
             *
             * @return {Number}
             */

            value: function getModelCenter() {
                return Math.abs(this.model.position.z - this.config.modelSize / 2);
            }
        },
        getTexturePath: {
            /**
             * Snail.getTexturePath
             * e.g.: Snail.getTexturePath();
             *
             * @return {String}
             */

            value: function getTexturePath() {
                return this.slimeCounter != 0 ? "img/slime.png" : "img/slime-start.png";
            }
        },
        getSlimeTexture: {
            /**
             * Snail.getTexturePath
             * e.g.: Snail.getTexturePath();
             *
             * @return {Object}
             */

            value: function getSlimeTexture() {
                var texture = THREE.ImageUtils.loadTexture(this.getTexturePath());
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);

                return texture;
            }
        },
        getSlimeMesh: {
            /**
             * Snail.getSlimeMesh
             * e.g.: Snail.getSlimeMesh();
             *
             * @return {Object}
             */

            value: function getSlimeMesh() {
                return new THREE.Mesh(new THREE.PlaneGeometry(0.9, 2, 1, 1), new THREE.MeshLambertMaterial({ map: this.getSlimeTexture(), transparent: true, alphaTest: 0.4 }));
            }
        },
        isNewSlimeNeeded: {
            /**
             * Snail.isNewSlimeNeeded
             * e.g.: Snail.isNewSlimeNeeded();
             *
             * @return {Boolean}
             */

            value: function isNewSlimeNeeded() {
                return this.slimeCounter % 20 == 0;
            }
        },
        getSlime: {
            /**
             * Snail.getSlime
             * e.g.: Snail.getSlime();
             */

            value: function getSlime() {
                if (!this.isNewSlimeNeeded()) {
                    this.slimeCounter++;
                    return;
                }

                var slime = this.getSlimeMesh();
                slime.receiveShadow = true;
                slime.position.set(this.model.position.x, this.model.position.y + 0.03, this.model.position.z + 0.8);
                slime.rotation.set(-(90 * Math.PI / 180), 0, 0);

                this.slimeCounter++;
                return slime;
            }
        }
    });

    return Snail;
})(Model);

},{"./Model.js":5}],9:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Models = require("./3d/Models.js").Models;

var Environment = require("./3d/Environment.js").Environment;

var Counter = require("./3d/Counter.js").Counter;

var Confetti = require("./3d/Confetti.js").Confetti;

var Renderer = require("./3d/Renderer.js").Renderer;

var Game = exports.Game = (function () {
    /**
     * constructor
     * e.g.: new Game()
     */

    function Game() {
        _classCallCheck(this, Game);

        this.scene = new THREE.Scene();
        this.isGameOver = false;
        this.winnerTrack = 0;
        this.startTime = null;

        this.config = {
            trackWidth: 10 / 4,
            floorWidth: 10,
            floorHeight: 30,
            snailSpeed: 0.1,
            finPosZ: 23,
            modelSize: 2.6,
            playerCount: 2
        };

        this.playerSnails = { snails: [] };
        this.playerCount = this.config.playerCount;

        this.renderer = new Renderer(this, this.scene);
        this.models = new Models({ scene: this.scene, playerSnails: this.playerSnails }, this.config);
        this.environment = new Environment(this.scene, this.config);
    }

    _createClass(Game, {
        getSnailByIndex: {
            /**
             * Game.getSnailByIndex
             *
             * @return {Snail}
             */

            value: function getSnailByIndex(index) {
                return this.playerSnails.snails[index];
            }
        },
        getEndTime: {
            /**
             * Game.getEndTime
             *
             * @return {Number}
             */

            value: function getEndTime() {
                var endTime = (new Date().getTime() - this.startTime) / 1000;
                endTime.toFixed(3);
                return endTime;
            }
        },
        getFirstAndLastSnailPositionZ: {
            /**
             * Game.getFirstAndLastSnailPositionZ
             *
             * @return {Object}
             */

            value: function getFirstAndLastSnailPositionZ() {
                var min = 10,
                    max = 0,
                    z;
                for (var i = 0; i < this.playerSnails.snails.length; i++) {
                    z = Math.abs(this.getSnailByIndex(i).model.position.z);
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
            /**
             * Game.setCameraInGame
             */

            value: function setCameraInGame() {
                var position = this.getFirstAndLastSnailPositionZ();
                var mid = (position.max + position.min) / 2;
                this.renderer.updateInGameCamera(mid);
            }
        },
        modelMove: {
            /**
             * Game.modelMove
             */

            value: function modelMove(snailIndex) {
                if (!this.startTime) {
                    return;
                }var snail = this.getSnailByIndex(snailIndex);
                this.scene.add(snail.getSlime());
                snail.move();

                this.setCameraInGame();
                !this.isGameOver && this.checkGameOver(snailIndex);
            }
        },
        checkGameOver: {
            /**
             * Game.checkGameOver
             * e.g.: Game.checkGameOver();
             */

            value: function checkGameOver(snailIndex) {
                this.isSnailOverFinish(snailIndex) && this.setGameOver(snailIndex);
            }
        },
        isSnailOverFinish: {
            /**
             * Game.isSnailOverFinish
             * e.g.: Game.isSnailOverFinish();
             */

            value: function isSnailOverFinish(snailIndex) {
                return this.getSnailByIndex(snailIndex).getModelCenter() >= this.config.finPosZ;
            }
        },
        addCounter: {
            /**
             * Game.addCounter
             * e.g.: Game.addCounter();
             *
             * @param callback {function) optional
             */

            value: function addCounter(callback) {
                this.counter = new Counter(this.scene, (function () {
                    this.startTime = new Date().getTime();
                    callback && callback();
                }).bind(this));
            }
        },
        startGame: {
            /**
             * Game.startGame
             * e.g.: Game.startGame();
             */

            value: function startGame(gameOverCallback) {
                this.gameOverCallback = gameOverCallback;
                this.setCameraInGame();
                this.addCounter();
                this.models.setPlayerSnails(this.playerCount);
                this.renderer.render();
            }
        },
        setGameOver: {
            /**
             * Game.setGameOver
             * e.g.: Game.setGameOver();
             */

            value: function setGameOver(winID) {
                this.isGameOver = true;
                this.winnerTrack = winID + 1;
                this.endTime = this.getEndTime();

                this.addWinnerEffects();
                this.gameOverCallback(this.endTime);
            }
        },
        addWinnerEffects: {
            /**
             * Game.addWinnerEffects
             * e.g.: Game.addWinnerEffects();
             */

            value: function addWinnerEffects() {
                this.environment.addWinnerCaption(this.winnerTrack);
                this.confetti = new Confetti(this.scene, this.config, this.winnerTrack);
            }
        }
    });

    return Game;
})();

},{"./3d/Confetti.js":2,"./3d/Counter.js":3,"./3d/Environment.js":4,"./3d/Models.js":6,"./3d/Renderer.js":7}],10:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Highscore = exports.Highscore = (function () {
    /**
     * constructor
     * e.g.: new Highscore()
     *
     * Sets localStorage as default if no storage param is passed
     *
     * @param storage {Object} Optional
     */

    function Highscore(storage) {
        _classCallCheck(this, Highscore);

        this.storage = storage || localStorage;
        this.storage.getItem("highscore") === undefined && this.storage.setItem("highscore", "[]");
    }

    _createClass(Highscore, {
        saveItem: {
            /**
             * Highscore.saveItem
             *
             * @param name {String}
             * @param time {Number}
             * @param callback {function} optional
             */

            value: function saveItem(name, time, callback) {
                var data = JSON.parse(this.storage.getItem("highscore")) || [];
                data.push({ name: name, time: time });
                this.storage.setItem("highscore", JSON.stringify(data));
                callback && callback();
            }
        },
        getJSON: {
            /**
             * Highscore.getJSON
             *
             * @return {Array}
             */

            value: function getJSON() {
                var storageContent = JSON.parse(this.storage.getItem("highscore"));
                if (!storageContent) {
                    return [];
                }return storageContent.sort(function (a, b) {
                    return a.time < b.time ? -1 : 1;
                });
            }
        },
        getHTML: {
            /**
             * Highscore.getHTML
             *
             * Returns an empty string as default
             *
             * @return {String}
             */

            value: function getHTML() {
                var storageContent = this.getJSON();
                var result = "";

                for (var i = 0; i < storageContent.length && i < 10; i++) {
                    var elem = storageContent[i];
                    result += "<div class=\"highscoreEntry\"><div class=\"highscoreName\">" + (i + 1) + ". " + elem.name + "</div><div class=\"highscoreTime\">" + elem.time + "</div></div>";
                }

                return result;
            }
        }
    });

    return Highscore;
})();

},{}]},{},[1]);
