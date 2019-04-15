const PackageJson = require('./package');

const algorithm = PackageJson.scripts;
console.log('Here the list of all available process');
delete algorithm.start;
Object.keys(algorithm).forEach(function(key, keyIndex) {
    console.log(`${keyIndex+1}: ${key}, do => npm run ${key}`);
});