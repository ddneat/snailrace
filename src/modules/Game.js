import { PubSub } from './PubSub.js';
import { Models } from './3d/Models.js';
import { Environment } from './3d/Environment.js';

export class Game {

    constructor() {
        this.pubsub = new PubSub();

        this.config = {
            floor_width: 10,
            floor_height: 30,
            snailSpeed: 0.9,
            finPosZ: 23,
            playerCount: 2
        };

        this.isGameOver = false;
        this.playerSnails = {snails: []};
        this.particles = [];
        this.scene = new THREE.Scene();
        this.startTime;
        this.animationFrameID;
        this.renderer = new THREE.WebGLRenderer( {antialias: true, clearColor: 0xc1e9e4, clearAlpha: 1 } );
        this.winner = 0;
        this.playerCount = this.config.playerCount;
        this.models = new Models({ scene: this.scene, playerSnails: this.playerSnails });

        this.environment = new Environment(this, this.config.floor_width, this.config.floor_height, this.config.finPosZ);

        this.camera = new THREE.PerspectiveCamera(45,  window.innerWidth / window.innerHeight, 0.1, 100000);
        this.cameraFinish = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 100000);

        var _this = this;
        this.views = [
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

                    camera.lookAt( _this.playerSnails.snails[_this.winner].position );
                }
            }
        ];




        this.init();
    }

    init(){

        // define renderer

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.sortElements = false;

        // shadow settings
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        this.renderer.physicallyBasedShading = true;

        this.cameraFinish.position.set(10, 10, 10); // set position of the camera
        this.cameraFinish.lastPosition = new THREE.Vector3(10,10,10);
        this.cameraFinish.lookAt(new THREE.Vector3(0,0,0)); // scene point camera is looking at

        this.scene.add(this.cameraFinish);

        this.views[0].camera = this.camera;
        this.views[1].camera = this.cameraFinish;

        // check if WebGl-rendering is supported, otherwise print message
        if (!Detector.webgl){
            alert("WebGL is not supported or enabled. Please use a modern Browser.");
            Detector.addGetWebGLMessage();
        }

        // set render target
        var container = document.createElement( 'div' );
        document.body.appendChild( container );
        container.id = 'viewport';
        container.appendChild( this.renderer.domElement );

        // create scene object, add fog to scene
        this.scene.fog = new THREE.FogExp2("#c1e9e4", 0.01, 10);

        // camera viewport and configuration, PerspectiveCamera(angle, aspect, near, far)
        this.camera.position.set(10, 10, 10); // set position of the camera
        this.camera.lastPosition = new THREE.Vector3(10,10,10);
        this.camera.lookAt(new THREE.Vector3(0,0,0)); // scene point camera is looking at
        this.scene.add(this.camera); // add camera to scene
        //camera for finish screen

        // point light, THREE.PointLight(color, density)
        var PointLight = new THREE.PointLight(0xffffff, 0.2);
        PointLight.position.set(10,20,-40); // set position of light
        this.scene.add(PointLight); // add light to scene

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
        this.scene.add(directionalLight); // add light to scene

        // handling window-resize, 100% height and 100% width
        THREEx.WindowResize(this.renderer, this.camera);
    }

    getEndTime() {
        var endTime = (new Date().getTime() - this.startTime) / 1000;//highscore-time
        endTime.toFixed(3);
        return endTime;
    }

    getFirstAndLastSnailPositionZ(){
        var min = 10, max = 0, element, z;
        for(var i = 0; i < this.playerSnails.snails.length; i++){
            element = this.playerSnails.snails[i];
            z = Math.abs(element.position.z);
            if(z < min){ min = z; }
            if(z > max){ max = z; }
        }
        return {min: min, max: max};
    }

    setCameraInGame(){
        var position = this.getFirstAndLastSnailPositionZ();
        var mid = (position.max + position.min) / 2;
        this.camera.target = new THREE.Vector3(0,0,-mid);
        this.camera.lastPosition = this.camera.position;
        this.camera.lookAt(this.camera.target);
        //camera.translateX(mid / 96);
        this.camera.translateX(mid / 120);
    }
    //draws slime for each snail
    addSlime(snailIndex){
        if(this.playerSnails.snails[snailIndex].slimeCounter%20 == 0){
            var slime;

            var slimeTexture = THREE.ImageUtils.loadTexture('img/slime.png');
            // set texture properties, repeat
            slimeTexture.wrapS = slimeTexture.wrapT = THREE.RepeatWrapping;
            slimeTexture.repeat.set(1, 1);
            var slimeTextureBegin = THREE.ImageUtils.loadTexture('img/slimeBegin.png');
            // set texture properties, repeat
            slimeTextureBegin.wrapS = slimeTexture.wrapT = THREE.RepeatWrapping;
            slimeTextureBegin.repeat.set(1, 1);

            if(this.playerSnails.snails[snailIndex].slimeCounter != 0){
                slime = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.9, 2, 1, 1),
                    new THREE.MeshLambertMaterial({map: slimeTexture, transparent:true, alphaTest: 0.4})
                );
            }else{
                slime = new THREE.Mesh(
                    new THREE.PlaneGeometry(0.9, 2, 1, 1),
                    new THREE.MeshLambertMaterial({map: slimeTextureBegin, transparent:true, alphaTest: 0.4})
                );
            }

            slime.doubleSided = true;
            slime.receiveShadow = true;
            slime.position.set(this.playerSnails.snails[snailIndex].position.x, this.playerSnails.snails[snailIndex].position.y+0.03, this.playerSnails.snails[snailIndex].position.z+0.8);
            slime.rotation.set(-(90*Math.PI/180), 0, 0);
            this.scene.add(slime);
        }

        this.playerSnails.snails[snailIndex].slimeCounter++;
    }

    //moves models on the scene
    modelMove(snailIndex){
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
        if(Math.abs(this.playerSnails.snails[snailIndex].position.z - halfmodel) >= finPosZ && !this.isGameOver)
            this.setGameOver(snailIndex);
    }

    checkModelMove(e){
        if (e.keyCode == 81 || e.which == 81){//81 =q
            this.modelMove(0);
        }
        else if (e.keyCode == 67 || e.which == 67){// 67 = c
            this.modelMove(1);
        }
        else if (e.keyCode == 78 || e.which == 78){// 78 = n
            this.modelMove(2);
        }
        else if (e.keyCode == 80 || e.which == 80){// 80 = p
            this.modelMove(3);
        }
    }

    addUserInput(){
        var _this = this;
        window.addEventListener('keyup', _this.checkModelMove.bind(_this), false);
    }

    startGame(){

        this.models.setPlayerSnails(this.playerCount);
        // set snails, depending on playerCount selected

        // hide lobby with slide effect, duration 1 second
        $('#lobbyContainer').hide("slide", {direction:"up", easing: 'easeInCubic'}, 1000 );
        // objname = needed for select from scene.children
        var objName = "countdown", fontheight = 1, fontsize = 4, text, color = 0xff3333;
        // loop to render countdown 5
        // enable user controller on GO!
        var _this = this;
        function counter(n) {
            (function loop() {
                if (--n) { // sets value of n -= 1 before check 0 or 1
                    text = n; // set text to current count-value
                    setTimeout(loop, 1000); // recall loop after 0.1 second
                }
                else{
                    _this.startTime = new Date().getTime();
                    text = "GO!", color = 0x00CC00;
                    // enable user controller
                    _this.addUserInput();
                }
                // remove old caption
                _this.scene.remove(_this.scene.getChildByName(objName));
                // add new caption
                _this.createCaption(text, fontheight, fontsize,
                    { x: -1, y: 2.1, z: -2 },
                    { x: 0, y: Math.PI / 2, z: 0 },
                    color, 1, objName, true,
                    { receiveShadow: true, castShadow: true });
                // this.gameStart = new date.timestamp
            })();
        }
        counter(5.0); // start coundown
        this.render(); // start renderer
    }



    setGameOverScreen() {
        this.renderChampionText(this.winner);
        // add ParticleSystem to scene
        this.addParticleSystem(this.winner);

        //TODO: uncomment after moving camera
        //cameraFinish.position.set(1, 4, this.playerSnails.snails[winID].position.z - 8);
    }

    removeControls() {
        // keep movement for 3 seconds enabled
        var _this = this;
        setTimeout(function(){
            window.removeEventListener('keyup', _this.checkModelMove.bind(_this), false);
        }, 3000);
    };

    setGameOver(winID){
        this.isGameOver = true;
        this.winner = winID;

        this.pubsub.publish('game:over', { endTime: this.getEndTime() });
    }

    render(){

        if(this.isGameOver){
            this.animateParticleSystem();
            //viewports
            for ( var k = 0; k < this.views.length; ++k ) {

                this.camera = this.views[k].camera;
                this.views[k].updateCamera( this.camera, this.scene);

                var left   = Math.floor( window.innerWidth  * this.views[k].left );
                var bottom = Math.floor( window.innerHeight * this.views[k].bottom );
                var width  = Math.floor( window.innerWidth  * this.views[k].width );
                var height = Math.floor( window.innerHeight * this.views[k].height );
                this.renderer.setViewport( left, bottom, width, height );
                this.renderer.setScissor( left, bottom, width, height );
                this.renderer.enableScissorTest ( true );

                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();

                this.renderer.render(this.scene, this.camera);
            }
        }

        // render scene
        if(!this.isGameOver)
            this.renderer.render(this.scene, this.camera);
        // render-loop
        var _this = this;
        this.animationFrameID = requestAnimationFrame(function(){
            _this.render();
        });
    };
}