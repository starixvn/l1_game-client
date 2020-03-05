var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var manifest = {
    packageUrl: 'http://minigame.luminetsoft.com/hot-update',
    remoteManifestUrl: 'http://minigame.luminetsoft.com/hot-update/project.manifest',
    remoteVersionUrl: 'http://minigame.luminetsoft.com/hot-update/version.manifest',
    version: '1.0.9',
    assets: {},
    searchPaths: []
};

var dest = './assets/';
var src = './build/jsb-link/';
var serverDest = './build/web-mobile/hot-update/';
var nativeSrc = './build/jsb-link/';
var nativeAppInstallPath = './build/web-mobile/';

// Parse arguments
var i = 2;
while ( i < process.argv.length) {
    var arg = process.argv[i];

    switch (arg) {
    case '--url' :
    case '-u' :
        var url = process.argv[i+1];
        manifest.packageUrl = url;
        manifest.remoteManifestUrl = url + 'project.manifest';
        manifest.remoteVersionUrl = url + 'version.manifest';
        i += 2;
        break;
    case '--version' :
    case '-v' :
        manifest.version = process.argv[i+1];
        i += 2;
        break;
    case '--src' :
    case '-s' :
        src = process.argv[i+1];
        i += 2;
        break;
    case '--dest' :
    case '-d' :
        dest = process.argv[i+1];
        i += 2;
        break;
    default :
        i++;
        break;
    }
}


function readDir (dir, obj) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            readDir(subpath, obj);
        }
        else if (stat.isFile()) {
            // Size in Bytes
            size = stat['size'];
            md5 = crypto.createHash('md5').update(fs.readFileSync(subpath)).digest('hex');
            compressed = path.extname(subpath).toLowerCase() === '.zip';

            relative = path.relative(src, subpath);
            relative = relative.replace(/\\/g, '/');
            relative = encodeURI(relative);
            obj[relative] = {
                'size' : size,
                'md5' : md5
            };
            if (compressed) {
                obj[relative].compressed = true;
            }
        }
    }
}

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}

// Iterate res and src folder
readDir(path.join(src, 'src'), manifest.assets);
readDir(path.join(src, 'res'), manifest.assets);

var destManifest = path.join(dest, 'project.manifest');
var destVersion = path.join(dest, 'version.manifest');

var serverDestManifest = path.join(serverDest, 'project.manifest');
var serverDestVersion = path.join(serverDest, 'version.manifest');

mkdirSync(dest);

fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
  if (err) throw err;
  console.log('Manifest successfully generated');
});

if (!fs.existsSync(serverDest)){
    fs.mkdirSync(serverDest);
}

fs.writeFile(serverDestManifest, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    console.log('Manifest Server successfully generated');
  });

delete manifest.assets;
delete manifest.searchPaths;
fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
  if (err) throw err;
  console.log('Version successfully generated');
});

fs.writeFile(serverDestVersion, JSON.stringify(manifest), (err) => {
    if (err) throw err;
    console.log('Version successfully generated');
  });

try {
  var ncp = require('ncp').ncp;

  ncp.limit = 16;

  ncp(path.join(src, 'res'), path.join(serverDest, 'res'), function (err) {
    if (err) {
    return console.error(err);
    }
    console.log('copy res done!');
});

ncp(path.join(src, 'src'), path.join(serverDest, 'src'), function (err) {
    if (err) {
    return console.error(err);
    }
    console.log('copy src done!');
});


    ncp(path.join(nativeSrc, 'publish/android'), path.join(nativeAppInstallPath, 'native-apps'), function (err) {
        if (err) {
        return console.error(err);
        }
        console.log('copy native apps done!');
    });
}
catch(ex)
{
    console.log(ex)
}


