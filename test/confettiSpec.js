import assert from 'assert';
import { Confetti } from '../src/modules/3d/Confetti.js';
import { THREE } from '../test/helpers/threeHelper.js';
global.THREE = THREE;

describe('Confetti', function() {

    var confetti = null;

    beforeEach(function(){
        confetti = new Confetti(new THREE.Scene(), {}, 1);
    });

    describe('init', function() {

        it('should have particles array', function () {
            var particlesToString = Object.prototype.toString.call(confetti.particles);
            assert.deepEqual(particlesToString, '[object Array]');
        });

        it('should have some particles', function () {
            assert.notEqual(confetti.particles.length, 0);
        });

    });

    describe('random color', function() {

        it('should be a string', function () {
            assert.equal(typeof(confetti.getRandomColor()), 'string');
        });

        it('should have a hash prefix', function () {
            assert.equal(confetti.getRandomColor()[0], '#');
        });

        it('should have correct length', function () {
            assert.equal(confetti.getRandomColor().length, 7);
        });

    });

});
