export class Counter {
    /**
     * constructor
     * e.g.: new Counter()
     *
     * Countdown starts automatically
     *
     * @param scene {Object}
     * @param callback {function} optional
     */
    constructor(scene, callback) {
        this.scene = scene;
        this.callback = callback || () => {};
        this.count = 5;
        this.timer = null;

        this.start();
    }
    /**
     * Counter.start
     * e.g.: Counter.start();
     *
     * Starts the Countdown with an interval of 1s
     */
    start() {
        this.timer = setInterval(this.decrement.bind(this), 1000);
    }
    /**
     * Counter.decrement
     * e.g.: Counter.decrement();
     */
    decrement() {
        this.removeText();
        --this.count ? this.createText(this.count, 0xff3333) : this.stop();
    }
    /**
     * Counter.decrement
     * e.g.: Counter.stop();
     */
    stop() {
        clearInterval(this.timer);
        this.createText("GO!", 0x33ff33)
        this.callback();
    }
    /**
     * Counter.decrement
     * e.g.: Counter.createText("Go!", 0x33ff33);
     *
     * Adds the given text to the scene
     */
    createText(text, color) {
        this.geometry = new THREE.TextGeometry(text, { font: 'helvetiker', height: 1, size: 4, divisions: 1 });
        this.material = new THREE.MeshLambertMaterial({color: color, transparent: true, opacity: 1});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = "counter";

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.rotation = { x: 0, y: Math.PI / 2, z: 0 };
        this.mesh.position = { x: -1, y: 2.1, z: -2 };

        THREE.GeometryUtils.center(this.geometry);
        this.scene.add(this.mesh);
    }
    /**
     * Counter.decrement
     * e.g.: Counter.removeText();
     *
     * Removes the counter visualisation from the scene
     */
    removeText() {
        this.scene.remove(this.scene.getChildByName("counter"));
    }
}