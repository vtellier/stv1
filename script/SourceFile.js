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
        if(this.Extension != 'html') return this.FilePath();
        else                         return this.Path + '/' + this.Name;
    }
    async Build() {
        var artifact = {
            MetaData: {}
        };
        var raw = fs.readFileSync(this.SourceFilePath());

        if(this.Extension == 'html') {
            artifact.Content = await this.Compress(raw);
            artifact.MetaData["Content-Type"] = "text/html; charset=UTF-8";
            artifact.MetaData["Content-Encoding"] = "gzip";
        }
        else if(this.Extension == 'ico') {
            artifact.MetaData["Content-Type"] = "image/x-icon";
        }
        else if(this.Extension == 'jpeg' || this.Extension == 'jpg') {
            artifact.MetaData["Content-Type"] = "image/jpeg";
        }
        else
            artifact.Content = raw;
        artifact.Path = this.DestinationFilePath();


        return artifact;
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
