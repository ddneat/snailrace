import assert from 'assert';
import { Highscore } from '../src/modules/Highscore.js';

var mockStorage = null;

describe('Highscore', function() {

    beforeEach(function(){
        mockStorage = {
            setItem: function (key, val) {
                this[key] = val + '';
            },
            getItem: function (key) {
                return this[key];
            }
        };
    });

    it('should return an empty array', function() {
        var highscore = new Highscore(mockStorage);
        assert.deepEqual(highscore.getJSON(), []);
    });

    it('should save new records', function() {
        var highscore = new Highscore(mockStorage);
        highscore.saveItem('david', 11);
        assert.equal(highscore.getJSON().length, 1);
    });

    it('should return array with one object containing a record', function() {
        var highscore = new Highscore(mockStorage);
        highscore.saveItem('joscha', 11);
        assert.deepEqual(highscore.getJSON(), [ { name: 'joscha', time: '11' } ] );
    });

    it('should return a string', function() {
        var highscore = new Highscore(mockStorage);
        assert.equal(typeof(highscore.getHTML()), 'string');
    });

    it('should return an empty string', function() {
        var highscore = new Highscore(mockStorage);
        assert.equal(highscore.getHTML().length, 0);
    });

    it('should return not an empty string', function() {
        var highscore = new Highscore(mockStorage);
        highscore.saveItem('david', 11);
        assert.notEqual(highscore.getHTML().length, 0);
    });

    it('should return sorted records', function() {
        var highscore = new Highscore(mockStorage);
        highscore.saveItem('david', 22);
        highscore.saveItem('joscha', 11);
        highscore.saveItem('david', 33);

        assert.deepEqual(highscore.getJSON()[0].time, 11);
        assert.deepEqual(highscore.getJSON()[1].time, 22);
        assert.deepEqual(highscore.getJSON()[2].time, 33);
    });
});