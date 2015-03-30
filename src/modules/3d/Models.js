import { Model } from './Model.js';
import { Snail } from './Snail.js';

export class Models {
    constructor(options, config) {
        this.modelsToLoad = 5;
        this.snailModels = [];
        this.playerSnails = options.playerSnails;
        this.sceneModels = [];
        this.scene = options.scene;
        this.config = config;

        new Snail(this.snailModels, 'snailmodelGreen', {}, this.loadComplete.bind(this));
        new Snail(this.snailModels, 'snailmodelBlue', {}, this.loadComplete.bind(this));
        new Snail(this.snailModels, 'snailmodelRed', {}, this.loadComplete.bind(this));
        new Snail(this.snailModels, 'snailmodelYellow', {}, this.loadComplete.bind(this));

        new Model(this.sceneModels, 'flag', {scale: {x: 0.1, y: 0.1, z: 0.1}, position: { x:5, y:0, z:-20}}, (function(object){
            this.scene.add(object.model);
            this.loadComplete();
        }).bind(this));
    }

    setPlayerSnails(playerCount){
        for(var i=0; i < playerCount; i++){
            this.setSingleSnail(i);
        }
    };

    setSingleSnail(playerNumber){
        this.snailModels[playerNumber].model.position.x = this.config.trackWidth / 2 + this.config.trackWidth * playerNumber;
        this.playerSnails.snails.push(this.snailModels[playerNumber]);
        this.scene.add(this.snailModels[playerNumber].model);
    };

    loadComplete(){
        this.modelsToLoad--;
        if(this.modelsToLoad <= 0){ // game ready to start, remove loading bar
            document.getElementById("loadingBar").style.display = "none";
            // enable start game
            $("#startgame").removeAttr("disabled").removeClass('btn-disabled');
        }
    }
}