var startTime = 0;
var floor_width;
var winner;

function gameOverScreen() {}
function createCaption() {}
function addParticleSystem() {}
var cameraFinish = {
    position: {
        set: function() {}
    }
};




export class Game {

    constructor(options) {
        this.isGameOver = false;
        this.playerSnails = options.playerSnails;
        this.particles = [];
        this.scene = options.scene;
    }

    getEndTime() {
        var endTime = (new Date().getTime() - startTime) / 1000;//highscore-time
        endTime.toFixed(3);
        return endTime;
    }

    renderChampionText(winID) {
        // render message in webgl
        var objName = "winner", fontheight = 0.01, fontsize = 1.8, color = 0xFFFFFF;
        createCaption("CHAMPION 4EVER", fontheight, fontsize,
            {x: floor_width / 4 * winID + 1.3, y: 0, z: -12},
            {x: -Math.PI / 2, y: 0, z: Math.PI / 2},
            color, 0.9, objName, true, true);
    }

    addParticleSystem(index){
        console.log('addParticleSytem');
        var materials = [], size;
        size  = 0.1; // size of particle
        var x = this.playerSnails.snails[index].position.x;

        for (var i = 0; i < 15; i++) {
            var geometry = new THREE.Geometry();
            // add particle to particle system
            var amount = 1200;
            for ( var j = 0; j < amount; j ++ ) {

                var vertex = new THREE.Vector3();
                vertex.x = Math.random() * 2 - 1;
                vertex.y = Math.random() * 15 - 1;
                vertex.z = Math.random() * 30 - 1;
                vertex.velocity = new THREE.Vector3(0, -1, 0);
                geometry.vertices.push( vertex );
            }

            materials[i] = new THREE.ParticleBasicMaterial( { size: size } );
            var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
            materials[i].color = new THREE.Color(randomColor);
            this.particles[i] = new THREE.ParticleSystem( geometry, materials[i] );
            this.particles[i].position.set(x,1,-26);
            this.particles[i].sortPosition = true;
            this.scene.add(this.particles[i]);
        }
    }

    //animates the particle system
    animateParticleSystem(){

        for (var i = 0; i < this.particles.length; i++) {
            if(this.particles[i].position.y < -1){
                this.particles[i].position.y = 1;
            }
            this.particles[i].position.y -= 0.1*Math.random();
        }
    }

    setGameOverScreen(winID) {
        gameOverScreen(this.getEndTime());
        this.renderChampionText(winID);
        // add ParticleSystem to scene
        this.addParticleSystem(winID);

        console.log(this.playerSnails, winID);
        cameraFinish.position.set(1, 4, this.playerSnails.snails[winID].position.z - 8);
    }

    setGameOver(winID){
        this.isGameOver = true;

        winner = winID;
        this.setGameOverScreen(winID);
        $(this).trigger('game_over');
    }
}