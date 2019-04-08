var express = require('express');
var router = express.Router();

// Require controller modules.
var davatar_controller = require('../controllers/davatarController');
var avatar_controller = require('../controllers/avatarController');
var client_controller = require('../controllers/clientController');
var skirt_controller = require('../controllers/skirtController');

// GET pattern home page.
router.get('/report', ensureAuthenticated, isAdmin, skirt_controller.report);

//DAVATAR ROUTES //
// GET request for creating a DAvatar. 
router.get('/davatar/create', ensureAuthenticated, isDesigner, davatar_controller.davatar_create_get);

// POST request for creating DAvatar.
router.post('/davatar/create', davatar_controller.davatar_create_post);

// GET request for one DAvatar.
router.get('/davatar/:id', ensureAuthenticated, isDesigner, davatar_controller.davatar_detail);

// GET request for list of all DAvatar items.
router.get('/davatars', ensureAuthenticated, isDesigner, davatar_controller.davatar_list);

// GET request to delete DAvatar.
router.get('/davatar/:id/delete', ensureAuthenticated, isDesigner, davatar_controller.davatar_delete_get);

// POST request to delete DAvatar.
router.post('/davatar/:id/delete', davatar_controller.davatar_delete_post);

// GET request to update DAvatar.
router.get('/davatar/:id/update', ensureAuthenticated, isDesigner, davatar_controller.davatar_update_get);

// POST request to update DAvatar.
router.post('/davatar/:id/update', davatar_controller.davatar_update_post);

// GET request for creating a DAvatar draft. 
router.get('/davatar/:id/draft', ensureAuthenticated, isDesigner, davatar_controller.davatar_draft_get);

//AVATAR ROUTES //
// GET request for creating an Avatar. 
router.get('/avatar/create', ensureAuthenticated, isIndividual, avatar_controller.avatar_create_get);

// POST request for creating Avatar.
router.post('/avatar/create', avatar_controller.avatar_create_post);

// GET request for one Avatar.
router.get('/avatar/:id',  ensureAuthenticated, isIndividual, avatar_controller.avatar_detail);

// GET request for list of all Avatars.
router.get('/avatars',  ensureAuthenticated, isIndividual, avatar_controller.avatar_list);

// GET request to delete Avatar.
router.get('/avatar/:id/delete', ensureAuthenticated, isIndividual, avatar_controller.avatar_delete_get);

// POST request to delete Avatar.
router.post('/avatar/:id/delete', avatar_controller.avatar_delete_post);

// GET request to update Avatar.
router.get('/avatar/:id/update', ensureAuthenticated, isIndividual, avatar_controller.avatar_update_get);

// POST request to update Avatar.
router.post('/avatar/:id/update', avatar_controller.avatar_update_post);

// GET request to draft Avatar.
router.get('/avatar/:id/draft',  ensureAuthenticated, isIndividual, avatar_controller.avatar_draft_get);

//CLIENT ROUTES //
// GET request for creating Client. 
router.get('/client/create', ensureAuthenticated, isDesigner, client_controller.client_create_get);

// POST request for creating Client.
router.post('/client/create', client_controller.client_create_post);


// GET request for one Client.
router.get('/client/:id', ensureAuthenticated, isDesigner, client_controller.client_detail);

// GET request for list of all Clients.
router.get('/clients', ensureAuthenticated, isDesigner, client_controller.client_list);

// GET request to delete Client.
router.get('/client/:id/delete', ensureAuthenticated, isDesigner, client_controller.client_delete_get);

// POST request to delete Client
router.post('/client/:id/delete', client_controller.client_delete_post);

// GET request to update Client.
router.get('/client/:id/update', ensureAuthenticated, isDesigner, client_controller.client_update_get);

// POST request to update Client.
router.post('/client/:id/update', client_controller.client_update_post);


//SKIRT ROUTES //
// GET request for creating an Avatar. 
router.get('/skirt/create', ensureAuthenticated, isAdmin, skirt_controller.skirt_create_get);

// POST request for creating Avatar.
router.post('/skirt/create', skirt_controller.skirt_create_post);

// GET request for one Avatar.
router.get('/skirt/:id', skirt_controller.skirt_detail);

// GET request for list of all Avatars.
router.get('/skirts', skirt_controller.skirt_list);

// GET request to delete Avatar.
router.get('/skirt/:id/delete', ensureAuthenticated, isAdmin, skirt_controller.skirt_delete_get);

// POST request to delete Avatar.
router.post('/skirt/:id/delete', skirt_controller.skirt_delete_post);

// GET request to update Avatar.
router.get('/skirt/:id/update', ensureAuthenticated, isAdmin, skirt_controller.skirt_update_get);

// POST request to update Avatar.
router.post('/skirt/:id/update', skirt_controller.skirt_update_post);

// GET request to draft Avatar.
router.get('/skirt/:id/draft', skirt_controller.skirt_draft_get);


module.exports = router;
// check if user is logged in
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }

  req.flash('error_msg', 'You need to be logged in to access this page');
  res.redirect('/users/login');
}

// use role value to check if user is admin
function isAdmin(req, res, next) {
if (req.isAuthenticated() && res.locals.user.role == 2) {
    next();
}
else {
    req.flash('danger', 'Access Restricted: Please log in as admin.');
    res.redirect('/');
}
}

// use role value to check if user is designer
function isDesigner(req, res, next) {
if (req.isAuthenticated() && res.locals.user.role == 1) {
    next();
}
else {
    req.flash('danger', 'Access Restricted: Please log in as designer.');
    res.redirect('/');
}
}

// use role value to check if user is individual
function isIndividual(req, res, next) {
if (req.isAuthenticated() && res.locals.user.role == 0) {
    next();
}
else {
    req.flash('danger', 'Access Restricted: Only individual clients can access this page.');
    res.redirect('/');
}
}