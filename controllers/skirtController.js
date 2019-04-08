const fs = require('fs');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

let User = require('../models/user');
var DAvatar = require('../models/davatar');
var Avatar = require('../models/avatar');
var Client = require('../models/client');
var Skirt = require('../models/skirt');

// Get reports for admin of all data in db.
exports.report = function(req, res, next) {

  async.parallel({
        //count davatars
        davatar_count: function(callback) {
            DAvatar.count(callback);
        },
        //clount clients
        client_count: function(callback) {
            Client.count(callback);
        },
        //count avatars 
        avatar_count: function(callback) {
            Avatar.count(callback);
        },
        //count users
        user_count: function(callback) {
            User.count(callback);
        },
        //get list of all users
        users_list: function(callback) {
          User.find()
          .sort([['family_name', 'ascending']])
            .exec(callback)
         }
         }, function (err, results) {
              if (err) { return next(err); } 
              //render all results    
      res.render('all_users', {
        title: 'DB Statistics',
        davatar_count: results.davatar_count,
        user_count: results.user_count,
        client_count: results.client_count,
        avatar_count: results.avatar_count,
        users_list: results.users_list
      });
})}

// Display list of all built in Skirts.
exports.skirt_list = function(req, res, next) {

    Skirt.find({}, 'name')
      .exec(function (err, list_skirts) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('skirt/skirt_list', { title: 'Skirt List', skirt_list: list_skirts });
      });
      
  };
// Display detail page for a specific skirt.
exports.skirt_detail = function(req, res, next) {

    async.parallel({
        skirt: function(callback) {

            Skirt.findById(req.params.id)
              .exec(callback);
        },
     
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.skirt==null) { // No results.
            var err = new Error('Skirt not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('skirt/skirt_detail', { title: 'Name', skirt:  results.skirt } );
    });

};
// Get skirt creation form.
exports.skirt_create_get = function(req, res, next) { 
  res.render('skirt/skirt_form', { title: 'Create Skirt'});
    };

// Post skirt creation form.
exports.skirt_create_post = [
   

    // Validate fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('waist', 'waist measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('hip', 'hip measurement must not be empty').isLength({ min: 1 }).trim(),
    body('side_hip_depth', 'side_hip_depth measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('front_hip_depth', 'front_hip_depth measurement must not be empty').isLength({ min: 1 }).trim(),
    body('back_hip_depth', 'back_hip_depth measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('skirt_length', 'skirt_length measurement must not be empty').isLength({ min: 1 }).trim(),
    body('back_hip_arc', 'back_hip_arc measurement must not be empty.').isLength({ min: 1 }).trim(),
      
    // Sanitize fields
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
         
        // Get all errors
        const errors = validationResult(req);

        // Create skirt with valid data
        var skirt = new Skirt(
          { name: req.body.name,
            waist: req.body.waist,
            hip: req.body.hip,
            side_hip_depth: req.body.side_hip_depth,
            front_hip_depth: req.body.front_hip_depth,
            back_hip_depth: req.body.back_hip_depth,
            skirt_length: req.body.skirt_length,
            back_hip_arc: req.body.back_hip_arc            
           });

        if (!errors.isEmpty()) {
            res.render('skirt/skirt_form', { title: 'Create Skirt', skirt: skirt, errors: errors.array() });
            return;
        }
        else {
            // Data is valid. Save skirt.
            skirt.save(function (err) {
                if (err) { return next(err); }
                   //success
                   res.redirect(skirt.url);
                });
        }
    }
];

// Get skirt delete form.
exports.skirt_delete_get = function(req, res, next) {

  async.parallel({
      skirt: function(callback) {
          Skirt.findById(req.params.id).exec(callback);
      }
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.skirt==null) { // No results.
          res.redirect('/pattern/skirts');
      }
      // Success.
      res.render('skirt/skirt_delete', { title: 'Delete Skirt', skirt: results.skirt } );
  });

};

// Post skirt delete form.
exports.skirt_delete_post = function(req, res, next) {
  async.parallel({
      skirt: function(callback) {
          Skirt.findById(req.params.id).exec(callback);
      }
  }, function(err, results) {
      if (err) { return next(err); }
      // Success
      else {
          Skirt.findByIdAndRemove(req.body.id, function deleteSkirt(err) {
              if (err) { return next(err); }
              // Success.
              res.redirect('/pattern/skirts');
          });

      }
  });

};

//Get skirt updat form.
exports.skirt_update_get = function(req, res, next) {

  Skirt.findById(req.params.id, function(err, skirt) {
      if (err) { return next(err); }
      if (skirt==null) { // No results.
          var err = new Error('Skirt not found');
          err.status = 404;
          return next(err);
      }
       // Success.
      res.render('skirt/skirt_form', { title: 'Update Skirt', skirt: skirt });
  });

};

// Post skirt update form.
exports.skirt_update_post = [
    //validate fields
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('waist', 'waist measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('hip', 'hip measurement must not be empty').isLength({ min: 1 }).trim(),
    body('side_hip_depth', 'side_hip_depth measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('front_hip_depth', 'front_hip_depth measurement must not be empty').isLength({ min: 1 }).trim(),
    body('back_hip_depth', 'back_hip_depth measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('skirt_length', 'skirt_length measurement must not be empty').isLength({ min: 1 }).trim(),
    body('back_hip_arc', 'back_hip_arc measurement must not be empty.').isLength({ min: 1 }).trim(),
  
 
  sanitizeBody('*').trim().escape(),

  (req, res, next) => {

      // Get all validation errors
      const errors = validationResult(req);

  // Be sure to use previous id for skirt
      var skirt = new Skirt(
        {
          name: req.body.name,
          waist: req.body.waist,
          hip: req.body.hip,
          side_hip_depth: req.body.side_hip_depth,
          front_hip_depth: req.body.front_hip_depth,
          back_hip_depth: req.body.back_hip_depth,
          skirt_length: req.body.skirt_length,
          back_hip_arc: req.body.back_hip_arc,   
          _id: req.params.id
        }
      );


      if (!errors.isEmpty()) {
          res.render('skirt_form', { title: 'Update Skirt', skirt: skirt, errors: errors.array()});
      return;
      }
      else {
           Skirt.findByIdAndUpdate(req.params.id, skirt, {}, function (err,theskirt) {
              if (err) { return next(err); }
                 // Success
                 res.redirect(theskirt.url);
              });
      }
  }
];

exports.skirt_draft_get = function(req, res, next) { 
    Skirt.findById(req.params.id, function(err, skirt){
        var jsonContent = JSON.stringify(skirt);
          console.log(jsonContent);

          fs.writeFile('public/data.json', jsonContent, 'utf-8', function (err) {
            if (err) {
              console.log("An error occured in passing JSON Object to file");
              return console.log(err);
            }
            console.log("JSON file has been saved.");
          })

          res.render('skirt/skirt_draft', {
            title:'Draft Skirt',
            skirt:skirt
      })
    });
}

