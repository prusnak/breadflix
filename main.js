var app = require('app');
var BrowserWindow = require('browser-window');
var ipfsd = require('ipfsd-ctl');

require('crash-reporter').start();

var mainWindow = null;
var ipfsDaemon = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {

  var bfPath = (process.env.HOME || process.env.USERPROFILE) + '/.breadflix';

  ipfsd.local(bfPath, function(err, node) {
    if (!node.initialized) {
      console.info('Initializing IPFS daemon in', bfPath);
      node.init({
        directory: bfPath
      }, function(err, res) {
        if (err) console.log(err);
      });
    }
    console.info('Starting IPFS daemon');
    node.startDaemon(function (err, ipfsNode) {
      if (err) console.log(err);
    });
    ipfsDaemon = node;
  });

  mainWindow = new BrowserWindow({width: 1024, height: 768});
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    console.info('Stopping IPFS daemon');
    ipfsDaemon.stopDaemon(function(err) {
      if (err) console.log(err);
    });
    ipfsDaemon = null;
    mainWindow = null;
  });

});
