import { Highscore } from './modules/Highscore.js';
import { Game } from './modules/Game.js';

class Snailrace {
    /**
     * constructor
     * e.g.: new Snailrace()
     */
    constructor() {
        this.playerCount = 2;

        this.highscore = new Highscore();
        this.game = new Game();

        this.addStartButton();
        this.addConfigOptions();
        this.loadHighscore();
    }
    /**
     * Snailrace.addStartButton
     * e.g.: Snailrace.addStartButton();
     */
    addStartButton() {
        document.getElementById("startgame").addEventListener('click', (function() {
            $('#lobbyContainer').hide("slide", {direction:"up", easing: 'easeInCubic'}, 1000);
            this.game.startGame();
        }).bind(this), false);
    }
    /**
     * Snailrace.loadHighscore
     * e.g.: Snailrace.loadHighscore();
     */
    loadHighscore() {
        $('#high').append(this.highscore.getHTML());
    }
    /**
     * Snailrace.addConfigOptions
     * e.g.: Snailrace.addConfigOptions();
     */
    addConfigOptions() {
        $("#playerAdd").click(function() {
            playerCount < 4 && $("#playerCount").html(++this.playerCount);
        });

        $("#playerRemove").click(function() {
            playerCount > 4 && $("#playerCount").html(++this.playerCount);
        });
    }
    /**
     * Snailrace.gameOverCallback
     * e.g.: Snailrace.gameOverCallback();
     */
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
    /**
     * Snailrace.highscoreSavedCallback
     * e.g.: Snailrace.highscoreSavedCallback();
     */
    highscoreSavedCallback() {
        window.location.reload();
    }
}

new Snailrace();