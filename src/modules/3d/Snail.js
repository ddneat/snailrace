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
            var texturePath = this.slimeCounter != 0 ? 'img/slime.png' : 'img/slimeBegin.png';
            var texture = THREE.ImageUtils.loadTexture(texturePath);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);

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