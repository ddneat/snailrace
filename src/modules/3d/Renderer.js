export class Renderer {
    /**
     * constructor
     * e.g.: new Renderer()
     */
    constructor(scene) {
        this.scene = scene;

        this.addPointLight();
        this.addDirectionalLight();
        this.init();
    }
    /**
     * Renderer.init
     * e.g.: Renderer.init();
     */
    init () {
        this.webglRenderer = new THREE.WebGLRenderer( {antialias: true, clearColor: 0xc1e9e4, clearAlpha: 1 } );

        this.webglRenderer.setSize(window.innerWidth, window.innerHeight);
        this.webglRenderer.sortElements = false;

        this.webglRenderer.shadowMapEnabled = true;
        this.webglRenderer.shadowMapSoft = true;
        this.webglRenderer.shadowMapType = THREE.PCFSoftShadowMap;
        this.webglRenderer.physicallyBasedShading = true;
    }
    /**
     * Renderer.addDirectionalLight
     * e.g.: Renderer.addDirectionalLight();
     */
    addPointLight() {
        var PointLight = new THREE.PointLight(0xffffff, 0.2);
        PointLight.position.set(10,20,-40);
        this.scene.add(PointLight);
    }
    /**
     * Renderer.addDirectionalLight
     * e.g.: Renderer.addDirectionalLight();
     */
    addDirectionalLight() {
        var directionalLight  = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(10,20,10);

        directionalLight.shadowDarkness = 0.7;
        directionalLight.shadowCameraRight = 30;
        directionalLight.shadowCameraLeft = -30;
        directionalLight.shadowCameraTop = 30;
        directionalLight.shadowCameraBottom = -30;
        directionalLight.shadowCameraNear = 1;
        directionalLight.shadowCameraFar = 60;

        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }
    /**
     * Player.render
     * e.g.: Renderer.render();
     */
    render() {

    }
}