import { Highscore } from './modules/Highscore.js';
import { Game } from './modules/Game.js';

var highscore = new Highscore();
var game = new Game();

$('#high').append(highscore.getHTML());

game.pubsub.subscribe('game:over', function(data) {
    console.log(data);
    $('#gameOverInput').show(1200);
    $('#timeElapsed').html(data.endTime+" Sek.");

    var $playerNameInput = $('#playerName').focus(1200);

    $('#highscoreBtn').click(function(){
        highscore.saveItem($('#playerName').val(), data.endTime);

    });

    $playerNameInput.keypress(function(e){
        if(e.keyCode == 13){
            highscore.saveItem($('#playerName').val(), data.endTime);
        }
    });

    game.setGameOverScreen();
    game.removeControls();
});

highscore.pubsub.subscribe('highscore:saved', function() {
    window.location.reload();
});

// set player count by value
function setPlayerCount(amount){
    $("#playerCount").html(amount);
}
//shows settings
function showSettings(){
    $("#playerAdd").click(function() {
        if(playerCount < 4){
            setPlayerCount(++playerCount);
        }
    });
    $("#playerRemove").click(function() {
        if(playerCount > 1){
            setPlayerCount(--playerCount);
        }
    });
}

showSettings();

var startBtn = document.getElementById("startgame");
startBtn.addEventListener('click', function(){
    game.startGame();
}, false);