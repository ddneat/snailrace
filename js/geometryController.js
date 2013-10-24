/*********************************
project snailrace - computer graphics
by David Neubauer and Joscha Probst
University of Applied Sciences Salzburg
********************************/

function geometryController(scene){

	function createPlane (floor){

		var newObjectGeometry = new THREE.PlaneGeometry(floor.size.width, floor.size.height, 0); //width, height, segments
		var newObjectTexture, newObjectMaterial;

		if(floor.textureName != ""){ // if texture is set
			newObjectTexture = THREE.ImageUtils.loadTexture('img/' + floor.textureName);
			// set texture properties, repeat
			newObjectTexture.wrapS = newObjectTexture.wrapT = THREE.RepeatWrapping;
			newObjectTexture.repeat.set(floor.size.width / 5, floor.size.width / 5); //x-repeat, y-repeat
			newObjectMaterial = new THREE.MeshBasicMaterial({ map: newObjectTexture, transparent: true, opacity: floor.opacity });
		}
		else{
			newObjectMaterial = new THREE.MeshBasicMaterial({ color: "#fff", transparent: true, opacity: floor.opacity });
		}
		// create new mesh from geometry and material
		var newObject = new THREE.Mesh(newObjectGeometry, newObjectMaterial);
		newObject.material.side = THREE.DoubleSide; // set object to doublesided
		newObject.receiveShadow = true; // set receaving shadow
		// rotate floor to x-z
		newObject.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
		// set position of floor
		// !! y an z swaped, because of rotation !!
		newObject.position = { x: floor.posCenter.x, y: floor.correctionY, z: - floor.posCenter.y };
		// add floor to scene
		scene.add(newObject);
	}

	function createCaption(text, height, size, position, rotation, color, opacity, name, lambert, shadow){
		var material, shape = new THREE.TextGeometry(text, { font: 'helvetiker', weight: "normal",
									height: height, style : "normal", size: size, divisions: 1 });
		// set pivot of text to center of object
		THREE.GeometryUtils.center(shape);
		// create material and mesh-object
		if(lambert) material = new THREE.MeshLambertMaterial({color: color, transparent: true, opacity: opacity});
		else material = new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: opacity});

		var newObject = new THREE.Mesh(shape, material);
		newObject.name = name;

		newObject.castShadow = shadow.castShadow;
		newObject.receiveShadow = shadow.receiveShadow;

		// alernative to newObject.rotaion is to use THREE.Matrix
		// newObject.applyMatrix(new THREE.Matrix4().makeRotationZ( Math.PI / 2 ))
		// newObject.applyMatrix(new THREE.Matrix4().makeRotationX( - Math.PI / 2 ));
		newObject.rotation = rotation;
		newObject.position.set(position.x, position.y, position.z);
		scene.add(newObject); // add object to scene
	}
}