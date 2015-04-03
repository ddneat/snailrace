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
        this.slimeCounter = 0;
        this.config = config;
    }
    /**
     * Snail.move
     * e.g.: Snail.move();
     */
    move() {
        this.model.position.z -= this.config.snailSpeed;
    }
    /**
     * Snail.getModelCenter
     * e.g.: Snail.getModelCenter();
     *
     * @return {Number}
     */
    getModelCenter() {
        return Math.abs(this.model.position.z - this.config.modelSize / 2);
    }
    /**
     * Snail.getTexturePath
     * e.g.: Snail.getTexturePath();
     *
     * @return {String}
     */
    getTexturePath() {
        return this.slimeCounter != 0 ? 'img/slime.png' : 'img/slimeBegin.png';
    }
    /**
     * Snail.getTexturePath
     * e.g.: Snail.getTexturePath();
     *
     * @return {Object}
     */
    getSlimeTexture() {
        var texture = THREE.ImageUtils.loadTexture(this.getTexturePath());
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        return texture;
    }
    /**
     * Snail.getSlimeMesh
     * e.g.: Snail.getSlimeMesh();
     *
     * @return {Object}
     */
    getSlimeMesh() {
        return new THREE.Mesh(
            new THREE.PlaneGeometry(0.9, 2, 1, 1),
            new THREE.MeshLambertMaterial({map: this.getSlimeTexture(), transparent:true, alphaTest: 0.4})
        );
    }
    /**
     * Snail.isNewSlimeNeeded
     * e.g.: Snail.isNewSlimeNeeded();
     *
     * @return {Boolean}
     */
    isNewSlimeNeeded() {
        return this.slimeCounter % 20 == 0;
    }
    /**
     * Snail.getSlime
     * e.g.: Snail.getSlime();
     */
    getSlime() {
        if(!this.isNewSlimeNeeded()) {
            this.slimeCounter++;
            return;
        }

        var slime = this.getSlimeMesh();
        slime.receiveShadow = true;
        slime.position.set(this.model.position.x, this.model.position.y + 0.03, this.model.position.z + 0.8);
        slime.rotation.set(-(90 * Math.PI / 180), 0, 0);

        this.slimeCounter++;
        return slime;
    }
}