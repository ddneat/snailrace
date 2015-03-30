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

    //moves models on the scene
    // todo: disable until countdown is over
    modelMove(snailIndex){
        // set new position of snail
        // into negativ z-axis
        this.playerSnails.snails[snailIndex].model.position.z -= this.config.snailSpeed;
        this.scene.add(this.playerSnails.snails[snailIndex].getSlime());
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