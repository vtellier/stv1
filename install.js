/* Build script for the deployment process */

const fs = require('fs');

const srcPath = './src';
const binPath = './bin';

class SourceFile {
    constructor(path, stats){
        this.Path = path;
        this.Stats = stats;
    }
}

function parseFolder(path) {
    var files = fs.readdirSync(path).map(curr => {
        return new Promise((resolve, reject) => {
            // Get information about the item
            var currentPath = path + '/' + curr;
            fs.stat(currentPath, (err, stats) => {
                if(err) return reject(err);
                if(stats.isDirectory(currentPath))
                    resolve(parseFolder(currentPath));
                else
                    resolve(new SourceFile(currentPath, stats));
            });
        });
    });
    return Promise.all(files);
}

// Read all the src files, compress and save them to the build folder.
var files = parseFolder(srcPath);
files.then((...args) => console.log(args));

