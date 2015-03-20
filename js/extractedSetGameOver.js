var startTime = 0;
var floor_width;
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

function getEndTime() {
    var endTime = (new Date().getTime() - startTime) / 1000;//highscore-time
    endTime.toFixed(3);
    return endTime;
}

function removeControls() {
    // keep movement for 3 seconds enabled
    setTimeout(function(){
        window.removeEventListener('keyup', checkModelMove, false);
    }, 3000);
}

function renderChampionText(winID) {
// render message in webgl
    var objName = "winner", fontheight = 0.01, fontsize = 1.8, color = 0xFFFFFF;
    createCaption("CHAMPION 4EVER", fontheight, fontsize,
        position = {x: floor_width / 4 * winID + 1.3, y: 0, z: -12},
        rotation = {x: -Math.PI / 2, y: 0, z: Math.PI / 2},
        color, 0.9, objName, lambert = true, shadow = true);
}
function setGameOverScreen(winID) {
    gameOverScreen(getEndTime());
    renderChampionText(winID);
    // add ParticleSystem to scene
    addParticleSystem(winID);

    cameraFinish.position.set(1, 4, playerSnails[winID].position.z - 8);
}
function setGameOver(winID){
    gameOver = true;
    winner = winID;
    setGameOverScreen(winID);
    removeControls();
}

exports.setGameOver = setGameOver;