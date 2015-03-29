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
            this.addControls();
            this.game.startGame(this.gameOverCallback.bind(this));
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
     * Snailrace.playerInput
     * e.g.: Snailrace.playerInput();
     */
    playerInput(e) {
        if (e.keyCode == 81 || e.which == 81) { // q
            this.game.modelMove(0);
        } else if (e.keyCode == 67 || e.which == 67) { // c
            this.game.modelMove(1);
        } else if (e.keyCode == 78 || e.which == 78) { // n
            this.game.modelMove(2);
        } else if (e.keyCode == 80 || e.which == 80) { // p
            this.game.modelMove(3);
        }
    }
    /**
     * Snailrace.addControls
     * e.g.: Snailrace.addControls();
     */
    addControls() {
        $(window).on('keyup', this.playerInput.bind(this));
    }
    /**
     * Snailrace.removeControls
     * e.g.: Snailrace.removeControls();
     */
    removeControls() {
        setTimeout(function(){
            $(window).off('keyup');
        }, 3000);
    }
    /**
     * Snailrace.gameOverCallback
     * e.g.: Snailrace.gameOverCallback();
     */
    gameOverCallback() {
        $('#gameOverInput').show(1200);
        $('#timeElapsed').html( this.game.endTime + " Sek.");

        $('#highscoreBtn').click(function(){
            this.saveHighscore();
        }).bind(this);

        $('#playerName').focus(1200).keypress(function(e){
            if(e.keyCode == 13) this.saveHighscore();
        }).bind(this);

        this.removeControls();
    }
    /**
     * Snailrace.saveHighscore
     * e.g.: Snailrace.saveHighscore();
     */
    saveHighscore() {
        this.highscore.saveItem($('#playerName').val(), this.game.endTime, function() {
            window.location.reload();
        });
    }
}

new Snailrace();