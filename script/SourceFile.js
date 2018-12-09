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
    FilePath() { return (this.Path.length > 0 ? this.Path + '/' : '') + this.Name + '.' + this.Extension; }
    SourceFilePath() { return process.env.SRC_PATH + '/' + this.FilePath(); }
    DestinationFilePath() {
        if(this.Extension != 'html') return this.FilePath();
        else                         return (this.Path.length > 0 ? this.Path + '/' : '') + this.Name;
    }
    async Build() {
        var artifact = {
            MetaData: {}
        };
        var raw = fs.readFileSync(this.SourceFilePath());

        artifact.MetaData["CacheControl"] = "max-age=2592000";
        if(this.Extension == 'html') {
            artifact.Content = await this.Compress(raw);
            artifact.MetaData["ContentType"] = "text/html; charset=UTF-8";
            artifact.MetaData["ContentEncoding"] = "deflate";
        }
        else {
            if(this.Extension == 'ico') {
                artifact.MetaData["ContentType"] = "image/x-icon";
            }
            else if(this.Extension == 'jpeg' || this.Extension == 'jpg') {
                artifact.MetaData["ContentType"] = "image/jpeg";
                artifact.MetaData["CacheControl"] = "max-age=31536000";
            }

            artifact.Content = raw;
        }
        artifact.MetaData["ACL"] = "public-read";
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
