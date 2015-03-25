import assert from 'assert';
import { Game } from '../src/modules/Game.js';

describe('Game', function(){
    describe('setGameOver', function(){
        it('is game over', function(){
            var game = new Game();
            game.setGameOver(0);
            assert.equal(game.isGameOver, true);
        })
    })
});