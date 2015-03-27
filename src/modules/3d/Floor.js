export class Floor {
    constructor(scene, textureName, size, posCenter, correctionY, opacity, repeatValue){
        this.scene = scene;
        this.textureName = textureName;
        this.size = size;
        this.posCenter = posCenter;
        this.correctionY = correctionY;
        this.opacity = opacity;
        this.repeatValue = repeatValue;
    }

    addPlaneToScene(){


        var newObjectGeometry = new THREE.PlaneGeometry(this.size.width, this.size.height, 0); //width, height, segments
        var newObjectTexture, newObjectMaterial;

        if(this.textureName != ""){ // if texture is set
            newObjectTexture = THREE.ImageUtils.loadTexture('img/' + this.textureName);
            // set texture properties, repeat
            newObjectTexture.wrapS = newObjectTexture.wrapT = THREE.RepeatWrapping;
            newObjectTexture.repeat.set(this.repeatValue.x, this.repeatValue.y); //x-repeat, y-repeat
            newObjectMaterial = new THREE.MeshLambertMaterial({ map: newObjectTexture, transparent: true, opacity: this.opacity });
        }
        else{
            newObjectMaterial = new THREE.MeshLambertMaterial({ color: "#fff", transparent: true, opacity: this.opacity });
        }
        // create new mesh from geometry and material
        var newObject = new THREE.Mesh(newObjectGeometry, newObjectMaterial);
        newObject.material.side = THREE.DoubleSide; // set object to doublesided
        newObject.receiveShadow = true; // set receaving shadow
        // rotate floor to x-z
        newObject.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        // set position of floor
        // !! y an z swaped, because of rotation !!
        newObject.position = { x: this.posCenter.x, y: this.correctionY, z: - this.posCenter.y };
        // add floor to scene
        this.scene.add(newObject);
    };
}




