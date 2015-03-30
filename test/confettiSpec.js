global.self = {};
global.window = {};
global.document = {};
global.console.warn = function(){};
global.THREE = require('three');
import assert from 'assert';
import { Confetti } from '../src/modules/3d/Confetti.js';

var confetti = null;

describe('Confetti', function() {


    beforeEach(function(){
        confetti = new Confetti(new THREE.Scene(), {trackWidth: 2}, 1);
    });

    describe('init', function() {

        it('particles added', function () {
            confetti.init();
            assert.notEqual(confetti.particles.length, 0);
        });
    });
});
