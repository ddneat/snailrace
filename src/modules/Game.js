import { Models } from './Models.js';

export class Game {

    constructor(options) {
        this.isGameOver = false;
        this.playerSnails = options.playerSnails;
        this.particles = [];
        this.scene = new THREE.Scene();
        this.camera = options.camera;
        this.render = options.render;
        this.startTime;
        this.winner = 0;
        this.playerCount = options.playerCount;
        this.models = new Models({ scene: this.scene, playerSnails: this.playerSnails });
    }

    getEndTime() {
        var endTime = (new Date().getTime() - this.startTime) / 1000;//highscore-time
        endTime.toFixed(3);
        return endTime;
    }

    renderChampionText(winID) {
        // render message in webgl
        var objName = "winner", fontheight = 0.01, fontsize = 1.8, color = 0xFFFFFF;
        var floor_width = 10;
        this.createCaption("CHAMPION 4EVER", fontheight, fontsize,
            {x: floor_width / 4 * winID + 1.3, y: 0, z: -12},
            {x: -Math.PI / 2, y: 0, z: Math.PI / 2},
            color, 0.9, objName, true, true);
    }

    addParticleSystem(index){
        var materials = [], size;
        size  = 0.1; // size of particle
        var x = this.playerSnails.snails[index].position.x;

        for (var i = 0; i < 15; i++) {
            var geometry = new THREE.Geometry();
            // add particle to particle system
            var amount = 1200;
            for ( var j = 0; j < amount; j ++ ) {

                var vertex = new THREE.Vector3();
                vertex.x = Math.random() * 2 - 1;
                vertex.y = Math.random() * 15 - 1;
                vertex.z = Math.random() * 30 - 1;
                vertex.velocity = new THREE.Vector3(0, -1, 0);
                geometry.vertices.push( vertex );
            }

            materials[i] = new THREE.ParticleBasicMaterial( { size: size } );
            var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
            materials[i].color = new THREE.Color(randomColor);
            this.particles[i] = new THREE.ParticleSystem( geometry, materials[i] );
            this.particles[i].position.set(x,1,-26);
            this.particles[i].sortPosition = true;
            this.scene.add(this.particles[i]);
        }
    }

    //animates the particle system
    animateParticleSystem(){

        for (var i = 0; i < this.particles.length; i++) {
            if(this.particles[i].position.y < -1){
                this.particles[i].position.y = 1;
            }
            this.particles[i].position.y -= 0.1*Math.random();
        }
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

    //creates 3D-texts on the scene
    createCaption(text, height, size, position, rotation, color, opacity, name, lambert, shadow){
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
        this.scene.add(newObject); // add object to scene
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
                    position = { x: -1, y: 2.1, z: -2 },
                    rotation = { x: 0, y: Math.PI / 2, z: 0 },
                    color, 1, objName, lambert = true,
                    shadow = { receiveShadow: true, castShadow: true });
                // this.gameStart = new date.timestamp
            })();
        }
        counter(5.0); // start coundown
        this.render(); // start renderer
    }

    //writes highscore to local storage
    submitScore(){
        var name = $('#playerName').val();
        var highscoreEntry = {name: name, time: endtime};
        if(localStorage['highscore'] !== undefined){
            var oldStorage = localStorage['highscore'];
            var length = oldStorage.length;
            var substring = oldStorage.substring(1, length-1);
            oldStorage = "["+substring+","+JSON.stringify(highscoreEntry)+"]";
            localStorage['highscore'] = oldStorage;
        }else{
            localStorage['highscore'] = "["+JSON.stringify(highscoreEntry)+"]";
        }

        $('#gameOverInput').hide();

        $('#lobbyContainer').show("slide", {direction:"up", easing: 'easeInCubic'}, 1000 );
        window.location.reload();
    }

    gameOverScreen(endtime){
        var _this = this;
        $('#gameOverInput').show(1200);
        $('#playerName').focus(1200);
        $('#timeElapsed').html(endtime+" Sek.");
        $('#highscoreBtn').click(_this.submitScore);
        $('#playerName').keypress(function(e){
            if(e.keyCode == 13){
                _this.submitScore();
            }
        });

    }

    setGameOverScreen(winID) {
        this.gameOverScreen(this.getEndTime());
        this.renderChampionText(winID);
        // add ParticleSystem to scene
        this.addParticleSystem(winID);

        //TODO: uncomment after moving camera
        //cameraFinish.position.set(1, 4, this.playerSnails.snails[winID].position.z - 8);
    }

    setGameOver(winID){
        this.isGameOver = true;

        this.winner = winID;
        this.setGameOverScreen(winID);
        $(this).trigger('game_over');
    }
}