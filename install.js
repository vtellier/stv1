/* Build script for the deployment process */

const fs = require('fs');
const zlib = require('zlib');

const srcPath = './src';
const binPath = './bin';

class SourceFile {
    constructor(path, name, stats){
        this.Path = path.substring(srcPath.length + 1);
        this.Stats = stats;

        var extPoint = name.split('.');
        if(extPoint.length > 1) {
            this.Extension = extPoint.pop();
            this.Name = extPoint.join('.');
        }
        else {
            this.Name = name;
            this.Extension = '';
        }
    }
    FilePath() { return this.Path + '/' + this.Name + '.' + this.Extension; }
    SourceFilePath() { return srcPath + '/' + this.FilePath(); }
    DestinationFilePath() {
        if(this.Extension != 'html')
            return binPath + '/' + this.FilePath();
        else
            return binPath + '/' + this.Path + '/' + this.Name;
    }
    async Build() {
        console.log(`Gonna build myself: ${this.Path} -> ${this.Name} -> ${this.Extension}`);

        var raw = fs.readFileSync(this.SourceFilePath());
        var content;
        if(this.Extension == 'html') {
            content = await this.Compress(raw);
            console.log(`Compression: ${raw.length} => ${content.length}`);
        }
        else
            content = raw;

        // Check if the path exists, create it otherwise
        var destination = this.DestinationFilePath().split('/');
        destination.pop();
        destination = destination.join('/');
        if (!fs.existsSync(destination)){
            fs.mkdirSync(destination);
        }
        fs.writeFile(this.DestinationFilePath(), content, err => {
            if(err)
                console.warn(err);
        });

    }
    Compress(input) {
        return new Promise((resolve, reject) => {
            zlib.deflate(input, (err, buffer) => {
                if (err) return reject(err);
                else     return resolve(buffer);
            });
        });
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
                    resolve(new SourceFile(path, curr, stats));
            });
        });
    });

    var fileList;
    try { fileList = await Promise.all(files); }
    catch (e) { return []; }
    
    return fileList.reduce((acc, curr) => {
        if(Array.isArray(curr))
            acc = acc.concat(curr);
        else
            acc.push(curr);
        return acc;
    }, []);
}

async function main() {
    // Read all the src files, compress and save them to the build folder.
    let files;
    try {
        files = await parseFolder(srcPath);
        console.log("Source files:", files.map(item => item.Path));

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

