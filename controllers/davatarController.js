const fs = require('fs');
var DAvatar = require('../models/davatar');
var Avatar = require('../models/avatar');
var Client = require('../models/client');
var User = require('../models/user');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async'); 

// Display list of all DAvatars.
exports.davatar_list = function(req, res, next) {

    DAvatar.find({owner: req.user.id}, 'name client')
      .populate('client')
      .exec(function (err, list_davatars) {
        if (err) { return next(err); }
        //Successful
        res.render('davatar/davatar_list', { title: 'DAvatar List', davatar_list: list_davatars });
      });
      
  };
// Display page for specific davatar.
exports.davatar_detail = function(req, res, next) {

    async.parallel({
        davatar: function(callback) {

            DAvatar.findById(req.params.id)
              .populate('client')
              .exec(callback);
        },
     
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.davatar==null) { // No results.
            var err = new Error('DAvatar not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('davatar/davatar_detail', { title: 'Name', davatar:  results.davatar } );
    });

};
// Get davatar creation page.
exports.davatar_create_get = function(req, res, next) { 
      
    // Get all clients.
    async.parallel({
        clients: function(callback) {
            Client.find(callback);
        },
      
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('davatar/davatar_form', { title: 'Create DAvatar', clients: results.clients });
    });
    
};

// Post davatar creation page.
exports.davatar_create_post = [ 

    // Validate fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('client', 'Client must not be empty.').isLength({ min: 1 }).trim(),
    body('waist', 'waist measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('hip', 'hip measurement must not be empty').isLength({ min: 1 }).trim(),
    body('side_hip_depth', 'side_hip_depth measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('front_hip_depth', 'front_hip_depth measurement must not be empty').isLength({ min: 1 }).trim(),
    body('back_hip_depth', 'back_hip_depth measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('skirt_length', 'skirt_length measurement must not be empty').isLength({ min: 1 }).trim(),
    body('back_hip_arc', 'back_hip_arc measurement must not be empty.').isLength({ min: 1 }).trim(),
      
    // Sanitize all fields
    sanitizeBody('*').trim().escape(),

   
    (req, res, next) => {
        
        // Gather all validaation errors
        const errors = validationResult(req);

        // Create davatar with valid data
        var davatar = new DAvatar(
          { name: req.body.name,
            client: req.body.client,
            owner: req.user.id,
            waist: req.body.waist,
            hip: req.body.hip,
            side_hip_depth: req.body.side_hip_depth,
            front_hip_depth: req.body.front_hip_depth,
            back_hip_depth: req.body.back_hip_depth,
            skirt_length: req.body.skirt_length,
            back_hip_arc: req.body.back_hip_arc            
           });

        if (!errors.isEmpty()) {
            
            async.parallel({
                clients: function(callback) {
                    Client.find(callback);
                },
           
            }, function(err, results) {
                if (err) { return next(err); }

             
                res.render('davatar/davatar_form', { title: 'Create DAvatar',clients:results.clients, davatar: davatar, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save davatar.
            davatar.save(function (err) {
                if (err) { return next(err); }
                   //successful
                   res.redirect(davatar.url);
                });
        }
    }
];

// Get davatar delete form.
exports.davatar_delete_get = function(req, res, next) {

    async.parallel({
        davatar: function(callback) {
            DAvatar.findById(req.params.id).populate('client').exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.davatar==null) { // No results.
            res.redirect('/pattern/davatars');
        }
        // Successfull.
        res.render('davatar/davatar_delete', { title: 'Delete DAvatar', davatar: results.davatar } );
    });

};

// Post davatar delete form.
exports.davatar_delete_post = function(req, res, next) {
    async.parallel({
        davatar: function(callback) {
            DAvatar.findById(req.params.id).populate('client').exec(callback);
        }        
    }, function(err, results) {
        if (err) { return next(err); }

        else {
    
            DAvatar.findByIdAndRemove(req.body.id, function deleteDAvatar(err) {
                if (err) { return next(err); }
                // Success.
                res.redirect('/pattern/davatars');
            });

        }
    });

};

// Get davatar update form.
exports.davatar_update_get = function(req, res, next) {

    // Get davatar and load clients for form.
    async.parallel({
        davatar: function(callback) {
            DAvatar.findById(req.params.id).populate('client').exec(callback);
        },
        clients: function(callback) {
            Client.find(callback);
        }
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.davatar==null) { // No results.
                var err = new Error('DAvatar not found');
                err.status = 404;
                return next(err);
            }
            // Success
            res.render('davatar/davatar_form', { title: 'Update DAvatar', clients:results.clients, davatar: results.davatar });
        });

};


// Post avatar update.
exports.davatar_update_post = [
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('client', 'Client must not be empty.').isLength({ min: 1 }).trim(),
    body('waist', 'waist measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('hip', 'hip measurement must not be empty').isLength({ min: 1 }).trim(),
    body('side_hip_depth', 'side_hip_depth measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('front_hip_depth', 'front_hip_depth measurement must not be empty').isLength({ min: 1 }).trim(),
    body('back_hip_depth', 'back_hip_depth measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('skirt_length', 'skirt_length measurement must not be empty').isLength({ min: 1 }).trim(),
    body('back_hip_arc', 'back_hip_arc measurement must not be empty.').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('name').trim().escape(),
    sanitizeBody('client').trim().escape(),
    sanitizeBody('waist').trim().escape(),
    sanitizeBody('hip').trim().escape(),
    sanitizeBody('side_hip_depth').trim().escape(),
    sanitizeBody('front_hip_depth').trim().escape(),
    sanitizeBody('back_hip_depth').trim().escape(),
    sanitizeBody('skirt_length').trim().escape(),
    sanitizeBody('back_hip_arc').trim().escape(),

    (req, res, next) => {

        // Gather all errors
        const errors = validationResult(req);
        
        // Be sure to use old id to save davatar
        var davatar = new DAvatar(
          { name: req.body.name,
            client: req.body.client,
            owner: req.user.id,
            waist: req.body.waist,
            hip: req.body.hip,
            side_hip_depth: req.body.side_hip_depth,
            front_hip_depth: req.body.front_hip_depth,
            back_hip_depth: req.body.back_hip_depth,
            skirt_length: req.body.skirt_length,
            back_hip_arc: req.body.back_hip_arc,
            _id:req.params.id // necessary so new id will not be assigned
           });

        if (!errors.isEmpty()) {
            async.parallel({
                clients: function(callback) {
                    Client.find(callback);
                }                
            }, function(err, results) {
                if (err) { return next(err); }

                res.render('davatar/davatar_form', { title: 'Update DAvatar',clients:results.clients, davatar: davatar, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            DAvatar.findByIdAndUpdate(req.params.id, davatar, {}, function (err,thedavatar) {
                if (err) { return next(err); }
                   // Successful
                   res.redirect(thedavatar.url);
                });
        }
    }
];

    //Get davatar draft page with canvas
exports.davatar_draft_get = function(req, res, next) { 
    DAvatar.findById(req.params.id, function(err, davatar){
        //save retrieved dat to file as json for canvas
        var jsonContent = JSON.stringify(davatar);
          console.log(jsonContent);
          fs.writeFile('public/data.json', jsonContent, 'utf-8', function (err) {
            if (err) {
              console.log("An error occured in passing JSON Object to file");
              return console.log(err);
            }
            console.log("JSON file has been saved.");
          })     // success. Draw canvas.
          res.render('davatar/davatar_draft', {
            title:'Draft DAvatar',
            davatar:davatar
      })
    });
}

