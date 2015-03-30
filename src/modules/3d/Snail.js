import { Model } from './Model.js';

export class Snail extends Model {
    constructor(modelArray, modelName, config, loadedCallback){
        super(modelArray, modelName, config, loadedCallback);
        this.slimeCounter = 0
    }


    getSlime(){
        var slime;
        if(this.slimeCounter%20 == 0){

            var slimeTexture = THREE.ImageUtils.loadTexture('img/slime.png');
            // set texture properties, repeat
            slimeTexture.wrapS = slimeTexture.wrapT = THREE.RepeatWrapping;
            slimeTexture.repeat.set(1, 1);
            var slimeTextureBegin = THREE.ImageUtils.loadTexture('img/slimeBegin.png');
            // set texture properties, repeat
            slimeTextureBegin.wrapS = slimeTexture.wrapT = THREE.RepeatWrapping;
            slimeTextureBegin.repeat.set(1, 1);

            if(this.slimeCounter != 0){
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
            slime.position.set(this.model.position.x, this.model.position.y+0.03, this.model.position.z+0.8);
            slime.rotation.set(-(90*Math.PI/180), 0, 0);
        }
        this.slimeCounter++;
        return slime;
    }
}