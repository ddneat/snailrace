import { Model } from './Model.js';

export class Snail extends Model {
    /**
     * constructor
     * e.g.: new Snail()
     *
     * @param modelArray {Array}
     * @param modelName {String}
     * @param config {Object}
     * @param loadedCallback {Function}
     */
    constructor(modelArray, modelName, config, loadedCallback){
        super(modelArray, modelName, config, loadedCallback);
        this.slimeCounter = 0
    }
    /**
     * Snail.getSlime
     * e.g.: Snail.getSlime();
     */
    getSlime(){
        var slime;
        if(this.slimeCounter%20 == 0){

            var slimeTexture = THREE.ImageUtils.loadTexture('img/slime.png');
            slimeTexture.wrapS = slimeTexture.wrapT = THREE.RepeatWrapping;
            slimeTexture.repeat.set(1, 1);

            var slimeTextureBegin = THREE.ImageUtils.loadTexture('img/slimeBegin.png');
            slimeTextureBegin.wrapS = slimeTexture.wrapT = THREE.RepeatWrapping;
            slimeTextureBegin.repeat.set(1, 1);

            var texture = this.slimeCounter != 0 ? slimeTexture : slimeTextureBegin;
            slime = new THREE.Mesh(
                new THREE.PlaneGeometry(0.9, 2, 1, 1),
                new THREE.MeshLambertMaterial({map: texture, transparent:true, alphaTest: 0.4})
            );

            slime.doubleSided = true;
            slime.receiveShadow = true;
            slime.position.set(this.model.position.x, this.model.position.y+0.03, this.model.position.z+0.8);
            slime.rotation.set(-(90*Math.PI/180), 0, 0);
        }
        this.slimeCounter++;
        return slime;
    }
}