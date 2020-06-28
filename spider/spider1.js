const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utilities');

function saveFile(filename, contents, callback) {
  mkdirp(path.dirname(filename), err => {
    if (err) {
      return callback(err);
    }
    fs.writeFile(filename, contents, callback);
  });
}

function spider(url, callback) {
  const filename = utilities.urlToFilename(url);
  console.log('file path', filename);

  fs.exists(filename, exists => {
    if (exists) {
      return callback(null, filename, false);
    }
    console.log(`Downloading ${url}`);

    request(url, (err, response, body) => {
      if (err) {
        return callback(err);
      }
      console.log('path dirname', path.dirname(filename));
      saveFile(filename, body, err => {
        if(err) {
          return callback(err);
        }
        callback(null, filename, true);
      });
    });
  });
}

module.exports = spider;
