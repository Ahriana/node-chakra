/* eslint "prefer-template": "off" */

console.log('CHAKRA PRE-BUILD');

var os = require('os');
var https = require('https');
var fs = require('fs');
var path = require('path');
var unzip = require('unzip');

var platform = os.platform();
var arch = os.arch();

function start() {
    console.log(platform, arch);
    var fn = platform === 'win32' ? getWin : getOther;
    getVersion((err, v) => {
        if (err) { throw err; }
        return fn(v);
    });
}

function getWin(v) {
    v = v.tag_name.substring(1);
    var MS_URL = 'https://az320820.vo.msecnd.net/packages/microsoft.chakracore.vc140.' + v + '.nupkg';
    console.log(MS_URL);
    downloadFile(MS_URL, 'file.zip', (err) => {
        if (err) { throw err; }
        console.log('ChakraCore downloaded\nUnzipping file');

        unzipFile('file.zip', (err2) => {
            if (err2) { throw err; }
            console.log('extracted zip!');

            moveHeaders(path.join(__dirname, 'tmp', 'chakra-bin', 'build', 'native', 'include'), (err3) => {
                if (err3) { throw err3; }
                console.log('headers moved');

                moveLib((err4) => {
                    if (err4) { throw err3; }
                    console.log('lib moved');
                });
            });
        });
    });
}


function getOther(v) { // eslint-disable-line
    v = v.tag_name.substring(1).replace(/\./g, '_');
    throw new Error('OS / PLATFORM not yet supported! ' + platform + '_' + arch);
    // console.log(`https://aka.ms/chakracore/cc_${platform}_${arch}_${v}`);
}

function getVersion(cb) {
    https.get('https://api.github.com/repos/Microsoft/ChakraCore/releases/latest', { headers: { 'User-Agent': 'node-chakracore' } }, (res) => {
        var data = '';
        res.on('data', c => { data += c; });
        res.on('end', () => { cb(null, JSON.parse(data)); });
    }).on('err', (err) => { cb(err, null); });
}

function downloadFile(url, out, cb) {
    var dest = path.join(__dirname, 'tmp', out);
    var file = fs.createWriteStream(dest);
    https.get(url, (res) => {
        res.pipe(file);
        file.on('finish', () => { file.close(cb); });
    }).on('error', (err) => {
        fs.unlink(dest);
        cb(err);
    });
}

function unzipFile(file, cb) {
    var archive = fs.createReadStream(path.join(__dirname, 'tmp', file)).pipe(unzip.Extract({ path: path.join(__dirname, 'tmp', 'chakra-bin') }));
    archive.on('close', () => { cb(); });
    archive.on('error', (err) => { cb(err); });
}

function moveHeaders(from, cb) {
    var dest = path.join(__dirname, 'tmp', 'headers');
    try {
        fs.copyFileSync(path.join(from, 'ChakraCommon.h'), path.join(dest, 'ChakraCommon.h'));
        fs.copyFileSync(path.join(from, 'ChakraCommonWindows.h'), path.join(dest, 'ChakraCommonWindows.h'));
        fs.copyFileSync(path.join(from, 'ChakraCore.h'), path.join(dest, 'ChakraCore.h'));
        fs.copyFileSync(path.join(from, 'ChakraDebug.h'), path.join(dest, 'ChakraDebug.h'));
    } catch (error) {
        return cb(error);
    }
    return cb();
}

function moveLib(cb) {
    // chakra-bin\lib\native\v140\x64\release
    var from = path.join(__dirname, 'tmp', 'chakra-bin', 'lib', 'native', 'v140', arch, 'release');
    var dest = path.join(__dirname, 'tmp', 'headers');
    try {
        fs.copyFileSync(path.join(from, 'ChakraCore.dll'), path.join(dest, 'ChakraCore.dll'));
        fs.copyFileSync(path.join(from, 'ChakraCore.lib'), path.join(dest, 'ChakraCore.lib'));
    } catch (error) {
        return cb(error);
    }

    return cb();
}
start();
