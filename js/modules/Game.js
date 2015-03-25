var startTime = 0;
var floor_width;
var winner;
var playerSnails = [
    {
        position: {
            z: 0
        }
    }
];
function gameOverScreen() {}
function createCaption() {}
function addParticleSystem() {}
var cameraFinish = {
    position: {
        set: function() {}
    }
};

export class Game {

    constructor() {
        this.isGameOver = false;
    }

    getEndTime() {
        var endTime = (new Date().getTime() - startTime) / 1000;//highscore-time
        endTime.toFixed(3);
        return endTime;
    }

    removeControls() {
        // keep movement for 3 seconds enabled
        setTimeout(function(){
            window.removeEventListener('keyup', checkModelMove, false);
        }, 3000);
    }

    renderChampionText(winID) {
        // render message in webgl
        var objName = "winner", fontheight = 0.01, fontsize = 1.8, color = 0xFFFFFF;
        createCaption("CHAMPION 4EVER", fontheight, fontsize,
            {x: floor_width / 4 * winID + 1.3, y: 0, z: -12},
            {x: -Math.PI / 2, y: 0, z: Math.PI / 2},
            color, 0.9, objName, true, true);
    }

    setGameOverScreen(winID) {
        gameOverScreen(this.getEndTime());
        this.renderChampionText(winID);
        // add ParticleSystem to scene
        addParticleSystem(winID);

        cameraFinish.position.set(1, 4, playerSnails[winID].position.z - 8);
    }

    setGameOver(winID){
        this.isGameOver = true;

        winner = winID;
        this.setGameOverScreen(winID);
        this.removeControls();
    }
}