const dependable = require('dependable');
const path = require('path');

const container = dependable.container();
const myDependencies = [
    ['_', 'lodash'],
];

myDependencies.forEach(function (val) {
    container.register(val[0], function () {
        return require(val[1]);
    });
});
// using dependencies to thoes files
container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register('container', function () {
    return container;
});

module.exports = container;