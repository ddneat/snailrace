export class Confetti {
    /**
     * constructor
     * e.g.: new Confetti()
     *
     * Winner Confetti Animation
     *
     * @param scene {Object}
     * @param track {Number} 1-4
     */
    constructor(scene, config, track) {
        this.scene = scene;
        this.config = config;
        this.track = track;

        this.particles = [];
        this.init();
    }
    /**
     * Confetti.init
     * e.g.: Confetti.init();
     */
    init() {
        var materials = [];
        var positionX = this.config.trackWidth * (this.track - 1) + 1.3;

        for (var i = 0; i < 15; i++) {
            var geometry = new THREE.Geometry();

            for ( var j = 0; j < 1200; j ++ ) {
                var vertex = new THREE.Vector3();
                vertex.x = Math.random() * 2 - 1;
                vertex.y = Math.random() * 15 - 1;
                vertex.z = Math.random() * 30 - 1;
                vertex.velocity = new THREE.Vector3(0, -1, 0);
                geometry.vertices.push( vertex );
            }

            var color = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
            materials[i] = new THREE.ParticleBasicMaterial( { size: 0.1 } );
            materials[i].color = new THREE.Color(color);

            this.particles[i] = new THREE.ParticleSystem( geometry, materials[i] );
            this.particles[i].position.set(positionX, 1, -26);
            this.particles[i].sortPosition = true;

            this.scene.add(this.particles[i]);
        }
    }
    /**
     * Confetti.animate
     * e.g.: Confetti.animate();
     */
    animate() {
        for (var i = 0; i < this.particles.length; i++) {
            if(this.particles[i].position.y < -1){
                this.particles[i].position.y = 1;
            }
            this.particles[i].position.y -= 0.1*Math.random();
        }
    }
}