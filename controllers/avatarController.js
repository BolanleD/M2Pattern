const fs = require('fs');
var Avatar = require('../models/avatar');
var User = require('../models/user');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

// Display list of all Avatars.
exports.avatar_list = function(req, res, next) {

    Avatar.find({owner: req.user.id}, 'name')
      .exec(function (err, list_avatars) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('avatar/avatar_list', { title: 'Avatar List', avatar_list: list_avatars });
      });
      
  };
// Display the details page for a specific avatar.
exports.avatar_detail = function(req, res, next) {

    async.parallel({
        avatar: function(callback) {

            Avatar.findById(req.params.id)
              .exec(callback);
        },
     
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.avatar==null) { // No results.
            var err = new Error('Avatar not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('avatar/avatar_detail', { title: 'Name', avatar:  results.avatar } );
    });

};
// Display get avatar creation form.
exports.avatar_create_get = function(req, res, next) { 
  res.render('avatar/avatar_form', { title: 'Create Avatar'});
    };

// Post avatar creation code.
exports.avatar_create_post = [
    // Validate fields.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('waist', 'waist measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('hip', 'hip measurement must not be empty').isLength({ min: 1 }).trim(),
    body('side_hip_depth', 'side_hip_depth measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('front_hip_depth', 'front_hip_depth measurement must not be empty').isLength({ min: 1 }).trim(),
    body('back_hip_depth', 'back_hip_depth measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('skirt_length', 'skirt_length measurement must not be empty').isLength({ min: 1 }).trim(),
    body('back_hip_arc', 'back_hip_arc measurement must not be empty.').isLength({ min: 1 }).trim(),
      
    // use wildcard keys to sanitize fields
    sanitizeBody('*').trim().escape(),

    (req, res, next) => {
         
        // Gather all validation errors.
        const errors = validationResult(req);

        // Create the new avatar
        var avatar = new Avatar(
          { name: req.body.name,
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
            // Display errors if there are errors
            res.render('avatar/avatar_form', { title: 'Create Avatar', avatar: avatar, errors: errors.array() });
            return;
        }
        else {
            // Data is okay sosave avatar.
            avatar.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new avatar record.
                   res.redirect(avatar.url);
                });
        }
    }
];

// Get avatar delete form.
exports.avatar_delete_get = function(req, res, next) {

  async.parallel({
      avatar: function(callback) {
          Avatar.findById(req.params.id).exec(callback);
      }
  }, function(err, results) {
      if (err) { return next(err); }
      if (results.avatar==null) { // No results.
          res.redirect('/pattern/avatars');
      }
      // Successful, so render.
      res.render('avatar/avatar_delete', { title: 'Delete Avatar', avatar: results.avatar } );
  });

};

// Post avatar delete form.
exports.avatar_delete_post = function(req, res, next) {

  async.parallel({
      avatar: function(callback) {
          Avatar.findById(req.params.id).exec(callback);
      }
  }, function(err, results) {
      if (err) { return next(err); }
      // Success
      else {
        //Delete the avatar.
          Avatar.findByIdAndRemove(req.body.id, function deleteAvatar(err) {
              if (err) { return next(err); }
              // Success - go to avatars list.
              res.redirect('/pattern/avatars');
          });

      }
  });

};

// Get avatar update form.
exports.avatar_update_get = function(req, res, next) {

  Avatar.findById(req.params.id, function(err, avatar) {
      if (err) { return next(err); }
      if (avatar==null) { // No results.
          var err = new Error('Avatar not found');
          err.status = 404;
          return next(err);
      }
      if(avatar.owner != req.user._id) {
        res.status(500).send();
      }
      // Success render.
      res.render('avatar/avatar_form', { title: 'Update Avatar', avatar: avatar });
  });

};

// Post avatar update form.
exports.avatar_update_post = [
 
  //  validate fiels.
    body('name', 'Name must not be empty.').isLength({ min: 1 }).trim(),
    body('waist', 'waist measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('hip', 'hip measurement must not be empty').isLength({ min: 1 }).trim(),
    body('side_hip_depth', 'side_hip_depth measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('front_hip_depth', 'front_hip_depth measurement must not be empty').isLength({ min: 1 }).trim(),
    body('back_hip_depth', 'back_hip_depth measurement must not be empty.').isLength({ min: 1 }).trim(),
    body('skirt_length', 'skirt_length measurement must not be empty').isLength({ min: 1 }).trim(),
    body('back_hip_arc', 'back_hip_arc measurement must not be empty.').isLength({ min: 1 }).trim(),
  
  // use wildcard to sanitize.
  sanitizeBody('*').trim().escape(),

    (req, res, next) => {

      // Return all validation erros if there are any .
      const errors = validationResult(req);

  // Be sure to use the previous id for the updated avatar.
      var avatar = new Avatar(
        {
          name: req.body.name,
          owner: req.user.id,
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
         // show error messages if there are any
          res.render('avatar_form', { title: 'Update Avatar', avatar: avatar, errors: errors.array()});
      return;
      }
      else {
          // updatae avatar if form is valid
          Avatar.findByIdAndUpdate(req.params.id, avatar, {}, function (err,theavatar) {
              if (err) { return next(err); }
                 // Success.
                 res.redirect(theavatar.url);
              });
      }
  }
];

// Get draft avatar page. No need to post since it only renders the canvas.
exports.avatar_draft_get = function(req, res, next) { 
  Avatar.findById(req.params.id, function(err, avatar){
    // Save retrieved data as json in public folder so it can be used in canvas.
      var jsonContent = JSON.stringify(avatar);
        console.log(jsonContent);
        fs.writeFile('public/data.json', jsonContent, 'utf-8', function (err) {
          if (err) {
            console.log("An error occured in passing JSON Object to file");
            return console.log(err);
          }
          console.log("JSON file has been saved.");
        })     // render.
        res.render('avatar/avatar_draft', {
          title:'Draft avatar',
          avatar:avatar
    })
  });
}