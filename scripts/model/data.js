(function(module) {
  var repos = {};
  repos.allRepos=[];
  repos.northVals = [];
  repos.southVals = [];
// TODO: create a githubToken.js file that we can use to generate our headers
         // properly.
  repos.requestRepos = function(callback) {
    /* TODO: How would you like to fetch your repos? Someone say AJAX?!
      Do not forget to call the callback! */
      //DONE
    $.getJSON({
      // url: 'https://api.github.com/users/reganoneill/repos',
      url: 'https://data.seattle.gov/resource/4xy5-26gy.json',
      type: 'GET',
      // headers: {'Authorization': 'token ' + githubToken},
      success: function(data, message, xhr){
        console.log(message);
        repos.allRepos = data;

        callback();
        console.log(data);
        console.log('end data');
        // console.log(data.filter(function(a){
        //   return parseInt(a.fremont_bridge_nb) >= 375 && parseInt(a.fremont_bridge_sb) >= 300;
        // }));
      }
    });

  };

  repos.withTheAttribute = function(myAttr) {
    /* NOTE: This Model method filters the full repos collection based
        on a particular attribute. For example, you could use this
        to filter all repos that have a forks_count, stargazers_count,
        or watchers_count. */
    return repos.allRepos.filter(function(aRepo) {
      return aRepo[myAttr];
    });
  };

  module.repos = repos;
})(window);


// (function(module) {
//   var reposObj = {};
//
//   reposObj.requestRepos = function(callback) {
//     // NOTE: refactor this request into an $.get call
//     $.when(
//      $.get('/github/users/reganoneill/repos', function(data){
//        console.log('about to run repo data...');
//        reposObj.allRepos = data;
//        console.log(data);
//        console.log('done running repo data...');
//      }),
//      $.get('/github/users/reganoneill/followers', function(data){
//        reposObj.followers = data;
//        console.log('next - followers: ');
//        console.log(data);
//        console.log('done logging followers');
//      })
//     ).done(callback);
//   };
//
//   reposObj.withTheAttribute = function(attr) {
//     return reposObj.allRepos.filter(function(aRepo) {
//       return aRepo[attr];
//     });
//   };
//
//   module.reposObj = reposObj;
// })(window);
// function getFieldsTest(input, field) {
//   var output = [];
//   for (var i=0; i < input.length ; ++i)
//     output.push({input['fremont_bridge_nb']: input[i].fremont_bridge_nb});
//   return output;
// }
