/* global describe,it */

describe('Module', () => {
    describe('#require()', () => {
        it('should return module', () => require('./../src') !== undefined);
    });
});

describe('Runner', () => {
    describe('#return sync', () => {
        it('return value 2', () => require('./../src').run('1 + 1') === '2');
    });
});
