import { Highscore } from './modules/Highscore.js';
import { Game } from './modules/Game.js';

class Snailrace {
    constructor() {
        this.playerCount = 2;

        this.highscore = new Highscore();
        this.game = new Game();

        this.addStartButton();
        this.addConfigOptions();
        this.loadHighscore();
    }

    addStartButton() {
        document.getElementById("startgame").addEventListener('click', (function() {
            $('#lobbyContainer').hide("slide", {direction:"up", easing: 'easeInCubic'}, 1000);
            this.game.startGame();
        }).bind(this), false);
    }

    loadHighscore() {
        $('#high').append(this.highscore.getHTML());
    }

    addConfigOptions() {
        $("#playerAdd").click(function() {
            playerCount < 4 && $("#playerCount").html(++this.playerCount);
        });

        $("#playerRemove").click(function() {
            playerCount > 4 && $("#playerCount").html(++this.playerCount);
        });
    }

    gameOverCallback() {
        $('#gameOverInput').show(1200);
        $('#timeElapsed').html(data.endTime+" Sek.");

        var $playerNameInput = $('#playerName').focus(1200);

        $('#highscoreBtn').click(function(){
            this.highscore.saveItem($('#playerName').val(), data.endTime);
        }).bind(this);

        $playerNameInput.keypress(function(e){
            if(e.keyCode == 13){
                this.highscore.saveItem($('#playerName').val(), data.endTime);
            }
        }).bind(this);

        this.game.setGameOverScreen();
        this.game.removeControls();
    }

    highscoreSavedCallback() {
        window.location.reload();
    }
}

new Snailrace();