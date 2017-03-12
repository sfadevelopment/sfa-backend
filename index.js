// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var app = express();
app.use('/public', express.static(path.join(__dirname, '/public')));
require('./cloud/app')(app);

var service_info = require('./cloud/service_info');


var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  appName: 'Seek Fine Art',
  databaseURI: databaseUri || 'mongodb://produser:1234asdfasdf4321@localhost/prod',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppIdaoisudfhqweosdkshwhwjsllffqoisd',
  masterKey: process.env.MASTER_KEY || 'masterKeyashdfsjhasdfjhoasdjoasdjksdffe', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://parseapi.seekfineart.com/parse',  // Don't forget to change to https if needed
  //clientKey: process.env.CLIENT_KEY || 'superMegaClientKeyasd21390sajf37yhsdfiauh328gt7rg3247gap',
  publicServerURL: "https://parseapi.seekfineart.com/parse",
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  },

  filesAdapter: {
    module: "parse-server-fs-adapter"
  },
  push: {
    ios: {
      pfx: '/home/sfa/SFA_PUSH_CERT.p12',
      bundleId: 'com.roomartgallery.seekfineart',
      production: true
    }
  },

    emailAdapter: {
        module: 'parse-server-mandrill-adapter',
        options: {
            // API key from Mandrill account
            apiKey: 'T66xZbmBdJnYW4-NwBpArw',
            // From email address
            fromEmail: 'no-reply@seekfineart.com',
            // Display name
            displayName: 'no-reply@seekfineart.com',
            // Reply-to email address
            replyTo: 'no-reply@seekfineart.com',
            // Verification email subject
            verificationSubject: 'Please verify your e-mail for Seek fine art',
            // Verification email body. This will be ignored when verificationTemplateName is used.
            verificationBody: 'Hi *|username|*,\n\nYou are being asked to confirm the e-mail address *|email|* with Seek Fine Art*\n\nClick here to confirm it:\n*|link|*',
            // Password reset email subject
            passwordResetSubject: 'Password Reset Request for *|appname|*',
            // Password reset email body. This will be ignored when passwordResetTemplateName is used.
            passwordResetBody: 'Hi *|username|*,\n\nYou requested a password reset for Seek fine art.\n\nClick here to reset it:\n*|link|*',


        }
    }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey



// Serve static assets from the /public folder


// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

app.all('*', function(req, res, next) {
    var origin = req.get('origin');
    console.log("Origin was: " + origin);
    service_info.site.api_allowed_origins.forEach(function(allowedOrigin) {
        if (allowedOrigin == origin) {
            res.header('Access-Control-Allow-Origin', allowedOrigin);
        }
    });
    //res.header('Access-Control-Allow-Origin', "test"); //https://sfaweb.parseapp.com
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, Content-Length, X-Requested-With,  Accept, X-Parse-Application-ID, x-parse-rest-api-key, x-parse-session-token');
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
});

// Parse Server plays nicely with the rest of your web routes
// app.get('/', function(req, res) {
//   res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
// });

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
// app.get('/test', function(req, res) {
//   res.sendFile(path.join(__dirname, '/public/test.html'));
// });


var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);


