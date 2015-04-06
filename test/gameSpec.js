global.self = {};
global.window = {};
global.document = {};

import assert from 'assert';
import { Game } from '../src/modules/Game.js';
import { THREE } from '../test/helpers/threeHelper.js';
global.THREE = THREE;

describe.skip('Game', function() {
    describe('setGameOver', function() {

        it('is game over', function () {
            var game = new Game();
            game.setGameOver(0);
            assert.equal(game.isGameOver, true);
        });
    });
 });
