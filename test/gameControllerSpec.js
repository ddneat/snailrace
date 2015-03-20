var assert = require('assert');
var gameController = require('../js/extractedSetGameOver.js');

describe('gameController', function(){
    describe('setGameOver', function(){
        it('is game over', function(){
            gameController.setGameOver(0);
            assert.equal(gameOver, true);
        })
    })
});