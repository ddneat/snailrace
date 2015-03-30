export class Environment {
    /**
     * constructor
     * e.g.: new Environment()
     *
     * Adds Floor, Lines and StartCaption
     *
     * @param scene {Object}
     * @param config {function}
     */
    constructor(scene, config){
        this.config = config;
        this.scene = scene;

        this.lines = [ 2.8, -1.3, -this.config.finPosZ, -(this.config.finPosZ + 4)];

        this.floors = [
            {
                size: {
                    x: this.config.floorWidth,
                    y: this.config.floorHeight
                },
                position: {
                    x: this.config.floorWidth / 2,
                    y: -(this.config.floorHeight / 2 - 2.9)
                },
                texture: 'floor_comic.jpg',
                repeat: this.config.floorWidth / 5
            }, {
                size: {
                    x: this.config.floorWidth * 40,
                    y: this.config.floorHeight * 40
                },
                position: {
                    x: -(this.config.floorWidth * 10),
                    y: -(this.config.floorHeight * 10)
                },
                texture: 'gras.jpg',
                repeat: this.config.floorWidth * 20
            }
        ];

        this.addFloors();
        this.addLines();
        this.addFog();
        this.addStartCaption();
    }
    /**
     * Environment.addFloors
     * e.g.: Environment.addFloors();
     */
    addFloors() {
        this.group = new THREE.Object3D();

        for(var i = 0; i < this.floors.length; i++) {
            var floor = this.floors[i];

            var texture  = THREE.ImageUtils.loadTexture('img/' + floor.texture);
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(floor.repeat, floor.repeat);

            var geometry = new THREE.PlaneGeometry(floor.size.x, floor.size.y, 0);
            var material = new THREE.MeshLambertMaterial({ map: texture, transparent: true });
            var mesh = new THREE.Mesh(geometry, material);

            mesh.material.side = THREE.DoubleSide;
            mesh.receiveShadow = true;

            mesh.rotation = { x: - Math.PI / 2, y: 0, z: 0 };
            mesh.position = { x: floor.position.x, y: -0.01 * ( i + 1 ), z: floor.position.y };

            this.group.add(mesh);
        }

        this.scene.add(this.group);
    }
    /**
     * Environment.addLines
     * e.g.: Environment.addLines();
     */
    addLines() {
        this.group = new THREE.Object3D();

        for(var i = this.lines.length; i >= 0; --i) {
            var geometry = new THREE.PlaneGeometry(this.config.floorWidth, 0.3, 0);
            var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.7 });
            var mesh = new THREE.Mesh(geometry, material);

            mesh.material.side = THREE.DoubleSide;
            mesh.receiveShadow = true;

            mesh.rotation = { x: - Math.PI / 2, y: 0, z: 0 };
            mesh.position = { x: this.config.floorWidth / 2, y: 0.01, z: this.lines[i] };

            this.group.add(mesh);
        }

        this.scene.add(this.group);
    }
    /**
     * Environment.addStartCaption
     * e.g.: Environment.addStartCaption();
     *
     * Adds StartCaptions from 1-4
     */
    addStartCaption() {
        this.group = new THREE.Object3D();

        for(var i = 0; i < 4; i++) {
            var geometry = new THREE.TextGeometry(i, { font: 'helvetiker', height: 0.01, size: 0.9 });
            var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
            var mesh = new THREE.Mesh(geometry, material);

            mesh.rotation = { x: - Math.PI / 2, y: 0, z: 0 };
            mesh.position = { x: this.config.trackWidth * i + this.config.trackWidth / 2, y: 0, z: 1 }

            THREE.GeometryUtils.center(geometry);
            this.group.add(mesh);
        }

        this.scene.add(this.group);
    }
    /**
     * Environment.addFog
     * e.g.: Environment.addFog();
     */
    addFog() {
        this.scene.fog = new THREE.FogExp2("#c1e9e4", 0.01, 10);
    }
    /**
     * Environment.addWinnerCaption
     * e.g.: Environment.addWinnerCaption(1);
     *
     * @param track {Number} 1-4
     */
    addWinnerCaption(track) {
        this.group = new THREE.Object3D();
        var text = 'CHAMPION 4EVER';

        var geometry = new THREE.TextGeometry(text, { font: 'helvetiker', height: 0.01, size: 1.8 });
        var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, opacity: 0.9 });
        var mesh = new THREE.Mesh(geometry, material);

        mesh.rotation = { x: - Math.PI / 2, y: 0, z: Math.PI / 2 };
        mesh.position = { x: this.config.trackWidth * (track - 1) + 1.3, y: 0, z: -12 }

        THREE.GeometryUtils.center(geometry);
        this.group.add(mesh);

        this.scene.add(this.group);
    }
}