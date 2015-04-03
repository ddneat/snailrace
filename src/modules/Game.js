import { Models } from './3d/Models.js';
import { Environment } from './3d/Environment.js';
import { Counter } from './3d/Counter.js';
import { Confetti } from './3d/Confetti.js';
import { Renderer } from './3d/Renderer.js';

export class Game {
    /**
     * constructor
     * e.g.: new Game()
     */
    constructor() {
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

        this.playerSnails = {snails: []};
        this.playerCount = this.config.playerCount;

        this.renderer = new Renderer(this, this.scene);
        this.models = new Models({ scene: this.scene, playerSnails: this.playerSnails }, this.config);
        this.environment = new Environment(this.scene, this.config);
    }
    /**
     * Game.getEndTime
     *
     * @return {Number}
     */
    getEndTime() {
        var endTime = (new Date().getTime() - this.startTime) / 1000;
        endTime.toFixed(3);
        return endTime;
    }
    /**
     * Game.getFirstAndLastSnailPositionZ
     *
     * @return {Object}
     */
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
    /**
     * Game.setCameraInGame
     */
    setCameraInGame(){
        var position = this.getFirstAndLastSnailPositionZ();
        var mid = (position.max + position.min) / 2;
        this.renderer.updateInGameCamera(mid);
    }
    /**
     * Game.modelMove
     */
    modelMove(snailIndex){
        if(!this.startTime) return;

        var snail = this.playerSnails.snails[snailIndex];
        this.scene.add(snail.getSlime());
        snail.move();

        this.setCameraInGame();
        this.isGameOver && this.checkGameOver(snailIndex);
    }
    /**
     * Game.checkGameOver
     * e.g.: Game.checkGameOver();
     */
    checkGameOver(snailIndex) {
        this.isSnailOverFinish(snailIndex) && this.setGameOver(snailIndex);
    }
    /**
     * Game.isSnailOverFinish
     * e.g.: Game.isSnailOverFinish();
     */
    isSnailOverFinish(snailIndex) {
        return this.playerSnails.snails[snailIndex].getModelCenter() >= this.config.finPosZ;
    }
    /**
     * Game.addCounter
     * e.g.: Game.addCounter();
     *
     * @param callback {function) optional
     */
    addCounter(callback) {
        this.counter = new Counter(this.scene, (function() {
            this.startTime = new Date().getTime();
            callback && callback();
        }).bind(this));
    }
    /**
     * Game.startGame
     * e.g.: Game.startGame();
     */
    startGame(gameOverCallback){
        this.models.setPlayerSnails(this.playerCount);
        this.setCameraInGame();
        this.addCounter();
        this.renderer.render();

        this.gameOverCallback = gameOverCallback;
    }
    /**
     * Game.setGameOver
     * e.g.: Game.setGameOver();
     */
    setGameOver(winID){
        this.isGameOver = true;
        this.winnerTrack = winID + 1;

        this.environment.addWinnerCaption(this.winnerTrack);
        this.confetti = new Confetti(this.scene, this.config, this.winnerTrack);

        this.endTime = this.getEndTime();
        this.gameOverCallback(this.endTime);
    }
}