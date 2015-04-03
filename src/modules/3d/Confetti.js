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
        for (var i = 0; i < 15; i++) {
            this.particles[i] = new THREE.ParticleSystem(this.getParticleGeometry(), this.getParticleMaterial());
            this.particles[i].position.set(this.getTrackPositionX(), 1, -26);
            this.particles[i].sortPosition = true;

            this.scene.add(this.particles[i]);
        }
    }
    /**
     * Confetti.getTrackPositionX
     * e.g.: Confetti.getTrackPositionX();
     *
     * @return {Number}
     */
    getTrackPositionX() {
        return this.config.trackWidth * (this.track - 1) + 1.3;
    }
    /**
     * Confetti.getParticleGeometry
     * e.g.: Confetti.getParticleGeometry();
     *
     * @return {Object}
     */
    getParticleGeometry() {
        var geometry = new THREE.Geometry();

        for ( var j = 0; j < 1200; j ++ ) {
            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2 - 1;
            vertex.y = Math.random() * 15 - 1;
            vertex.z = Math.random() * 30 - 1;
            vertex.velocity = new THREE.Vector3(0, -1, 0);
            geometry.vertices.push( vertex );
        }

        return geometry;
    }
    /**
     * Confetti.getParticleMaterial
     * e.g.: Confetti.getParticleMaterial();
     *
     * @return {Object}
     */
    getParticleMaterial() {
        var material = new THREE.ParticleBasicMaterial( { size: 0.1 } );
        material.color = new THREE.Color(this.getRandomColor());
        return material;
    }
    /**
     * Confetti.getRandomColor
     * e.g.: Confetti.getRandomColor();
     *
     * return {String} #000000
     */
    getRandomColor() {
        return "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);})
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