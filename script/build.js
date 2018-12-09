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

    let files;
    try {
        // Read all the src files, compress and save them to the build folder
        files = await parseFolder(process.env.SRC_PATH);

        console.log("Source files:", files.map(item => item.FilePath()));
        
        // Clean and recreate the destination folder
        if (fs.existsSync(process.env.BIN_PATH)){
            console.log(`Going to remove the folder ${process.env.BIN_PATH}`);
            rimraf.sync(process.env.BIN_PATH);
        }
        fs.mkdirSync(process.env.BIN_PATH);

        // Parse all the files, build them and write them to the destination folder
        console.log("Starting build");
        var artifacts = files.map(file => file.Build());
        artifacts = await Promise.all(artifacts);

        artifacts.forEach(artifact => {
            // Check if the path exists, create it otherwise
            var destination = artifact.Path.split('/');
            destination.pop();
            destination = process.env.BIN_PATH + '/' + destination.join('/');
            if (!fs.existsSync(destination)){
                fs.mkdirSync(destination);
            }
            fs.writeFile(process.env.BIN_PATH + '/' + artifact.Path, artifact.Content, err => {
                if(err) console.warn(err);
            });
        });
    }
    catch (e) {
        console.error(`Shit happened:`, e);
    }
}

main();

