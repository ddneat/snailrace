export class Models {
    constructor(options) {
        this.modelsToLoad = 0;
        this.snailModels = [];
        this.playerSnails = options.playerSnails
        this.scene = options.scene;

        // load flag-model
        this.loadFlag();

        // load different snail-models
        this.loadSnail(new this.snail("snailmodelRed"));
        this.loadSnail(new this.snail("snailmodelBlue"));
        this.loadSnail(new this.snail("snailmodelGreen"));
        this.loadSnail(new this.snail("snailmodelYellow"));
    }

    snail(filename){
        this.pathObj = "models/" + filename + ".obj";
        this.pathMtl = "models/" + filename + ".mtl";
        this.position = {x: 0, y: 0, z: 0};
    }

    loadSnail(snail){
        var newModel, trackAmount = 4;
        // calculate single track-width
        var  floor_width = 10;
        var trackWidth = floor_width / trackAmount;
        // count up modelsToLoad
        this.modelsToLoad++;
        var loader = new THREE.OBJMTLLoader();
        var _this = this;

        loader.addEventListener('load', function (event){
            newModel = event.content;
            newModel.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.castShadow = true;
                }
            } );
            newModel.updateMatrix();
            newModel.castShadow = true;
            _this.snailModels.push(newModel); // push to snailModels array
            console.log(this.snailModels);
            _this.loadComplete(); // call on model loaded, userfeedback
        }, false);
        loader.load(snail.pathObj, snail.pathMtl);
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
        console.log('yyyy');
        newModel.position.x = trackWidth / 2 + trackWidth * playerNumber;
        this.playerSnails.snails.push(newModel);
        this.playerSnails.snails[playerNumber].slimeCounter = 0;
        this.scene.add(newModel);
    };

    loadFlag(){
        var newModel, trackAmount = 4;
        // calculate single track-width
        var  floor_width = 10;
        var trackWidth = floor_width / trackAmount;
        // count up modelsToLoad
        this.modelsToLoad++;
        var finPosZ = 23;

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
            newModel.scale.set(0.1,0.1,0.1);
            newModel.position.x = trackWidth * trackAmount / 2;
            newModel.position.z = -(finPosZ);
            _this.scene.add(newModel);
            _this.loadComplete();
        }, false);
        loader.load("models/flag.obj", "models/flag.mtl");
    }

    loadComplete(){
        this.modelsToLoad--;
        console.log(this.modelsToLoad, "models to load");
        if(this.modelsToLoad <= 0){ // game ready to start, remove loading bar
            document.getElementById("loadingBar").style.display = "none";
            // enable start game
            $("#startgame").removeAttr("disabled").removeClass('btn-disabled');

        }
    }
}