const fs = require('fs');
const zlib = require('zlib');

class SourceFile {
    constructor(path, name, stats){
        this.Path = path.substring(process.env.SRC_PATH.length + 1);
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
    SourceFilePath() { return process.env.SRC_PATH + '/' + this.FilePath(); }
    DestinationFilePath() {
        if(this.Extension != 'html')
            return process.env.BIN_PATH + '/' + this.FilePath();
        else
            return process.env.BIN_PATH + '/' + this.Path + '/' + this.Name;
    }
    async Build() {
//        console.log(`Gonna build myself: ${this.Path} -> ${this.Name} -> ${this.Extension}`);

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

module.exports = SourceFile;
