var Client = require('../models/client');
var async = require('async');
var DAvatar = require('../models/davatar');
var User = require('../models/user');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// Retrieve all clients.
exports.client_list = function(req, res, next) {

    Client.find({owner: req.user.id}, 'first_name family_name')
      .sort([['family_name', 'ascending']])
      .exec(function (err, list_clients) {
        if (err) { return next(err); }
        
        res.render('client/client_list', { title: 'Client List', client_list: list_clients });
      });
  
  };
// Display detail page for a specific Client.
exports.client_detail = function(req, res, next) {

    async.parallel({
        client: function(callback) {
            Client.findById(req.params.id)
              .exec(callback)
        },
        clients_davatars: function(callback) {
          DAvatar.find({ 'client': req.params.id },'name')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.client==null) { // No results.
            var err = new Error('Client not found');
            err.status = 404;
            return next(err);
        }
        res.render('client/client_detail', { title: 'Client Detail', client: results.client, client_davatars: results.clients_davatars } );
    });
};

// Get client create form.
exports.client_create_get = function(req, res, next) {       
    res.render('client/client_form', { title: 'Create Client'});
};

// Post client create form.
exports.client_create_post = [

    // Check all fields for correctness
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),

    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            
            res.render('client/client_form', { title: 'Create Client', client: req.body, errors: errors.array() });
            return;
        }
        else {
            // Create client with validated data.
            var client = new Client(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    phone: req.body.phone,
                    email: req.body.email,
                    owner: req.user.id
                });
            client.save(function (err) {
                if (err) { return next(err); }
                res.redirect(client.url);
            });
        }
    }
];

// Get delete client form
exports.client_delete_get = function (req, res, next) {

    async.parallel({
        client: function (callback) {
            Client.findById(req.params.id).exec(callback)
        },
        clients_davatars: function (callback) {
            DAvatar.find({ 'client': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.client == null) { // No results.
            res.redirect('/pattern/clients');
        }

        // Successful, so render.
        res.render('client/client_delete', { title: 'Delete Client', client: results.client, client_davatars: results.clients_davatars });
    });
};

// Post client delete form.
exports.client_delete_post = function (req, res, next) {

    async.parallel({
        client: function (callback) {
            Client.findById(req.body.clientid).exec(callback)
        },
        clients_davatars: function (callback) {
            DAvatar.find({ 'client': req.body.clientid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.
        if (results.clients_davatars.length > 0) {
            // Client still has davatars.Deleting will create orphan avatars so display info.
            res.render('client/client_delete', { title: 'Delete Client', client: results.client, client_davatars: results.clients_davatars });
            return;
        }
        else {
            // Client has no davatars. Delete.
            Client.findByIdAndRemove(req.body.clientid, function deleteClient(err) {
                if (err) { return next(err); }
                res.redirect('/pattern/clients')
            })
        }
    });
};

// Get client update form.
exports.client_update_get = function (req, res, next) {

    Client.findById(req.params.id, function (err, client) {
        if (err) { return next(err); }
        if (client == null) { // No results.
            var err = new Error('Client not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('client/client_form', { title: 'Update Client', client: client });
    });
};

// Post client update form.
exports.client_update_post = [
    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),

    (req, res, next) => {

        // Gather all errors
        const errors = validationResult(req);

        // Ensure you use previous data to create clients
        var client = new Client(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                phone: req.body.phone,
                email:req.body.email,
                owner: req.user.id,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            
            res.render('client/client_form', { title: 'Update Client', client: client, errors: errors.array() });
            return;
        }
        else {
            // Valid data so update
            Client.findByIdAndUpdate(req.params.id, client, {}, function (err, theclient) {
                if (err) { return next(err); }
                // Successful.
                res.redirect(theclient.url);
            });
        }
    }
];