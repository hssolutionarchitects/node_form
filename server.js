var http = require('http');
var https = require('https');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');

var server = http.createServer(function (req, res) {
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        //processAllFieldsOfTheForm(req, res);
        processFormFieldsIndividual(req, res);
    }
});

function displayForm(res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });
}

function processFormFieldsIndividual(req, res) {
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    var fields = [];
    var form = new formidable.IncomingForm();
    form.on('field', function (field, value) {
        console.log(field);
        console.log(value);
        fields[field] = value;
    });

    form.on('end', function () {

        console.log("will call createHootsuiteTeamMember")
        createHootsuiteTeamMember(fields)

        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields
        }));
    });
    form.parse(req);
}

function createHootsuiteTeamMember(fields) {

  var options = {
    "method": "POST",
    "hostname": "apis.hootsuite.com",
    "port": null,
    "path": "/v1/members",
    "headers": {
      "content-type": "application/json;charset=utf-8",
      "cache-control": "no-cache",
      "authorization":"Bearer d3407ee0-8bd4-433f-b4b5-c5753539eb08"
    }
  };

  var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });

  var requestBody = {
  	"fullName": fields['name'],
  	"email": fields['email'],
  	"organizationIds": [518372],
  	"timezone": "America/Vancouver"
  };
  console.log(requestBody);
  req.write(JSON.stringify(requestBody));
  req.end();
}
server.listen(1185);
console.log("server listening on 1185");
