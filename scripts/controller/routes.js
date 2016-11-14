'use strict';
page('/', home);
page('/about', about);
page('/stats', stats);

function stats(){
  statsController.reveal();
}
// TODO: What function do we call to activate page.js?
page();
