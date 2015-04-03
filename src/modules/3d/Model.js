export class Model {
    /**
     * constructor
     * e.g.: new Model()
     *
     * @param modelArray {Array}
     * @param modelName {String}
     * @param config {Object}
     * @param loadedCallback {function}
     */
    constructor(modelArray, modelName, config, loadedCallback){
        this.modelArray = modelArray;
        this.modelName = modelName;
        this.scale = config.scale || {x: 1, y: 1, z: 1};
        this.position = config.position || {x: 1, y: 0, z: 1};
        this.loadedCallback = loadedCallback;
        this.model = undefined;

        this.loadModel();
    }
    /**
     * Model.loadModel
     * e.g.: Model.loadModel();
     */
    loadModel() {
        var newModel;
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
            newModel.scale.set(_this.scale.x,_this.scale.y,_this.scale.z);
            newModel.position.set(_this.position.x, _this.position.y, _this.position.z);

            _this.model = newModel;
            _this.modelArray.push(_this);
            _this.loadedCallback(_this);
        }, false);
        loader.load("models/" + this.modelName + ".obj", "models/" + this.modelName + ".mtl");
    }
}