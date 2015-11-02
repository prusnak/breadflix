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

  ipfsd.local(function(err, node) {
    if (!node.initialized) {
      console.info('Initializing IPFS daemon');
      node.init({
        directory: userPath, // TODO
        keySize              // TODO
      }, function(err, res) {
      });
    }
    console.info('Starting IPFS daemon');
    node.startDaemon(function (err, ipfsNode) {});
    ipfsDaemon = node;
  });

  mainWindow = new BrowserWindow({width: 800, height: 450});
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    console.info('Stopping IPFS daemon');
    ipfsDaemon.stopDaemon(function(err) {});
    ipfsDaemon = null;
    mainWindow = null;
  });

});
