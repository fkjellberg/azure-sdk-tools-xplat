/**
* Copyright 2012 Microsoft Corporation
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var uuid = require('node-uuid');

var should = require('should');
var cli = require('../cli');
var capture = require('../util').capture;

var createdSites = [];

function newName() {
  // suwatch var name = 'testsite-' + uuid.v4();
  // createdSites.push(name);
  var name = 'cliLogStream01';
  return name;
}

function doCapture(action, cb) {
  return capture(action, function (result) {
    if (result.exitStatus == 0) {
      cb(null, result);
    } else {
      cb(result.errorText || ('exit code: ' + result.exitStatus));
    }
  });
}

suite('cli', function () {
  suite('site log', function () {

    teardown(function (_) {
      while (createdSites.length !== 0) {
        var siteName = createdSites.pop();
        var cmd = ('node cli.js site delete ' + siteName + ' --json --quiet').split(' ');
        doCapture(function () {
          cli.parse(cmd);
        }, _);
      }
    });

    test('tail', function (_) {
      var result,
          siteName = newName();
      //result = doCapture(function () { createSite(siteName); }, _);
      result = doCapture(function () { connectLogStream(siteName); }, _);
      result.text.should.include('Welcome, you are now connected to log-streaming service.');
    });

    function createSite(siteName) {
      var cmd = ('node cli.js site create ' + siteName + ' --json --location').split(' ');
      cmd.push('West US');
      cli.parse(cmd);
    }

    function connectLogStream(siteName) {
      setTimeout(function () { process.exit(0); }, 5000);
      var cmd = ('node cli.js site log tail ' + siteName).split(' ');
      cli.parse(cmd);
    }
  });
});
