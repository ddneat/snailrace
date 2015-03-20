global.window = {
    innerWidth: 0,
    innerHeight: 0
};

var assert = require('assert');

describe('main', function(){
    describe('Parse Localstorage', function(){
        it('should return nothing', function(){
            global.localStorage = [];
            assert.equal();
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
});

