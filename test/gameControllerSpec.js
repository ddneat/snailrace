var assert = require('assert');
//var gameController = require('../js/gameController.js');

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

function setGameOver(winID){
    gameOver = true;
    winner = winID;

    gameOverScreen(getEndTime());
    console.log("snail on track" + (winID+1) + " won");
    // render message in webgl
    var text = "CHAMPION 4EVER";
    var objName = "winner", fontheight = 0.01, fontsize = 1.8, color = 0xFFFFFF;
    createCaption(text, fontheight, fontsize,
        position = { x: floor_width / 4 * winID + 1.3, y: 0, z: -12 },
        rotation = { x: - Math.PI / 2, y: 0, z: Math.PI / 2 },
        color, 0.9, objName, lambert = true, shadow = true);

    // add ParticleSystem to scene
    addParticleSystem(winID);

    cameraFinish.position.set(1,4, playerSnails[winID].position.z-8);

    // keep movement for 3 seconds enabled
    function removeControlls(){
        window.removeEventListener('keyup', checkModelMove, false);
    }
    setTimeout(removeControlls, 3000);
}

describe('gameController', function(){
    describe('setGameOver', function(){
        it('is game over', function(){
            setGameOver(0);
            assert.equal(gameOver, true);
        })
    })
});