///////////////////////////////////////////
///////////////////////////////////////////
//WHAT WE STARTED WITH - BEFORE HEROKU INTEGRATION
///////////////////////////////////////////
///////////////////////////////////////////
// // Let's build a server!
// var express = require('express'),
//   port = process.env.PORT || 3000,
//   app = express();
//
// app.use(express.static('./'));
//
// app.get('*', function(request, response) {
//   console.log('New request:', request.url);
//   response.sendFile('index.html', {root: '.'});
// });
//
// app.listen(port, function() {
//   console.log('Server started on port ' + port + '!');
// });
///////////////////////////////////////////
//END
///////////////////////////////////////////

var express = require('express'),
//we added the below line in class
  requestProxy = require('express-request-proxy'),
  // NOTE: require in our request proxy module
  port = process.env.PORT || 3000,
  app = express();

// NOTE: now use our proxy within a function to request
//        our github data on the server.
var proxyGithub = function(request, response){
  console.log('Routing GitHub request for: ', request.params[0]);
  (requestProxy({
    url: 'https://api.github.com/'+ request.params[0],
    headers: {Authorization: 'token ' + process.env.GITHUB_TOKEN}
  }))(request, response);
};
app.get('/github/*', proxyGithub);


app.use(express.static('./'));

app.get('*', function(request, response) {
  console.log('New request:', request.url);
  response.sendFile('index.html', { root: '.' });
});

app.listen(port, function() {
  console.log('Server started on port ' + port + '!');
});

