/*********************************
project snailrace - computer graphics
by David Neubauer and Joscha Probst
University of Applied Sciences Salzburg
********************************/

function floorController(createCaption, floor_width, floor_height, finPosZ){
	// floor constuctor
	function floor(textureName, size, posCenter, correctionY, opacity, repeatValue){
		this.textureName = textureName;
		this.size = size;
		this.posCenter = posCenter;
		this.correctionY = correctionY;
		this.opacity = opacity;
		this.repeatValue = repeatValue;
	}

	floor.prototype.addPlaneToScene = function(floor){
		var floor = this;

		var newObjectGeometry = new THREE.PlaneGeometry(floor.size.width, floor.size.height, 0); //width, height, segments
		var newObjectTexture, newObjectMaterial;

		if(floor.textureName != ""){ // if texture is set
			newObjectTexture = THREE.ImageUtils.loadTexture('img/' + floor.textureName);
			// set texture properties, repeat
			newObjectTexture.wrapS = newObjectTexture.wrapT = THREE.RepeatWrapping;
			newObjectTexture.repeat.set(floor.repeatValue.x, floor.repeatValue.y); //x-repeat, y-repeat
			newObjectMaterial = new THREE.MeshLambertMaterial({ map: newObjectTexture, transparent: true, opacity: floor.opacity });
		}
		else{
			newObjectMaterial = new THREE.MeshLambertMaterial({ color: "#fff", transparent: true, opacity: floor.opacity });
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

	function createTrackCaption(){
		// add start and finish-lines
		var opacity = 0.7, linePivotCenter, lineSize = { width: floor_width, height: 0.3};
		// start: front snale
		linePivotCenter = { x: lineSize.width / 2, y: lineSize.height / 2 - 3, z: 0};
		var startCaptionFront = new floor('', lineSize, linePivotCenter, 0.01, opacity,
							repeat = {x: lineSize.width / 5, y: lineSize.height / 5});
		startCaptionFront.addPlaneToScene();
		// start: behind snale
		linePivotCenter = { x: lineSize.width / 2, y: lineSize.height / 2 + 1, z: 0};
		var startCaptionBehind = new floor('', lineSize, linePivotCenter, 0.01, opacity,
							repeat = {x: lineSize.width / 5, y: lineSize.height / 5});
		startCaptionBehind.addPlaneToScene();

		// finish	
		linePivotCenter = { x: lineSize.width / 2, y: finPosZ, z: 0};
		var finishLine = new floor('', lineSize, linePivotCenter, 0.01, opacity,
							repeat = {x: lineSize.width / 5, y: lineSize.height / 5});
		finishLine.addPlaneToScene();

		// line behind finisharea
		var finishAreaDeepth = 4;
		linePivotCenter = { x: lineSize.width / 2, y: finPosZ + finishAreaDeepth, z: 0};
		var finishLine = new floor('', lineSize, linePivotCenter, 0.01, opacity,
							repeat = {x: lineSize.width / 5, y: lineSize.height / 5});
		finishLine.addPlaneToScene();

		var trackAmount = 4, trackWidth = floor_width / trackAmount,
			fontheight = 0.01, fontsize = 1;

		// create 1-4 start-caption
		for(var i = 0; i < trackAmount; i++){
			createCaption(i + 1, fontheight, fontsize,
				position = { x: trackWidth * i + trackWidth / 2, y: 0, z: 1 },
				rotation = { x: - Math.PI / 2, y: 0, z: 0 },
				0xFFFFFF, 0.9, "trackCaption" + i, lambert = true,
				shadow = { receiveShadow: true, castShadow: false });
		}
	}


	// soil floor
	var soilSize = { width: floor_height * 20, height: floor_height * 20 };
	var soilPivotCenter = { x: 0, y: 0, z: 0};
	var soil = new floor('gras.jpg', soilSize, soilPivotCenter, -0.01, 1,
							repeat = {x: soilSize.width / 5, y: soilSize.height / 5});
	soil.addPlaneToScene();



	// track floor
	var trackSize = { width: floor_width, height: floor_height };
	var trackPivotCenter = { x: trackSize.width / 2, y: trackSize.height / 2 - 3, z: 0};
	var track = new floor('floor_comic.jpg', trackSize, trackPivotCenter, 0, 1,
							repeat = {x: trackSize.width / 5, y: trackSize.height / 5});
	track.addPlaneToScene();

	// create trackcaption 1-4 and lines
	createTrackCaption();

}