import { Models } from './3d/Models.js';
import { Environment } from './3d/Environment.js';
import { Counter } from './3d/Counter.js';
import { Confetti } from './3d/Confetti.js';
import { Renderer } from './3d/Renderer.js';

export class Game {

    constructor() {
        this.scene = new THREE.Scene();
        this.isGameOver = false;
        this.winnerTrack = 0;
        this.startTime;

        this.config = {
            trackWidth: 10 / 4,
            floor_width: 10,
            floor_height: 30,
            snailSpeed: 0.1,
            finPosZ: 23,
            playerCount: 2
        };

        this.playerSnails = {snails: []};
        this.playerCount = this.config.playerCount;

        this.renderer = new Renderer(this, this.scene);
        this.models = new Models({ scene: this.scene, playerSnails: this.playerSnails }, this.config);
        this.environment = new Environment(this.scene, this.config);
    }

    getEndTime() {
        var endTime = (new Date().getTime() - this.startTime) / 1000;
        endTime.toFixed(3);
        return endTime;
    }

    getFirstAndLastSnailPositionZ(){
        var min = 10, max = 0, element, z;
        for(var i = 0; i < this.playerSnails.snails.length; i++){
            element = this.playerSnails.snails[i].model;
            z = Math.abs(element.position.z);
            if(z < min){ min = z; }
            if(z > max){ max = z; }
        }
        return {min: min, max: max};
    }

    setCameraInGame(){
        var position = this.getFirstAndLastSnailPositionZ();
        var mid = (position.max + position.min) / 2;
        this.renderer.updateInGameCamera(mid);
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
            slime.position.set(this.playerSnails.snails[snailIndex].model.position.x, this.playerSnails.snails[snailIndex].model.position.y+0.03, this.playerSnails.snails[snailIndex].model.position.z+0.8);
            slime.rotation.set(-(90*Math.PI/180), 0, 0);
            this.scene.add(slime);
        }

        this.playerSnails.snails[snailIndex].slimeCounter++;
    }

    //moves models on the scene
    // todo: disable until countdown is over
    modelMove(snailIndex){
        // set new position of snail
        // into negativ z-axis
        var snailSpeed = 0.9;
        this.playerSnails.snails[snailIndex].model.position.z -= snailSpeed;
        this.addSlime(snailIndex);
        // if devCam is not enabled, set camera to new position
        this.setCameraInGame();

        // check if user reached finish
        var halfmodel = 1.3; // model-pivot is center, with halfmodel -> head
        var finPosZ = 23;
        if(Math.abs(this.playerSnails.snails[snailIndex].model.position.z - halfmodel) >= finPosZ && !this.isGameOver)
            this.setGameOver(snailIndex);
    }
    /**
     * Renderer.addCounter
     * e.g.: Renderer.addCounter();
     *
     * @param callback {function) optional
     */
    addCounter(callback) {
        this.counter = new Counter(this.scene, (function() {
            this.startTime = new Date().getTime();
            callback && callback();
        }).bind(this));
    }

    startGame(gameOverCallback){
        this.models.setPlayerSnails(this.playerCount);
        this.addCounter();
        this.renderer.render();

        this.gameOverCallback = gameOverCallback;
    }

    setGameOver(winID){
        this.isGameOver = true;
        this.winnerTrack = winID + 1;

        this.environment.addWinnerCaption(this.winnerTrack);
        this.confetti = new Confetti(this.scene, this.config, this.winnerTrack);

        this.endTime = this.getEndTime();
        console.log(this.endTime);
        this.gameOverCallback(this.endTime);
    }
}