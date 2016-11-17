
(function(module) {
var profile = {};
function Profile (opts) {
  for (var keys in opts) {
    this[keys] = opts[keys];
  }
}

profile.allProfiles = [];

Profile.prototype.toHtml = function(scriptTemplateId) {
  var template = Handlebars.compile($(scriptTemplateId).html());
  return template(this);
};
profile.renderAboutPage = function() {
  profile.allProfiles.forEach(function(a){
    $(".profiles").append(a.toHtml("#the-team-template"));
  });
};

//load the json data from team-profiles.json, put it into an array of objects
profile.loadAll = function(inputData) {
  inputData.forEach(function(ele) {
    profile.allProfiles.push(new Profile(ele));
  });
};

profile.fetchAll = function() {
  if (localStorage.profiles) {
    var cachedLocalStorage = JSON.parse(localStorage.profiles);
    console.log(cachedLocalStorage);
    profile.loadAll(cachedLocalStorage);
    profile.renderAboutPage();
    console.log('first condition is running');
  } else {
    $.getJSON('/data/team-profiles.json', function(data){
      localStorage.setItem('profiles', JSON.stringify(data));
      profile.loadAll(data);
      //how about this thang?!
      profile.renderAboutPage();
      console.log('else is running');
    });
  }
};


profile.fetchAll();

// $.getJSON('/data/team-profiles.json', function(data){
//   profile.loadAll(data);
// });
 module.profile = profile;
})(window);
