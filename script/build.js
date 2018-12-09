/* Build script for the deployment process */

const dotenv     = require('dotenv');
const rimraf     = require('rimraf');
const fs         = require('fs');
const SourceFile = require('./SourceFile');



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
                    resolve(new SourceFile(path, curr, stats));
            });
        });
    });

    var fileList;
    try { fileList = await Promise.all(files); }
    catch (e) {
        console.warn(`Error happened while parsing the path ${path}:`, e);
        return [];
    }
    
    return fileList.reduce((acc, curr) => {
        if(Array.isArray(curr))
            acc = acc.concat(curr);
        else
            acc.push(curr);
        return acc;
    }, []);
}

async function main() {
    dotenv.config();

    // Read all the src files, compress and save them to the build folder.
    let files;
    try {
        files = await parseFolder(process.env.SRC_PATH);
        console.log("Source files:", files.map(item => item.FilePath()));
        
        if (fs.existsSync(process.env.BIN_PATH)){
            console.log(`Going to remove the folder ${process.env.BIN_PATH}`);
            rimraf.sync(process.env.BIN_PATH);
        }
        fs.mkdirSync(process.env.BIN_PATH);

        console.log("Starting build");
        files.forEach(file => {
            file.Build();
        });
    }
    catch (e) {
        console.error(`Shit happened:`, e);
    }
}

main();

