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

async function parseFolder(path) {
    var files = fs.readdirSync(path).map(curr => {
        return new Promise((resolve, reject) => {
            // Get information about the item
            var currentPath = path + '/' + curr;
            fs.stat(currentPath, (err, stats) => {
                if(err) return reject(err);
                if(stats.isDirectory(currentPath))
                    parseFolder(currentPath).then(resolve);
                else
                    resolve(new SourceFile(currentPath, stats));
            });
        });
    });
    return new Promise((resolve, reject) => {
        Promise.all(files).then(fileList => {
            resolve(fileList.reduce((acc, curr) => {
                if(Array.isArray(curr))
                    return acc.concat(curr);
                else {
                    acc.push(curr);
                    return acc;
                }
            }, []));
        });
    });
}

async function main() {
    // Read all the src files, compress and save them to the build folder.
    let files;
    try {
        files = await parseFolder(srcPath);
        console.log(files.map(item => item.Path));
    }
    catch (e) {
        console.error(`Shit happened:`, e);
    }
}

main();

