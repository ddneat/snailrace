export class Models {
    constructor(options) {
        this.modelsToLoad = 0;
        this.snailModels = [];
        this.playerSnails = options.playerSnails;
        this.sceneModels = [];
        this.scene = options.scene;

        var snailScale = {x: 1, y: 1, z: 1};
        var snailPosition = {x: 1, y: 0, z: 1};
        this.loadModel(this.snailModels, 'snailmodelGreen', snailScale, snailPosition, false);
        this.loadModel(this.snailModels, 'snailmodelBlue', snailScale, snailPosition, false);
        this.loadModel(this.snailModels, 'snailmodelGreen', snailScale, snailPosition, false);
        this.loadModel(this.snailModels, 'snailmodelRed', snailScale, snailPosition, false);

        this.loadModel(this.sceneModels, 'flag', {x: 0.1, y: 0.1, z: 0.1}, { x:5, y:0, z:-20}, true);
    }

    setPlayerSnails(playerCount){
        for(var i=0; i < playerCount; i++){
            this.setSingleSnail(i);
        }
    };

    setSingleSnail(playerNumber){
        var  floor_width = 10;
        var trackWidth = floor_width / 4;
        var newModel = this.snailModels[playerNumber].clone();
        newModel.position.x = trackWidth / 2 + trackWidth * playerNumber;
        this.playerSnails.snails.push(newModel);
        this.playerSnails.snails[playerNumber].slimeCounter = 0;
        this.scene.add(newModel);
    };

    loadModel(modelArray, modelName, scale, position, pushToScene) {
        var newModel;
        this.modelsToLoad++;
        var _this = this;

        var loader = new THREE.OBJMTLLoader();
        loader.addEventListener('load', function (event){
            newModel = event.content;

            newModel.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.castShadow = true;
                }
            } );

            newModel.updateMatrix();
            newModel.scale.set(scale.x,scale.y,scale.z);
            newModel.position.set(position.x, position.y, position.z);

            modelArray.push(newModel);
            if(pushToScene) _this.scene.add(newModel);
            _this.loadComplete();

        }, false);
        loader.load("models/" + modelName + ".obj", "models/" + modelName + ".mtl");
    }

    loadComplete(){
        this.modelsToLoad--;
        if(this.modelsToLoad <= 0){ // game ready to start, remove loading bar
            document.getElementById("loadingBar").style.display = "none";
            // enable start game
            $("#startgame").removeAttr("disabled").removeClass('btn-disabled');
        }
    }
}