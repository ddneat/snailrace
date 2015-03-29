export class Renderer {
    /**
     * constructor
     * e.g.: new Renderer()
     */
    constructor(game, scene) {
        this.game = game;
        this.scene = scene;

        this.addInGameCamera();
        this.addFinishCamera();
        this.addMultipleViewports();

        this.addRenderer();
        this.addPointLight();
        this.addDirectionalLight();
        this.setRenderTarget();
    }
    /**
     * Renderer.addRenderer
     * e.g.: Renderer.addRenderer();
     */
    addRenderer () {
        this.webglRenderer = new THREE.WebGLRenderer( {antialias: true, clearColor: 0xc1e9e4, clearAlpha: 1 } );
        this.webglRenderer.setSize(window.innerWidth, window.innerHeight);
        this.webglRenderer.sortElements = false;

        this.webglRenderer.shadowMapEnabled = true;
        this.webglRenderer.shadowMapSoft = true;
        this.webglRenderer.shadowMapType = THREE.PCFSoftShadowMap;
        this.webglRenderer.physicallyBasedShading = true;

        THREEx.WindowResize(this.webglRenderer, this.camera);
    }
    /**
     * Renderer.addInGameCamera
     * e.g.: Renderer.addInGameCamera();
     */
    addInGameCamera() {
        this.camera = new THREE.PerspectiveCamera(45,  window.innerWidth / window.innerHeight, 0.1, 100000);
        this.camera.position.set(10, 10, 10);
        this.camera.lastPosition = new THREE.Vector3(10,10,10);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.scene.add(this.camera);
    }
    /**
     * Renderer.updateInGameCamera
     * e.g.: Renderer.updateInGameCamera();
     *
     * @param lookAtZ {Number}
     */
    updateInGameCamera(lookAtZ) {
        this.camera.target = new THREE.Vector3(0,0,-lookAtZ);
        this.camera.lastPosition = this.camera.position;
        this.camera.lookAt(this.camera.target);
        this.camera.translateX(lookAtZ / 120);
    }
    /**
     * Renderer.addFinishCamera
     * e.g.: Renderer.addFinishCamera();
     */
    addFinishCamera() {
        this.cameraFinish = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
        this.cameraFinish.position.set(10, 10, 10);
        this.cameraFinish.lastPosition = new THREE.Vector3(10,10,10);
        this.cameraFinish.lookAt(new THREE.Vector3(0,0,0));
        this.scene.add(this.cameraFinish);
    }
    /**
     * Renderer.addMultipleViewports
     * e.g.: Renderer.addMultipleViewports();
     */
    addMultipleViewports() {
        var _this = this;
        this.views = [
            {
                left: 0, bottom: 0, width: 1.0, height: 1.0, eye: [ 10, 10, 10 ], up: [ 0, 1, 0 ],
                updateCamera: function ( camera ) {
                    camera.position = camera.lastPosition;
                    camera.lookAt( camera.target );
                }
            }, {
                left: 0, bottom: 0.6, width: 0.4, height: 0.4, eye: [ 0, 10, 0 ], up: [ 0, 0, 1 ],
                updateCamera: function (camera) {
                    camera.position.x = camera.position.x * Math.cos(0.1) + Math.sin(0.1);
                    camera.position.z = camera.position.z * Math.cos(0.1) - Math.sin(0.1);
                    camera.lookAt( _this.playerSnails.snails[_this.winner].position );
                }
            }
        ];

        this.views[0].camera = this.camera;
        this.views[1].camera = this.cameraFinish;
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
     * Renderer.setRenderTarget
     * e.g.: Renderer.setRenderTarget();
     */
    setRenderTarget() {
        var container = document.createElement( 'div' );
        document.body.appendChild( container );
        container.id = 'viewport';
        container.appendChild( this.webglRenderer.domElement );
    }
    /**
     * Renderer.render
     * e.g.: Renderer.render();
     */
    render() {
        if(this.isGameOver){
            this.confetti.animate();

            //viewports
            for ( var k = 0; k < this.views.length; ++k ) {

                this.camera = this.views[k].camera;
                this.views[k].updateCamera( this.camera, this.scene);

                var left   = Math.floor( window.innerWidth  * this.views[k].left );
                var bottom = Math.floor( window.innerHeight * this.views[k].bottom );
                var width  = Math.floor( window.innerWidth  * this.views[k].width );
                var height = Math.floor( window.innerHeight * this.views[k].height );
                this.webglRenderer.setViewport( left, bottom, width, height );
                this.webglRenderer.setScissor( left, bottom, width, height );
                this.webglRenderer.enableScissorTest ( true );

                this.camera.aspect = width / height;
                this.camera.updateProjectionMatrix();

                this.webglRenderer.render(this.scene, this.camera);
            }
        }

        if(!this.game.isGameOver) {
            this.webglRenderer.render(this.scene, this.camera);
        }

        var _this = this;
        requestAnimationFrame(function(){
            _this.render();
        });
    }
}