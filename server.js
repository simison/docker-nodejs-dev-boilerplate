/**
 * Extremely Simple NodeJS+MongoDB server script
 *
 * I don't recommend using this as-is.
 *
 * Check out more sophisticated setups such as
 * excellent MEAN.js boilerplate: http://meanjs.org/
 */

var StaticServer = require('static-server'),
    mongodb = require('mongodb');

/**
 * Setup the Server
 */
var server = new StaticServer({
  rootPath: './public',
  port: process.env.PORT || 3000,
  followSymlink: true,
  index: 'index.html'
});

/**
 * Connect to MongoDB
 */
var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/app'
MongoClient.connect(mongoUrl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error: ', err);
  } else {
    console.log('Connection established to ', mongoUrl);

    // ... do some work here with the database

    // Start the server
    server.start(function () {
      console.log('Server listening to', server.port);
    });

    // Close MongoDB connection
    db.close();
  }
});

/**
 * Setup server event listeners
 */
server.on('request', function (req, res) {
  // req.path is the URL resource (file name) from server.rootPath
  // req.elapsedTime returns a string of the request's elapsed time
});

server.on('symbolicLink', function (link, file) {
  // link is the source of the reference
  // file is the link reference
  console.log('File', link, 'is a link to', file);
});

server.on('response', function (req, res, err, stat, file) {
  // res.status is the response status sent to the client
  // res.headers are the headers sent
  // err is any error message thrown
  // file the file being served (may be null)
  // stat the stat of the file being served (is null if file is null)
  // NOTE: the response has already been sent at this point

  if(err) {
    console.error(err);
  }
  else if(res.status === 404) {
    console.error('File not found!');
  }
  else {
    console.log(res.status + ': ' + stat);
  }
});
